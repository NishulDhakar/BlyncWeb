"use server";

import { db } from "@/lib/db";
import {
  users,
  sessions,
  accounts,
  subscriptions,
  gameScores,
  gameAttempts,
  userStreaks,
  systemSettings,
  mockTestAttempts,
} from "@/lib/schema";
import { getCachedSession, auth } from "@/lib/auth";
import { eq, and, ne, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface ProfilePreferences {
  targetRole: string;
  gradYear: string;
  targetCompanies: string[];
  bio: string;
  college: string;
  avatarPreset?: string;
}

export interface GameplayPreferences {
  soundEffects: boolean;
  reducedMotion: boolean;
  timerStyle: "countdown" | "progress" | "stealth";
  dailyGoal: number; // 3, 5, 10
  immediateFeedback: boolean;
  keyboardShortcuts: boolean;
  highContrast: boolean;
}

export interface NotificationPreferences {
  emailStreakAlerts: boolean;
  emailWeeklyReport: boolean;
  emailProductUpdates: boolean;
  practiceReminderTime: string; // e.g. "20:00"
}

export interface AppearancePreferences {
  theme: "light" | "dark" | "system";
  sidebarCollapsed: boolean;
  percentilePrecision: "exact" | "rounded";
}

export interface ActiveSessionItem {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  expiresAt: Date;
  isCurrent: boolean;
}

export interface UserSettingsPayload {
  user: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    isPro: boolean;
    subscriptionStatus: string | null;
    role: string;
  };
  subscription: {
    planType: string;
    expiresAt: Date | null;
    status: string;
    razorpaySubscriptionId: string | null;
  } | null;
  connectedProviders: string[]; // e.g. ['credential', 'google']
  activeSessions: ActiveSessionItem[];
  profile: ProfilePreferences;
  gameplay: GameplayPreferences;
  notifications: NotificationPreferences;
  appearance: AppearancePreferences;
  summary: {
    totalGamesPlayed: number;
    currentStreak: number;
    longestStreak: number;
  };
}

const DEFAULT_PROFILE: ProfilePreferences = {
  targetRole: "Software Development Engineer",
  gradYear: "2025",
  targetCompanies: ["Cognizant", "Accenture", "TCS"],
  bio: "Preparing for campus recruitment & cognitive aptitude tests.",
  college: "",
  avatarPreset: "brain",
};

const DEFAULT_GAMEPLAY: GameplayPreferences = {
  soundEffects: true,
  reducedMotion: false,
  timerStyle: "countdown",
  dailyGoal: 5,
  immediateFeedback: true,
  keyboardShortcuts: true,
  highContrast: false,
};

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  emailStreakAlerts: true,
  emailWeeklyReport: true,
  emailProductUpdates: false,
  practiceReminderTime: "20:00",
};

const DEFAULT_APPEARANCE: AppearancePreferences = {
  theme: "system",
  sidebarCollapsed: false,
  percentilePrecision: "exact",
};

/**
 * Fetch all candidate settings and associated session/security data
 */
export async function getSettingsData(): Promise<UserSettingsPayload | null> {
  const session = await getCachedSession();
  if (!session?.user?.id) return null;

  const userId = session.user.id;
  const currentSessionId = session.session?.id;

  // 1. Fetch user base record
  const [userRecord] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!userRecord) return null;

  // 2. Fetch subscription if any
  let subscriptionData: UserSettingsPayload["subscription"] = null;
  try {
    const [sub] = await db
      .select({
        planType: subscriptions.planType,
        expiresAt: subscriptions.expiresAt,
        status: subscriptions.status,
        razorpaySubscriptionId: subscriptions.razorpaySubscriptionId,
      })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (sub) {
      subscriptionData = sub;
    }
  } catch (err) {
    console.error("[getSettingsData] Error loading subscription:", err);
  }

  // 3. Fetch connected auth providers
  let connectedProviders: string[] = [];
  try {
    const accList = await db
      .select({ providerId: accounts.providerId })
      .from(accounts)
      .where(eq(accounts.userId, userId));
    connectedProviders = accList.map((a) => a.providerId);
  } catch (err) {
    console.error("[getSettingsData] Error loading accounts:", err);
  }

  // 4. Fetch active sessions
  let activeSessions: ActiveSessionItem[] = [];
  try {
    const sessionRows = await db
      .select({
        id: sessions.id,
        ipAddress: sessions.ipAddress,
        userAgent: sessions.userAgent,
        createdAt: sessions.createdAt,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(desc(sessions.createdAt));

    activeSessions = sessionRows.map((s) => ({
      id: s.id,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: s.id === currentSessionId,
    }));
  } catch (err) {
    console.error("[getSettingsData] Error loading sessions:", err);
  }

  // 5. Fetch saved user preferences from systemSettings (key: `user_pref:${userId}`)
  const prefKey = `user_pref:${userId}`;
  let profile = { ...DEFAULT_PROFILE };
  let gameplay = { ...DEFAULT_GAMEPLAY };
  let notifications = { ...DEFAULT_NOTIFICATIONS };
  let appearance = { ...DEFAULT_APPEARANCE };

  try {
    const [prefRow] = await db
      .select({ value: systemSettings.value })
      .from(systemSettings)
      .where(eq(systemSettings.key, prefKey))
      .limit(1);

    if (prefRow?.value && typeof prefRow.value === "object") {
      const v = prefRow.value as Record<string, any>;
      if (v.profile) profile = { ...DEFAULT_PROFILE, ...v.profile };
      if (v.gameplay) gameplay = { ...DEFAULT_GAMEPLAY, ...v.gameplay };
      if (v.notifications) notifications = { ...DEFAULT_NOTIFICATIONS, ...v.notifications };
      if (v.appearance) appearance = { ...DEFAULT_APPEARANCE, ...v.appearance };
    }
  } catch (err) {
    console.error("[getSettingsData] Error loading preferences:", err);
  }

  // 6. Summary metrics
  let totalGamesPlayed = 0;
  let currentStreak = 0;
  let longestStreak = 0;

  try {
    const scoresCount = await db
      .select({ id: gameScores.id })
      .from(gameScores)
      .where(eq(gameScores.userId, userId));
    totalGamesPlayed = scoresCount.length;

    const [streakRow] = await db
      .select({
        currentStreak: userStreaks.currentStreak,
        longestStreak: userStreaks.longestStreak,
      })
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId))
      .limit(1);

    if (streakRow) {
      currentStreak = streakRow.currentStreak;
      longestStreak = streakRow.longestStreak;
    }
  } catch (err) {
    console.error("[getSettingsData] Error loading stats:", err);
  }

  return {
    user: {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      image: userRecord.image,
      createdAt: userRecord.createdAt,
      isPro: userRecord.isPro,
      subscriptionStatus: userRecord.subscriptionStatus,
      role: userRecord.role,
    },
    subscription: subscriptionData,
    connectedProviders,
    activeSessions,
    profile,
    gameplay,
    notifications,
    appearance,
    summary: {
      totalGamesPlayed,
      currentStreak,
      longestStreak,
    },
  };
}

/**
 * Helper to update user preference JSON in systemSettings
 */
async function saveUserPreference(
  userId: string,
  section: "profile" | "gameplay" | "notifications" | "appearance",
  data: Record<string, any>
) {
  const prefKey = `user_pref:${userId}`;

  // Get existing preferences
  const [existing] = await db
    .select({ value: systemSettings.value })
    .from(systemSettings)
    .where(eq(systemSettings.key, prefKey))
    .limit(1);

  const currentVal =
    existing?.value && typeof existing.value === "object"
      ? (existing.value as Record<string, any>)
      : {};

  const updatedVal = {
    ...currentVal,
    [section]: {
      ...(currentVal[section] || {}),
      ...data,
    },
  };

  await db
    .insert(systemSettings)
    .values({
      key: prefKey,
      value: updatedVal,
      updatedBy: userId,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: systemSettings.key,
      set: {
        value: updatedVal,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    });
}

/**
 * Update candidate profile settings
 */
export async function updateProfileSettings(data: {
  name: string;
  image?: string | null;
  targetRole: string;
  gradYear: string;
  targetCompanies: string[];
  bio: string;
  college: string;
  avatarPreset?: string;
}) {
  const session = await getCachedSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  // 1. Update user name & image on users table
  await db
    .update(users)
    .set({
      name: data.name.trim(),
      image: data.image ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  // 2. Save extended profile preferences
  await saveUserPreference(userId, "profile", {
    targetRole: data.targetRole,
    gradYear: data.gradYear,
    targetCompanies: data.targetCompanies,
    bio: data.bio,
    college: data.college,
    avatarPreset: data.avatarPreset,
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  revalidatePath("/profile");

  return { success: true };
}

/**
 * Update gameplay engine preferences
 */
export async function updateGameplaySettings(prefs: GameplayPreferences) {
  const session = await getCachedSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await saveUserPreference(session.user.id, "gameplay", prefs);
  revalidatePath("/dashboard/settings");

  return { success: true };
}

/**
 * Update notification preferences
 */
export async function updateNotificationSettings(notifs: NotificationPreferences) {
  const session = await getCachedSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await saveUserPreference(session.user.id, "notifications", notifs);
  revalidatePath("/dashboard/settings");

  return { success: true };
}

/**
 * Update appearance preferences
 */
export async function updateAppearanceSettings(appearance: AppearancePreferences) {
  const session = await getCachedSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await saveUserPreference(session.user.id, "appearance", appearance);
  revalidatePath("/dashboard/settings");

  return { success: true };
}

/**
 * Change or set user password
 */
export async function changePasswordAction(data: {
  currentPassword?: string;
  newPassword: string;
}) {
  const session = await getCachedSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!data.newPassword || data.newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  const reqHeaders = await headers();

  try {
    if (data.currentPassword) {
      await auth.api.changePassword({
        body: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          revokeOtherSessions: false,
        },
        headers: reqHeaders,
      });
    } else {
      // User set password for first time (e.g. social login)
      await auth.api.setPassword({
        body: {
          newPassword: data.newPassword,
        },
        headers: reqHeaders,
      });
    }

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error: any) {
    console.error("[changePasswordAction] Failed:", error);
    const msg = error?.message || "Failed to update password. Please verify current password.";
    return { success: false, error: msg };
  }
}

/**
 * Revoke a specific active session
 */
export async function revokeSessionAction(sessionId: string) {
  const session = await getCachedSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(sessions)
    .where(and(eq(sessions.id, sessionId), eq(sessions.userId, session.user.id)));

  revalidatePath("/dashboard/settings");
  return { success: true };
}

/**
 * Revoke all active sessions except the current one
 */
export async function revokeAllOtherSessionsAction() {
  const session = await getCachedSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const currentSessionId = session.session?.id;
  if (!currentSessionId) {
    throw new Error("Unable to identify current session.");
  }

  await db
    .delete(sessions)
    .where(and(eq(sessions.userId, session.user.id), ne(sessions.id, currentSessionId)));

  revalidatePath("/dashboard/settings");
  return { success: true };
}

/**
 * Export all user data as JSON
 */
export async function exportUserDataAction() {
  const session = await getCachedSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const [userRecord] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const scoreRows = await db.select().from(gameScores).where(eq(gameScores.userId, userId));
  const attemptRows = await db.select().from(gameAttempts).where(eq(gameAttempts.userId, userId));
  const mockRows = await db.select().from(mockTestAttempts).where(eq(mockTestAttempts.userId, userId));
  const [streakRow] = await db.select().from(userStreaks).where(eq(userStreaks.userId, userId)).limit(1);

  const prefKey = `user_pref:${userId}`;
  const [prefRow] = await db
    .select({ value: systemSettings.value })
    .from(systemSettings)
    .where(eq(systemSettings.key, prefKey))
    .limit(1);

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    platform: "CognitiveGames - Blync Placement Suite",
    user: {
      id: userRecord?.id,
      name: userRecord?.name,
      email: userRecord?.email,
      role: userRecord?.role,
      isPro: userRecord?.isPro,
      createdAt: userRecord?.createdAt,
    },
    preferences: prefRow?.value ?? {},
    streaks: streakRow ?? null,
    totalScoresCount: scoreRows.length,
    scores: scoreRows,
    gameDailyAttempts: attemptRows,
    mockTestAttempts: mockRows,
  };

  return exportPayload;
}

/**
 * Reset game scores and test attempt history for candidate
 */
export async function resetGameHistoryAction() {
  const session = await getCachedSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  await Promise.all([
    db.delete(gameScores).where(eq(gameScores.userId, userId)),
    db.delete(gameAttempts).where(eq(gameAttempts.userId, userId)),
    db.delete(mockTestAttempts).where(eq(mockTestAttempts.userId, userId)),
    db
      .update(userStreaks)
      .set({ currentStreak: 1, lastActivityDate: new Date().toISOString().split("T")[0] })
      .where(eq(userStreaks.userId, userId)),
  ]);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  revalidatePath("/profile");

  return { success: true };
}

/**
 * Permanently delete candidate account
 */
export async function deleteAccountAction() {
  const session = await getCachedSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  // Deleting user row cascades to sessions, accounts, scores, streak, etc.
  await db.delete(users).where(eq(users.id, userId));

  // Also clean up preferences in systemSettings
  await db.delete(systemSettings).where(eq(systemSettings.key, `user_pref:${userId}`));

  const reqHeaders = await headers();
  try {
    await auth.api.signOut({ headers: reqHeaders });
  } catch {
    // Ignore sign out error if user row is gone
  }

  return { success: true };
}

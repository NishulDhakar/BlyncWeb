"use server";

import { db } from "@/lib/db";
import {
  users,
  subscriptions,
  payments,
  gameScores,
  gameAttempts,
  userStreaks,
  mockTestAttempts,
} from "@/lib/schema";
import { requireAdmin } from "./auth";
import { logAdminAction } from "./audit";
import { eq, desc, asc, and, ilike, or, sql, inArray, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export interface UserRow {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  status: string;
  isPro: boolean;
  subscriptionStatus: string | null;
  createdAt: Date;
  updatedAt: Date;
  gamesCount: number;
  mockTestsCount: number;
  revenue: number; // in INR
  lastActive: Date | null;
}

export async function getUsers({
  search = "",
  filter = "all",
  page = 1,
  pageSize = 20,
  sortKey = "createdAt",
  sortOrder = "desc",
}: {
  search?: string;
  filter?: string;
  page?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
}) {
  await requireAdmin("support");

  // Conditions
  const conditions = [];

  if (search.trim()) {
    const q = `%${search.trim()}%`;
    conditions.push(or(ilike(users.email, q), ilike(users.name, q)));
  }

  if (filter === "pro") {
    conditions.push(eq(users.isPro, true));
  } else if (filter === "free") {
    conditions.push(eq(users.isPro, false));
  } else if (filter === "suspended") {
    conditions.push(eq(users.status, "suspended"));
  } else if (filter === "cancelled") {
    conditions.push(eq(users.subscriptionStatus, "cancelled"));
  } else if (filter === "trial") {
    conditions.push(eq(users.subscriptionStatus, "trial"));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Total count
  const [totalRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(whereClause);
  const total = totalRes?.count ?? 0;

  // Query users
  const offset = (page - 1) * pageSize;
  const orderCol = sortKey === "createdAt" ? users.createdAt : users.name;
  const orderFn = sortOrder === "asc" ? asc(orderCol) : desc(orderCol);

  const rawUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      role: users.role,
      status: users.status,
      isPro: users.isPro,
      subscriptionStatus: users.subscriptionStatus,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(whereClause)
    .orderBy(orderFn)
    .limit(pageSize)
    .offset(offset);

  const userIds = rawUsers.map((u) => u.id);

  if (userIds.length === 0) {
    return { users: [], total, page, totalPages: 1 };
  }

  // Aggregate stats per user: games played, mock tests, total revenue, last activity
  const [gameCounts, mockCounts, revenueCounts, lastScores] = await Promise.all([
    db
      .select({
        userId: gameScores.userId,
        count: sql<number>`count(*)::int`,
      })
      .from(gameScores)
      .where(inArray(gameScores.userId, userIds))
      .groupBy(gameScores.userId),

    db
      .select({
        userId: mockTestAttempts.userId,
        count: sql<number>`count(*)::int`,
      })
      .from(mockTestAttempts)
      .where(inArray(mockTestAttempts.userId, userIds))
      .groupBy(mockTestAttempts.userId),

    db
      .select({
        userId: payments.userId,
        total: sql<number>`coalesce(sum(amount), 0)::int`,
      })
      .from(payments)
      .where(
        and(
          inArray(payments.userId, userIds),
          eq(payments.status, "succeeded")
        )
      )
      .groupBy(payments.userId),

    db
      .select({
        userId: gameScores.userId,
        lastDate: sql<Date>`max("createdAt")`,
      })
      .from(gameScores)
      .where(inArray(gameScores.userId, userIds))
      .groupBy(gameScores.userId),
  ]);

  const gameMap = new Map(gameCounts.map((g) => [g.userId, g.count]));
  const mockMap = new Map(mockCounts.map((m) => [m.userId, m.count]));
  const revMap = new Map(
    revenueCounts.map((r) => [r.userId, Math.round(r.total / 100)])
  );
  const lastMap = new Map(lastScores.map((l) => [l.userId, l.lastDate]));

  const result: UserRow[] = rawUsers.map((u) => ({
    ...u,
    gamesCount: gameMap.get(u.id) ?? 0,
    mockTestsCount: mockMap.get(u.id) ?? 0,
    revenue: revMap.get(u.id) ?? 0,
    lastActive: lastMap.get(u.id) ?? u.updatedAt ?? u.createdAt,
  }));

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return { users: result, total, page, totalPages };
}

export async function getUserDetails(id: string) {
  await requireAdmin("support");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!user) return null;

  // Query user's subscriptions, payments, recent scores, streak, mock tests
  const [userSubs, userPayments, userScores, userStreak, userMocks] =
    await Promise.all([
      db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, id))
        .orderBy(desc(subscriptions.createdAt)),

      db
        .select()
        .from(payments)
        .where(eq(payments.userId, id))
        .orderBy(desc(payments.createdAt)),

      db
        .select()
        .from(gameScores)
        .where(eq(gameScores.userId, id))
        .orderBy(desc(gameScores.createdAt))
        .limit(25),

      db
        .select()
        .from(userStreaks)
        .where(eq(userStreaks.userId, id))
        .limit(1),

      db
        .select()
        .from(mockTestAttempts)
        .where(eq(mockTestAttempts.userId, id))
        .orderBy(desc(mockTestAttempts.createdAt)),
    ]);

  // Aggregate stats
  const totalRevenue = userPayments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      status: user.status,
      notes: user.notes,
      isPro: user.isPro,
      subscriptionStatus: user.subscriptionStatus,
      razorpaySubscriptionId: user.razorpaySubscriptionId,
      razorpayCustomerId: user.razorpayCustomerId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    stats: {
      gamesPlayed: userScores.length,
      mockTestsCompleted: userMocks.length,
      totalRevenueINR: Math.round(totalRevenue / 100),
      currentStreak: userStreak[0]?.currentStreak ?? 0,
      longestStreak: userStreak[0]?.longestStreak ?? 0,
    },
    subscriptions: userSubs,
    payments: userPayments,
    gameScores: userScores,
    mockTests: userMocks,
  };
}

export async function updateUserPlan(userId: string, isPro: boolean) {
  const admin = await requireAdmin("admin");

  const [targetUser] = await db
    .select({ email: users.email, isPro: users.isPro })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!targetUser) throw new Error("User not found");

  await db
    .update(users)
    .set({
      isPro,
      subscriptionStatus: isPro ? "active" : "cancelled",
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "user.plan_change",
    targetType: "user",
    targetId: userId,
    metadata: {
      email: targetUser.email,
      from: targetUser.isPro ? "pro" : "free",
      to: isPro ? "pro" : "free",
    },
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}

export async function grantPremiumAccess({
  email,
  days,
  reasonTag = "Given by Admin",
}: {
  email: string;
  days: number;
  reasonTag?: string;
}) {
  const admin = await requireAdmin("admin");

  if (!email || !email.trim()) {
    throw new Error("Student email address is required");
  }

  const parsedDays = Number(days);
  if (isNaN(parsedDays) || parsedDays <= 0) {
    throw new Error("Duration must be a positive number of days");
  }

  const cleanEmail = email.trim().toLowerCase();
  const [targetUser] = await db
    .select()
    .from(users)
    .where(ilike(users.email, cleanEmail))
    .limit(1);

  if (!targetUser) {
    throw new Error(`No registered student account found with email "${cleanEmail}"`);
  }

  // Check if they currently have an active subscription with a future expiry
  const [latestActiveSub] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, targetUser.id),
        eq(subscriptions.status, "active"),
        gte(subscriptions.expiresAt, new Date())
      )
    )
    .orderBy(desc(subscriptions.expiresAt))
    .limit(1);

  const baseDate =
    latestActiveSub?.expiresAt && latestActiveSub.expiresAt > new Date()
      ? new Date(latestActiveSub.expiresAt)
      : new Date();

  const expiresAt = new Date(baseDate.getTime() + parsedDays * 24 * 60 * 60 * 1000);
  const tag = (reasonTag && reasonTag.trim()) || "Given by Admin";

  // Create an admin-grant subscription entry so it logs in subscriptions ledger
  const subId = `grant_${randomUUID().slice(0, 10)}`;
  await db.insert(subscriptions).values({
    id: subId,
    userId: targetUser.id,
    planType: "admin_grant",
    razorpaySubscriptionId: subId,
    status: "active",
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Prepare updated notes with timestamped audit trail
  const timestamp = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const auditLine = `[${timestamp}] Granted ${parsedDays} days Pro (Tag: "${tag}", expires: ${expiresAt.toLocaleDateString("en-IN")}) by ${admin.email}`;
  const updatedNotes = targetUser.notes ? `${targetUser.notes}\n${auditLine}` : auditLine;

  // Update user pro status
  await db
    .update(users)
    .set({
      isPro: true,
      subscriptionStatus: "active",
      notes: updatedNotes,
      updatedAt: new Date(),
    })
    .where(eq(users.id, targetUser.id));

  // Log to audit log
  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "user.grant_premium",
    targetType: "user",
    targetId: targetUser.id,
    metadata: {
      userEmail: targetUser.email,
      userName: targetUser.name,
      days: parsedDays,
      tag,
      expiresAt: expiresAt.toISOString(),
      grantedByAdmin: admin.email,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${targetUser.id}`);
  revalidatePath("/admin/subscriptions");
  revalidatePath("/dashboard");

  return {
    success: true,
    user: {
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
    },
    days: parsedDays,
    tag,
    expiresAt,
  };
}

export async function updateUserStatus(
  userId: string,
  status: "active" | "suspended"
) {
  const admin = await requireAdmin("admin");

  const [targetUser] = await db
    .select({ email: users.email, status: users.status })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!targetUser) throw new Error("User not found");

  await db
    .update(users)
    .set({ status, updatedAt: new Date() })
    .where(eq(users.id, userId));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: status === "suspended" ? "user.suspended" : "user.reactivated",
    targetType: "user",
    targetId: userId,
    metadata: {
      email: targetUser.email,
      previousStatus: targetUser.status,
      newStatus: status,
    },
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}

export async function updateUserNotes(userId: string, notes: string) {
  const admin = await requireAdmin("support");

  await db
    .update(users)
    .set({ notes, updatedAt: new Date() })
    .where(eq(users.id, userId));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "user.update_notes",
    targetType: "user",
    targetId: userId,
  });

  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}

export async function deleteUser(userId: string) {
  const admin = await requireAdmin("super_admin");

  const [targetUser] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!targetUser) throw new Error("User not found");

  await db.delete(users).where(eq(users.id, userId));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "user.deleted",
    targetType: "user",
    targetId: userId,
    metadata: { email: targetUser.email },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function bulkUpdateUsers(
  userIds: string[],
  action: "suspend" | "reactivate" | "make_pro" | "make_free"
) {
  const admin = await requireAdmin("admin");
  if (!userIds || userIds.length === 0) return { success: false };

  if (action === "suspend") {
    await db
      .update(users)
      .set({ status: "suspended", updatedAt: new Date() })
      .where(inArray(users.id, userIds));
  } else if (action === "reactivate") {
    await db
      .update(users)
      .set({ status: "active", updatedAt: new Date() })
      .where(inArray(users.id, userIds));
  } else if (action === "make_pro") {
    await db
      .update(users)
      .set({ isPro: true, subscriptionStatus: "active", updatedAt: new Date() })
      .where(inArray(users.id, userIds));
  } else if (action === "make_free") {
    await db
      .update(users)
      .set({
        isPro: false,
        subscriptionStatus: "cancelled",
        updatedAt: new Date(),
      })
      .where(inArray(users.id, userIds));
  }

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: `users.bulk_${action}`,
    targetType: "user",
    targetId: `${userIds.length} users`,
    metadata: { userIdsCount: userIds.length },
  });

  revalidatePath("/admin/users");
  return { success: true, count: userIds.length };
}

"use server";

import { db } from "@/lib/db";
import { userStreaks } from "@/lib/schema";
import { eq } from "drizzle-orm";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function yesterdayUTC(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Upserts a streak row for the given userId using UTC day boundaries.
 * - Same day visited   → no change, return current values
 * - Consecutive day    → increment currentStreak
 * - Missed ≥1 day      → reset currentStreak to 1
 * longestStreak is updated whenever currentStreak exceeds it.
 *
 * Returns zeroes (silently) if the table doesn't exist yet — prevents
 * the whole page from crashing during initial DB setup.
 */
export async function upsertStreak(userId: string): Promise<StreakData> {
  const today = todayUTC();
  const yesterday = yesterdayUTC();

  let existing: typeof userStreaks.$inferSelect | undefined;
  try {
    existing = await db.query.userStreaks.findFirst({
      where: eq(userStreaks.userId, userId),
    });
  } catch {
    // Table not yet created — fail silently, return neutral values
    return { currentStreak: 0, longestStreak: 0 };
  }

  try {
    if (!existing) {
      await db.insert(userStreaks).values({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
        updatedAt: new Date(),
      });
      return { currentStreak: 1, longestStreak: 1 };
    }

    // Already recorded today — nothing to do
    if (existing.lastActivityDate === today) {
      return {
        currentStreak: existing.currentStreak,
        longestStreak: existing.longestStreak,
      };
    }

    const newStreak =
      existing.lastActivityDate === yesterday
        ? existing.currentStreak + 1  // consecutive day
        : 1;                           // missed at least one day — reset

    const newLongest = Math.max(newStreak, existing.longestStreak);

    await db
      .update(userStreaks)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActivityDate: today,
        updatedAt: new Date(),
      })
      .where(eq(userStreaks.userId, userId));

    return { currentStreak: newStreak, longestStreak: newLongest };
  } catch {
    return { currentStreak: 0, longestStreak: 0 };
  }
}

/**
 * Read-only fetch of streak for a user. Returns zeroes if no row yet.
 */
export async function getStreak(userId: string): Promise<StreakData> {
  const row = await db.query.userStreaks.findFirst({
    where: eq(userStreaks.userId, userId),
  });
  return {
    currentStreak: row?.currentStreak ?? 0,
    longestStreak: row?.longestStreak ?? 0,
  };
}

"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { gameAttempts, users } from "@/lib/schema";
import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { randomUUID } from "crypto";

const FREE_DAILY_LIMIT = 3;

/** Returns today's date as YYYY-MM-DD in UTC */
function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Check whether the current user is allowed to start a new attempt.
 * Pro users are always allowed.
 * Free users get FREE_DAILY_LIMIT attempts per game per day.
 */
export async function checkAttemptLimit(
  gameSlug: string
): Promise<{ allowed: boolean; attemptsUsed: number; isPro: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { allowed: false, attemptsUsed: 0, isPro: false };
  }

  const [user] = await db
    .select({ isPro: users.isPro })
    .from(users)
    .where(eq(users.id, session.user.id));

  if (!user) return { allowed: false, attemptsUsed: 0, isPro: false };
  if (user.isPro) return { allowed: true, attemptsUsed: 0, isPro: true };

  const today = todayUTC();
  const [row] = await db
    .select({ count: gameAttempts.count })
    .from(gameAttempts)
    .where(
      and(
        eq(gameAttempts.userId, session.user.id),
        eq(gameAttempts.gameSlug, gameSlug),
        eq(gameAttempts.date, today)
      )
    );

  const attemptsUsed = row?.count ?? 0;
  return {
    allowed: attemptsUsed < FREE_DAILY_LIMIT,
    attemptsUsed,
    isPro: false,
  };
}

/**
 * Increment the attempt counter for the current user + game + today.
 * Call this when a game actually starts (not just page load).
 * No-op for Pro users.
 */
export async function recordAttempt(gameSlug: string): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;

  const [user] = await db
    .select({ isPro: users.isPro })
    .from(users)
    .where(eq(users.id, session.user.id));

  if (!user || user.isPro) return;

  const today = todayUTC();
  const userId = session.user.id;

  // Upsert: insert with count=1, or increment if row already exists
  await db
    .insert(gameAttempts)
    .values({ id: randomUUID(), userId, gameSlug, date: today, count: 1 })
    .onConflictDoUpdate({
      target: [gameAttempts.userId, gameAttempts.gameSlug, gameAttempts.date],
      set: { count: sql`${gameAttempts.count} + 1` },
    });
}

"use server";

/**
 * Blync is a 100% free app — all games have unlimited access.
 * No attempt limits, no daily caps, no restrictions whatsoever.
 * Every user gets full, unrestricted access to all games for free.
 */

/**
 * Check whether the current user is allowed to start a new attempt.
 * Always returns allowed — this is a free app with unlimited plays.
 */
export async function checkAttemptLimit(
  _gameSlug: string
): Promise<{ allowed: boolean; attemptsUsed: number; isPro: boolean }> {
  // All users have unlimited free access — always allowed
  return { allowed: true, attemptsUsed: 0, isPro: false };
}

/**
 * Record an attempt — currently a no-op since there are no limits.
 * All games are completely free with no usage tracking needed.
 */
export async function recordAttempt(_gameSlug: string): Promise<void> {
  // No-op: free app with unlimited access, no tracking needed
}

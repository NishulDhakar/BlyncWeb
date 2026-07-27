"use server";

/**
 * Attempt limits are currently handled by the paid route gates.
 * These helpers remain as no-ops for game code that still imports them.
 */

/**
 * Check whether the current user is allowed to start a new attempt.
 * Always returns allowed because access is checked before gameplay loads.
 */
export async function checkAttemptLimit(
  _gameSlug: string
): Promise<{ allowed: boolean; attemptsUsed: number; isPro: boolean }> {
  return { allowed: true, attemptsUsed: 0, isPro: false };
}

/**
 * Record an attempt — currently a no-op.
 */
export async function recordAttempt(_gameSlug: string): Promise<void> {
  // No-op: route-level subscription checks control access.
}

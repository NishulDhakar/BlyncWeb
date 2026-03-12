"use server";

import { db } from "@/lib/db";
import { gameScores, users } from "@/lib/schema";
import { eq, max, sql } from "drizzle-orm";

const GAME_NAMES: Record<string, string> = {
  "switch-challenge": "Switch Challenge",
  "digit-challenge": "Digit Challenge",
  "deductive-challenge": "Deductive Challenge",
  "motion-challenge": "Motion Challenge",
  "inductive-challenge": "Inductive Challenge",
};

export interface GameStat {
  gameId: string;
  gameName: string;
  bestScore: number;
  gamesPlayed: number;
}

export interface ProfileStats {
  totalGamesPlayed: number;
  totalScore: number;
  rank: number | null;
  gameStats: GameStat[];
  memberSince: Date;
}

export async function getProfileStats(userId: string): Promise<ProfileStats> {
  // All scores for this user
  const allScores = await db
    .select({ gameId: gameScores.gameId, score: gameScores.score })
    .from(gameScores)
    .where(eq(gameScores.userId, userId));

  const totalGamesPlayed = allScores.length;

  const bestByGame = new Map<string, number>();
  const countByGame = new Map<string, number>();
  for (const s of allScores) {
    bestByGame.set(s.gameId, Math.max(s.score, bestByGame.get(s.gameId) ?? 0));
    countByGame.set(s.gameId, (countByGame.get(s.gameId) ?? 0) + 1);
  }

  const totalScore = Array.from(bestByGame.values()).reduce((a, b) => a + b, 0);

  const gameStats: GameStat[] = Array.from(bestByGame.entries()).map(([gameId, bestScore]) => ({
    gameId,
    gameName: GAME_NAMES[gameId] ?? gameId,
    bestScore,
    gamesPlayed: countByGame.get(gameId) ?? 0,
  }));
  gameStats.sort((a, b) => b.bestScore - a.bestScore);

  // Compute overall rank
  const allBest = await db
    .select({
      userId: gameScores.userId,
      gameId: gameScores.gameId,
      bestScore: max(gameScores.score),
    })
    .from(gameScores)
    .groupBy(gameScores.userId, gameScores.gameId);

  const userTotals = new Map<string, number>();
  for (const entry of allBest) {
    userTotals.set(entry.userId, (userTotals.get(entry.userId) ?? 0) + (entry.bestScore ?? 0));
  }

  const myTotal = userTotals.get(userId) ?? 0;
  let rank = 1;
  for (const [uid, total] of userTotals) {
    if (uid !== userId && total > myTotal) rank++;
  }

  // Member since
  const user = await db
    .select({ createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return {
    totalGamesPlayed,
    totalScore,
    rank: totalGamesPlayed > 0 ? rank : null,
    gameStats,
    memberSince: user[0]?.createdAt ?? new Date(),
  };
}

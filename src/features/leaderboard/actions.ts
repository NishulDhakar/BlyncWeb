"use server";

import { db } from "@/lib/db";
import { gameScores, users } from "@/lib/schema";
import { eq, desc, max, sql } from "drizzle-orm";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string | null;
  image: string | null;
  score: number;
};

export async function getLeaderboard(gameId?: string): Promise<LeaderboardEntry[]> {
  try {
    if (gameId) {
      // Best score per user for a specific game
      const scores = await db
        .select({ userId: gameScores.userId, maxScore: max(gameScores.score) })
        .from(gameScores)
        .where(eq(gameScores.gameId, gameId))
        .groupBy(gameScores.userId)
        .orderBy(desc(max(gameScores.score)))
        .limit(30);

      const userIds = scores.map((s) => s.userId);
      if (userIds.length === 0) return [];

      const userRows = await db
        .select({ id: users.id, name: users.name, image: users.image })
        .from(users)
        .where(sql`${users.id} = ANY(ARRAY[${sql.join(userIds.map(id => sql`${id}`), sql`, `)}])`);

      return scores
        .map((s, i) => {
          const user = userRows.find((u) => u.id === s.userId);
          if (!user) return null;
          return {
            rank: i + 1,
            userId: user.id,
            name: user.name,
            image: user.image,
            score: s.maxScore ?? 0,
          };
        })
        .filter((x): x is LeaderboardEntry => x !== null);
    } else {
      // Overall: sum of best scores per game per user
      const allBest = await db
        .select({
          userId: gameScores.userId,
          gameId: gameScores.gameId,
          bestScore: max(gameScores.score),
        })
        .from(gameScores)
        .groupBy(gameScores.userId, gameScores.gameId);

      const userTotals = new Map<string, number>();
      for (const row of allBest) {
        userTotals.set(row.userId, (userTotals.get(row.userId) ?? 0) + (row.bestScore ?? 0));
      }

      const sorted = Array.from(userTotals.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50);

      const userIds = sorted.map(([id]) => id);
      if (userIds.length === 0) return [];

      const userRows = await db
        .select({ id: users.id, name: users.name, image: users.image })
        .from(users)
        .where(sql`${users.id} = ANY(ARRAY[${sql.join(userIds.map(id => sql`${id}`), sql`, `)}])`);

      return sorted
        .map(([id, score], i) => {
          const user = userRows.find((u) => u.id === id);
          if (!user) return null;
          return {
            rank: i + 1,
            userId: user.id,
            name: user.name,
            image: user.image,
            score,
          };
        })
        .filter((x): x is LeaderboardEntry => x !== null);
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

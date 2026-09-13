"use server";

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string | null;
  image: string | null;
  score: number;
  gamesPlayed?: number;
  isPro?: boolean;
  topGame?: string | null;
  percentile?: string;
};

export type UserStanding = {
  rank: number;
  score: number;
  gamesPlayed: number;
  totalCandidates: number;
  percentile: string;
};

export type LeaderboardPlatformStats = {
  activeCandidates: number;
  totalRounds: number;
  leaderScore: number;
};

function calculatePercentile(rank: number, totalCandidates: number): string {
  if (rank === 1) return "Top 0.1% (#1)";
  const pct = Math.max(1, Math.round((rank / Math.max(1, totalCandidates)) * 100));
  if (pct <= 1) return "Top 1%";
  if (pct <= 5) return "Top 5%";
  if (pct <= 10) return "Top 10%";
  if (pct <= 25) return "Top 25%";
  return `Top ${pct}%`;
}

export async function getLeaderboard(
  gameId?: string,
  limit: number = 50
): Promise<LeaderboardEntry[]> {
  try {
    if (gameId && gameId !== "overall") {
      // Best score per user for a specific game
      const rows = (await db.execute(sql`
        SELECT 
          gs."userId", 
          MAX(gs.score)::int as score, 
          COUNT(*)::int as "gamesPlayed",
          u.name, 
          u.image, 
          COALESCE(u."isPro", false) as "isPro"
        FROM game_score gs
        JOIN "user" u ON u.id = gs."userId"
        WHERE gs."gameId" = ${gameId}
        GROUP BY gs."userId", u.name, u.image, u."isPro"
        ORDER BY score DESC, "gamesPlayed" DESC
        LIMIT ${limit};
      `)) as any[];

      const totalCandidates = rows.length;

      return rows.map((r, i) => ({
        rank: i + 1,
        userId: r.userId,
        name: r.name,
        image: r.image,
        score: Number(r.score) || 0,
        gamesPlayed: Number(r.gamesPlayed) || 1,
        isPro: Boolean(r.isPro),
        topGame: gameId,
        percentile: calculatePercentile(i + 1, Math.max(100, totalCandidates)),
      }));
    } else {
      // Overall: sum of highest scores across games + total rounds played
      const rows = (await db.execute(sql`
        WITH user_bests AS (
          SELECT "userId", "gameId", MAX(score) as best_score, COUNT(*)::int as rounds
          FROM game_score
          GROUP BY "userId", "gameId"
        ),
        user_totals AS (
          SELECT 
            "userId", 
            SUM(best_score)::int as total_score, 
            SUM(rounds)::int as total_rounds
          FROM user_bests
          GROUP BY "userId"
        )
        SELECT 
          ut."userId", 
          ut.total_score as score, 
          ut.total_rounds as "gamesPlayed", 
          u.name, 
          u.image, 
          COALESCE(u."isPro", false) as "isPro",
          COUNT(*) OVER ()::int as total_players
        FROM user_totals ut
        JOIN "user" u ON u.id = ut."userId"
        ORDER BY ut.total_score DESC, ut.total_rounds DESC
        LIMIT ${limit};
      `)) as any[];

      return rows.map((r, i) => {
        const total = Number(r.total_players) || rows.length || 1;
        return {
          rank: i + 1,
          userId: r.userId,
          name: r.name,
          image: r.image,
          score: Number(r.score) || 0,
          gamesPlayed: Number(r.gamesPlayed) || 1,
          isPro: Boolean(r.isPro),
          percentile: calculatePercentile(i + 1, total),
        };
      });
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

export async function getUserStanding(
  userId: string,
  gameId?: string
): Promise<UserStanding | null> {
  try {
    if (gameId && gameId !== "overall") {
      const rows = (await db.execute(sql`
        WITH game_bests AS (
          SELECT 
            "userId",
            MAX(score)::int as max_score,
            COUNT(*)::int as rounds
          FROM game_score
          WHERE "gameId" = ${gameId}
          GROUP BY "userId"
        ),
        ranked AS (
          SELECT 
            "userId",
            max_score as score,
            rounds as "gamesPlayed",
            RANK() OVER (ORDER BY max_score DESC, rounds DESC)::int as rank,
            COUNT(*) OVER ()::int as total_players
          FROM game_bests
        )
        SELECT * FROM ranked WHERE "userId" = ${userId};
      `)) as any[];

      if (rows.length === 0) return null;
      const r = rows[0];
      const rank = Number(r.rank) || 1;
      const totalCandidates = Number(r.total_players) || 1;

      return {
        rank,
        score: Number(r.score) || 0,
        gamesPlayed: Number(r.gamesPlayed) || 0,
        totalCandidates,
        percentile: calculatePercentile(rank, totalCandidates),
      };
    } else {
      const rows = (await db.execute(sql`
        WITH user_bests AS (
          SELECT "userId", "gameId", MAX(score) as best_score, COUNT(*)::int as rounds
          FROM game_score
          GROUP BY "userId", "gameId"
        ),
        user_totals AS (
          SELECT 
            "userId", 
            SUM(best_score)::int as total_score, 
            SUM(rounds)::int as total_rounds
          FROM user_bests
          GROUP BY "userId"
        ),
        ranked AS (
          SELECT 
            "userId",
            total_score as score,
            total_rounds as "gamesPlayed",
            RANK() OVER (ORDER BY total_score DESC, total_rounds DESC)::int as rank,
            COUNT(*) OVER ()::int as total_players
          FROM user_totals
        )
        SELECT * FROM ranked WHERE "userId" = ${userId};
      `)) as any[];

      if (rows.length === 0) return null;
      const r = rows[0];
      const rank = Number(r.rank) || 1;
      const totalCandidates = Number(r.total_players) || 1;

      return {
        rank,
        score: Number(r.score) || 0,
        gamesPlayed: Number(r.gamesPlayed) || 0,
        totalCandidates,
        percentile: calculatePercentile(rank, totalCandidates),
      };
    }
  } catch (error) {
    console.error("Error fetching user standing:", error);
    return null;
  }
}

export async function getLeaderboardStats(): Promise<LeaderboardPlatformStats> {
  try {
    const rows = (await db.execute(sql`
      SELECT 
        COUNT(DISTINCT "userId")::int as active_candidates,
        COUNT(*)::int as total_rounds,
        COALESCE(MAX(score), 0)::int as leader_score
      FROM game_score;
    `)) as any[];

    if (!rows || rows.length === 0) {
      return { activeCandidates: 0, totalRounds: 0, leaderScore: 0 };
    }

    return {
      activeCandidates: Number(rows[0].active_candidates) || 0,
      totalRounds: Number(rows[0].total_rounds) || 0,
      leaderScore: Number(rows[0].leader_score) || 0,
    };
  } catch (error) {
    console.error("Error fetching leaderboard stats:", error);
    return { activeCandidates: 0, totalRounds: 0, leaderScore: 0 };
  }
}


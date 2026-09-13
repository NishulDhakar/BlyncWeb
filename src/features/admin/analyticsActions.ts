"use server";

import { db } from "@/lib/db";
import {
  users,
  gameScores,
  payments,
  subscriptions,
  companies,
  games,
} from "@/lib/schema";
import { requireAdmin } from "./auth";
import { sql, eq, gte, desc, inArray, and } from "drizzle-orm";

export interface AnalyticsData {
  userStats: {
    dau: number;
    wau: number;
    mau: number;
    totalUsers: number;
    activationRate: number;
    retentionRate: number;
  };
  revenueStats: {
    grossRevenueINR: number;
    netRevenueINR: number;
    refundsINR: number;
    mrrINR: number;
    arrINR: number;
    conversionRate: number;
    churnRate: number;
  };
  gameAnalytics: {
    gameId: string;
    gameName: string;
    attempts: number;
    avgScore: number;
    maxScore: number;
    category: string;
  }[];
  companyAnalytics: {
    companySlug: string;
    companyName: string;
    totalAttempts: number;
    avgScore: number;
    gamesCount: number;
  }[];
}

export async function getDeepAnalytics(): Promise<AnalyticsData> {
  await requireAdmin("support");

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // 1. User metrics
  const [totalUsersRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users);
  const totalUsers = totalUsersRes?.count ?? 0;

  const [dauRes] = await db
    .select({ count: sql<number>`count(distinct "userId")::int` })
    .from(gameScores)
    .where(gte(gameScores.createdAt, oneDayAgo));
  const dau = dauRes?.count ?? 0;

  const [wauRes] = await db
    .select({ count: sql<number>`count(distinct "userId")::int` })
    .from(gameScores)
    .where(gte(gameScores.createdAt, sevenDaysAgo));
  const wau = wauRes?.count ?? 0;

  const [mauRes] = await db
    .select({ count: sql<number>`count(distinct "userId")::int` })
    .from(gameScores)
    .where(gte(gameScores.createdAt, thirtyDaysAgo));
  const mau = mauRes?.count ?? 0;

  const [activatedUsersRes] = await db
    .select({ count: sql<number>`count(distinct "userId")::int` })
    .from(gameScores);
  const activatedCount = activatedUsersRes?.count ?? 0;
  const activationRate =
    totalUsers > 0
      ? Number(((activatedCount / totalUsers) * 100).toFixed(1))
      : 0;

  const retentionRate =
    mau > 0 ? Number(((dau / mau) * 100).toFixed(1)) : 0;

  // 2. Revenue & MRR / ARR
  const [revRes] = await db
    .select({
      gross: sql<number>`coalesce(sum(amount), 0)::int`,
      refunds: sql<number>`coalesce(sum("refundedAmount"), 0)::int`,
    })
    .from(payments);

  const grossRevenueINR = Math.round((revRes?.gross ?? 0) / 100);
  const refundsINR = Math.round((revRes?.refunds ?? 0) / 100);
  const netRevenueINR = Math.max(0, grossRevenueINR - refundsINR);

  const [monthlySubs] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subscriptions)
    .where(and(eq(subscriptions.status, "active"), eq(subscriptions.planType, "monthly")));

  const [biannualSubs] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subscriptions)
    .where(and(eq(subscriptions.status, "active"), eq(subscriptions.planType, "biannual")));

  const [proUsersRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.isPro, true));
  const proCount = proUsersRes?.count ?? 0;

  const [cancelledSubsRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subscriptions)
    .where(eq(subscriptions.status, "cancelled"));
  const cancelledCount = cancelledSubsRes?.count ?? 0;

  const activeMonthly = monthlySubs?.count ?? 0;
  const activeBiannual = biannualSubs?.count ?? 0;
  const activeSubs = activeMonthly + activeBiannual;

  const mrrINR = Math.round(activeMonthly * 49 + (activeBiannual * 199) / 6);
  const arrINR = mrrINR * 12;

  const conversionRate =
    totalUsers > 0 ? Number(((proCount / totalUsers) * 100).toFixed(2)) : 0;

  const churnRate =
    activeSubs + cancelledCount > 0
      ? Number(((cancelledCount / (activeSubs + cancelledCount)) * 100).toFixed(1))
      : 0;

  // 3. Game Analytics
  const gameStats = await db
    .select({
      gameId: gameScores.gameId,
      attempts: sql<number>`count(*)::int`,
      avgScore: sql<number>`coalesce(avg(score), 0)::float`,
      maxScore: sql<number>`coalesce(max(score), 0)::int`,
    })
    .from(gameScores)
    .groupBy(gameScores.gameId)
    .orderBy(desc(sql`count(*)`));

  const allGameDefs = await db.select().from(games);
  const gameDefMap = new Map(allGameDefs.map((g) => [g.slug, g]));

  const gameAnalytics = gameStats.map((s) => {
    const def = gameDefMap.get(s.gameId);
    return {
      gameId: s.gameId,
      gameName:
        def?.name ||
        s.gameId.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      attempts: s.attempts,
      avgScore: Number(s.avgScore.toFixed(1)),
      maxScore: s.maxScore,
      category: def?.category || "cognitive",
    };
  });

  // 4. Company Analytics
  const allCompanies = await db.select().from(companies);

  const companyAnalytics = [];
  for (const c of allCompanies) {
    const compGames = allGameDefs.filter((g) => g.companySlug === c.slug);
    const compGameSlugs = compGames.map((g) => g.slug);

    let compAttempts = 0;
    let compAvgScore = 0;

    if (compGameSlugs.length > 0) {
      const [cAgg] = await db
        .select({
          attempts: sql<number>`count(*)::int`,
          avgScore: sql<number>`coalesce(avg(score), 0)::float`,
        })
        .from(gameScores)
        .where(inArray(gameScores.gameId, compGameSlugs));

      compAttempts = cAgg?.attempts ?? 0;
      compAvgScore = Number((cAgg?.avgScore ?? 0).toFixed(1));
    }

    companyAnalytics.push({
      companySlug: c.slug,
      companyName: c.name,
      totalAttempts: compAttempts,
      avgScore: compAvgScore,
      gamesCount: compGames.length,
    });
  }

  // Sort companies by total attempts desc
  companyAnalytics.sort((a, b) => b.totalAttempts - a.totalAttempts);

  return {
    userStats: {
      dau,
      wau,
      mau,
      totalUsers,
      activationRate,
      retentionRate,
    },
    revenueStats: {
      grossRevenueINR,
      netRevenueINR,
      refundsINR,
      mrrINR,
      arrINR,
      conversionRate,
      churnRate,
    },
    gameAnalytics,
    companyAnalytics,
  };
}

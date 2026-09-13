"use server";

import { db } from "@/lib/db";
import { users, subscriptions, gameScores, payments, mockTestAttempts } from "@/lib/schema";
import { requireAdmin } from "./auth";
import { sql, eq, and, gte, desc } from "drizzle-orm";

export interface OverviewMetrics {
  totalUsers: number;
  newUsersMonth: number;
  newUsersGrowth: number;
  activeUsers30d: number;
  proSubscribers: number;
  grossRevenuePaise: number;
  refundedRevenuePaise: number;
  netRevenuePaise: number;
  mrrPaise: number;
  conversionRate: number;
  gamesPlayed: number;
  mockTestsCompleted: number;
}

export interface RevenuePoint {
  date: string;
  gross: number; // ₹
  net: number; // ₹
  refunds: number; // ₹
}

export interface UserGrowthPoint {
  date: string;
  newUsers: number;
}

export interface ActivityItem {
  id: string;
  type: "signup" | "payment" | "game" | "subscription" | "mock_test";
  title: string;
  subtitle: string;
  timestamp: Date;
  amount?: string;
}

export async function getOverviewData() {
  await requireAdmin("support");

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // 1. Total users
  const [totalUsersRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users);
  const totalUsers = totalUsersRes?.count ?? 0;

  // New users last 30 days
  const [newUsers30dRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(gte(users.createdAt, thirtyDaysAgo));
  const newUsersMonth = newUsers30dRes?.count ?? 0;

  // New users 31-60 days ago (for comparison)
  const [prevUsersRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(
      and(
        gte(users.createdAt, sixtyDaysAgo),
        sql`${users.createdAt} < ${thirtyDaysAgo}`
      )
    );
  const prevUsers = prevUsersRes?.count ?? 0;
  const newUsersGrowth =
    prevUsers > 0
      ? Number((((newUsersMonth - prevUsers) / prevUsers) * 100).toFixed(1))
      : 0;

  // 2. Active users (distinct users who played games in the last 30 days)
  const [activeUsersRes] = await db
    .select({ count: sql<number>`count(distinct "userId")::int` })
    .from(gameScores)
    .where(gte(gameScores.createdAt, thirtyDaysAgo));
  const activeUsers30d = activeUsersRes?.count ?? 0;

  // 3. Pro subscribers
  const [proUsersRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.isPro, true));
  const proSubscribers = proUsersRes?.count ?? 0;

  // Conversion rate
  const conversionRate =
    totalUsers > 0
      ? Number(((proSubscribers / totalUsers) * 100).toFixed(2))
      : 0;

  // 4. Revenue from payment table
  const [revenueRes] = await db
    .select({
      totalGross: sql<number>`coalesce(sum(case when status in ('succeeded', 'refunded') then amount else 0 end), 0)::int`,
      totalRefunded: sql<number>`coalesce(sum("refundedAmount"), 0)::int`,
    })
    .from(payments);

  const grossRevenuePaise = revenueRes?.totalGross ?? 0;
  const refundedRevenuePaise = revenueRes?.totalRefunded ?? 0;
  const netRevenuePaise = Math.max(0, grossRevenuePaise - refundedRevenuePaise);

  // 5. MRR calculation from active subscriptions
  // monthly: ₹49/mo, biannual: ₹199/6mo = ₹33.16/mo
  const [monthlySubs] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subscriptions)
    .where(
      and(eq(subscriptions.status, "active"), eq(subscriptions.planType, "monthly"))
    );
  const [biannualSubs] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subscriptions)
    .where(
      and(eq(subscriptions.status, "active"), eq(subscriptions.planType, "biannual"))
    );

  const activeMonthly = monthlySubs?.count ?? 0;
  const activeBiannual = biannualSubs?.count ?? 0;
  // MRR in paise: (monthly * 49 * 100) + (biannual * (199 / 6) * 100)
  const mrrPaise = Math.round(
    activeMonthly * 4900 + activeBiannual * ((199 * 100) / 6)
  );

  // 6. Games played
  const [gamesPlayedRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(gameScores);
  const gamesPlayed = gamesPlayedRes?.count ?? 0;

  // 7. Mock tests completed
  const [mockRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(mockTestAttempts);
  const mockTestsCompleted = mockRes?.count ?? 0;

  // 8. Recent Activity (Recent 15 combined items: signups, payments, game scores)
  const recentUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      isPro: users.isPro,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(5);

  const recentPayments = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      currency: payments.currency,
      status: payments.status,
      email: payments.email,
      planType: payments.planType,
      createdAt: payments.createdAt,
    })
    .from(payments)
    .orderBy(desc(payments.createdAt))
    .limit(5);

  const recentScores = await db
    .select({
      id: gameScores.id,
      userId: gameScores.userId,
      gameId: gameScores.gameId,
      score: gameScores.score,
      createdAt: gameScores.createdAt,
    })
    .from(gameScores)
    .orderBy(desc(gameScores.createdAt))
    .limit(5);

  const activity: ActivityItem[] = [];

  for (const u of recentUsers) {
    activity.push({
      id: `user-${u.id}`,
      type: "signup",
      title: `${u.name || u.email.split("@")[0]} signed up`,
      subtitle: u.email,
      timestamp: u.createdAt,
    });
  }

  for (const p of recentPayments) {
    activity.push({
      id: `pay-${p.id}`,
      type: "payment",
      title: `Payment ${p.status} (${p.planType === "biannual" ? "6-Month Pro" : "Monthly Pro"})`,
      subtitle: p.email || p.id,
      timestamp: p.createdAt,
      amount: `₹${(p.amount / 100).toFixed(0)}`,
    });
  }

  for (const s of recentScores) {
    activity.push({
      id: `score-${s.id}`,
      type: "game",
      title: `Score recorded in ${s.gameId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`,
      subtitle: `Score: ${s.score}`,
      timestamp: s.createdAt,
    });
  }

  // Sort descending by timestamp
  activity.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // 9. Revenue timeline (last 30 days grouped by day)
  const revenueTimeline = await db
    .select({
      date: sql<string>`to_char("createdAt", 'YYYY-MM-DD')`,
      gross: sql<number>`coalesce(sum(amount), 0)::int`,
      refunds: sql<number>`coalesce(sum("refundedAmount"), 0)::int`,
    })
    .from(payments)
    .where(gte(payments.createdAt, thirtyDaysAgo))
    .groupBy(sql`to_char("createdAt", 'YYYY-MM-DD')`)
    .orderBy(sql`to_char("createdAt", 'YYYY-MM-DD')`);

  const revenuePoints: RevenuePoint[] = revenueTimeline.map((r) => ({
    date: r.date,
    gross: Math.round(r.gross / 100),
    refunds: Math.round(r.refunds / 100),
    net: Math.round(Math.max(0, r.gross - r.refunds) / 100),
  }));

  // 10. User growth timeline (last 30 days grouped by day)
  const userTimeline = await db
    .select({
      date: sql<string>`to_char("createdAt", 'YYYY-MM-DD')`,
      count: sql<number>`count(*)::int`,
    })
    .from(users)
    .where(gte(users.createdAt, thirtyDaysAgo))
    .groupBy(sql`to_char("createdAt", 'YYYY-MM-DD')`)
    .orderBy(sql`to_char("createdAt", 'YYYY-MM-DD')`);

  const userGrowthPoints: UserGrowthPoint[] = userTimeline.map((u) => ({
    date: u.date,
    newUsers: u.count,
  }));

  const metrics: OverviewMetrics = {
    totalUsers,
    newUsersMonth,
    newUsersGrowth,
    activeUsers30d,
    proSubscribers,
    grossRevenuePaise,
    refundedRevenuePaise,
    netRevenuePaise,
    mrrPaise,
    conversionRate,
    gamesPlayed,
    mockTestsCompleted,
  };

  return {
    metrics,
    revenuePoints,
    userGrowthPoints,
    activity: activity.slice(0, 10),
  };
}

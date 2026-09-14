"use server";

import { db } from "@/lib/db";
import { subscriptions, users } from "@/lib/schema";
import { requireAdmin } from "./auth";
import { eq, desc, and, gte, sql } from "drizzle-orm";

export interface SubscriptionItem {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  planType: string;
  status: string;
  amount: number; // in INR
  billingInterval: string;
  razorpaySubscriptionId: string;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getSubscriptions({
  status = "all",
  page = 1,
  pageSize = 20,
}: {
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  await requireAdmin("support");

  const conditions = [];
  if (status !== "all") {
    conditions.push(eq(subscriptions.status, status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subscriptions)
    .where(whereClause);
  const total = totalRes?.count ?? 0;

  const offset = (page - 1) * pageSize;

  const rows = await db
    .select({
      id: subscriptions.id,
      userId: subscriptions.userId,
      userName: users.name,
      userEmail: users.email,
      planType: subscriptions.planType,
      status: subscriptions.status,
      razorpaySubscriptionId: subscriptions.razorpaySubscriptionId,
      expiresAt: subscriptions.expiresAt,
      createdAt: subscriptions.createdAt,
      updatedAt: subscriptions.updatedAt,
    })
    .from(subscriptions)
    .leftJoin(users, eq(subscriptions.userId, users.id))
    .where(whereClause)
    .orderBy(desc(subscriptions.createdAt))
    .limit(pageSize)
    .offset(offset);

  const items: SubscriptionItem[] = rows.map((r) => {
    const isMonthly = r.planType === "monthly";
    return {
      id: r.id,
      userId: r.userId,
      userName: r.userName,
      userEmail: r.userEmail,
      planType: r.planType,
      status: r.status,
      amount: isMonthly ? 49 : 199,
      billingInterval: isMonthly ? "1 Month" : "6 Months",
      razorpaySubscriptionId: r.razorpaySubscriptionId,
      expiresAt: r.expiresAt,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    subscriptions: items,
    total,
    page,
    totalPages,
  };
}

export async function getSubscriptionMetrics() {
  await requireAdmin("support");

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [activeRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subscriptions)
    .where(eq(subscriptions.status, "active"));

  const [newRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.status, "active"),
        gte(subscriptions.createdAt, thirtyDaysAgo)
      )
    );

  const [cancelledRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subscriptions)
    .where(eq(subscriptions.status, "cancelled"));

  const [activeMonthly] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subscriptions)
    .where(
      and(eq(subscriptions.status, "active"), eq(subscriptions.planType, "monthly"))
    );

  const [activeBiannual] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subscriptions)
    .where(
      and(eq(subscriptions.status, "active"), eq(subscriptions.planType, "biannual"))
    );

  const activeCount = activeRes?.count ?? 0;
  const newCount = newRes?.count ?? 0;
  const cancelledCount = cancelledRes?.count ?? 0;

  const mrrINR = Math.round(
    (activeMonthly?.count ?? 0) * 49 + ((activeBiannual?.count ?? 0) * 199) / 6
  );

  const churnRate =
    activeCount + cancelledCount > 0
      ? Number(((cancelledCount / (activeCount + cancelledCount)) * 100).toFixed(1))
      : 0;

  return {
    activeSubscriptions: activeCount,
    newSubscriptionsMonth: newCount,
    cancelledSubscriptions: cancelledCount,
    mrrINR,
    churnRate,
  };
}

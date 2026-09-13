"use server";

import { db } from "@/lib/db";
import { payments, users } from "@/lib/schema";
import { requireAdmin } from "./auth";
import { logAdminAction } from "./audit";
import { eq, desc, and, ilike, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const razorpayAuth =
  RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
    ? Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")
    : null;

export interface PaymentItem {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  amount: number; // paise
  currency: string;
  planType: string | null;
  provider: string;
  status: string;
  method: string | null;
  email: string | null;
  contact: string | null;
  refundedAmount: number | null;
  refundId: string | null;
  createdAt: Date;
}

export async function getPayments({
  search = "",
  status = "all",
  page = 1,
  pageSize = 20,
}: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  await requireAdmin("support");

  const conditions = [];

  if (search.trim()) {
    const q = `%${search.trim()}%`;
    conditions.push(
      or(
        ilike(payments.id, q),
        ilike(payments.email, q),
        ilike(payments.contact, q)
      )
    );
  }

  if (status !== "all") {
    conditions.push(eq(payments.status, status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(payments)
    .where(whereClause);
  const total = totalRes?.count ?? 0;

  const offset = (page - 1) * pageSize;

  const rows = await db
    .select({
      id: payments.id,
      userId: payments.userId,
      userName: users.name,
      userEmail: users.email,
      amount: payments.amount,
      currency: payments.currency,
      planType: payments.planType,
      provider: payments.provider,
      status: payments.status,
      method: payments.method,
      email: payments.email,
      contact: payments.contact,
      refundedAmount: payments.refundedAmount,
      refundId: payments.refundId,
      createdAt: payments.createdAt,
    })
    .from(payments)
    .leftJoin(users, eq(payments.userId, users.id))
    .where(whereClause)
    .orderBy(desc(payments.createdAt))
    .limit(pageSize)
    .offset(offset);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    payments: rows,
    total,
    page,
    totalPages,
  };
}

export async function getPaymentDetails(id: string) {
  await requireAdmin("support");

  const [payment] = await db
    .select({
      id: payments.id,
      userId: payments.userId,
      userName: users.name,
      userEmail: users.email,
      razorpayPaymentId: payments.razorpayPaymentId,
      subscriptionId: payments.subscriptionId,
      amount: payments.amount,
      currency: payments.currency,
      planType: payments.planType,
      provider: payments.provider,
      status: payments.status,
      method: payments.method,
      email: payments.email,
      contact: payments.contact,
      refundedAmount: payments.refundedAmount,
      refundId: payments.refundId,
      metadata: payments.metadata,
      createdAt: payments.createdAt,
      updatedAt: payments.updatedAt,
    })
    .from(payments)
    .leftJoin(users, eq(payments.userId, users.id))
    .where(eq(payments.id, id))
    .limit(1);

  return payment || null;
}

export async function refundPayment(paymentId: string, amountPaise?: number) {
  const admin = await requireAdmin("admin");

  if (!razorpayAuth) {
    throw new Error("Razorpay credentials not configured");
  }

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, paymentId))
    .limit(1);

  if (!payment) throw new Error("Payment record not found");
  if (payment.status === "refunded") throw new Error("Payment already refunded");

  const refundBody: Record<string, unknown> = {};
  if (amountPaise) refundBody.amount = amountPaise;

  const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${razorpayAuth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(refundBody),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.description || "Razorpay refund request failed");
  }

  const refundData = await res.json();

  // Update payment in database
  await db
    .update(payments)
    .set({
      status: "refunded",
      refundedAmount: refundData.amount ?? payment.amount,
      refundId: refundData.id,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, paymentId));

  // If user exists, revoke Pro status
  if (payment.userId) {
    await db
      .update(users)
      .set({ isPro: false, subscriptionStatus: "refunded", updatedAt: new Date() })
      .where(eq(users.id, payment.userId));
  }

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "payment.refunded",
    targetType: "payment",
    targetId: paymentId,
    metadata: {
      refundId: refundData.id,
      amount: refundData.amount,
      currency: refundData.currency,
      userEmail: payment.email,
    },
  });

  revalidatePath("/admin/payments");
  revalidatePath(`/admin/payments/${paymentId}`);
  revalidatePath("/admin");

  return { success: true, refundId: refundData.id };
}

export async function syncRazorpayPayments() {
  const admin = await requireAdmin("admin");

  if (!razorpayAuth) {
    throw new Error("Razorpay credentials not configured");
  }

  const res = await fetch("https://api.razorpay.com/v1/payments?count=100", {
    headers: { Authorization: `Basic ${razorpayAuth}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch payments from Razorpay API");
  }

  const data = await res.json();
  let count = 0;

  if (data.items && Array.isArray(data.items)) {
    for (const item of data.items) {
      let userId: string | null = null;
      if (item.email) {
        const [u] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, item.email))
          .limit(1);
        if (u) userId = u.id;
      }

      const statusMap: Record<string, string> = {
        captured: "succeeded",
        authorized: "pending",
        failed: "failed",
        refunded: "refunded",
      };
      const status = statusMap[item.status] || item.status;
      const planType =
        (item.description && item.description.includes("6 month")) ||
        item.amount >= 15000
          ? "biannual"
          : "monthly";

      await db
        .insert(payments)
        .values({
          id: item.id,
          userId,
          razorpayPaymentId: item.id,
          amount: item.amount,
          currency: item.currency,
          planType,
          provider: "razorpay",
          status,
          method: item.method,
          email: item.email,
          contact: item.contact,
          refundedAmount: item.amount_refunded || 0,
          metadata: {
            notes: item.notes,
            description: item.description,
            error_code: item.error_code,
          },
          createdAt: new Date(item.created_at * 1000),
          updatedAt: new Date(item.created_at * 1000),
        })
        .onConflictDoUpdate({
          target: payments.id,
          set: {
            status,
            refundedAmount: item.amount_refunded || 0,
            updatedAt: new Date(),
          },
        });
      count++;
    }
  }

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "payments.synced_with_razorpay",
    targetType: "system",
    targetId: `${count} payments synced`,
  });

  revalidatePath("/admin/payments");
  revalidatePath("/admin");

  return { success: true, count };
}

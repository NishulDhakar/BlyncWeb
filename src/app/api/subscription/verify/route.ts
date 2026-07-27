import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, users } from "@/lib/schema";
import { createHmac } from "crypto";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

const PLAN_DURATION_DAYS: Record<string, number> = {
  monthly: 32,
  biannual: 186,
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function verifySubscriptionPaymentSignature({
  paymentId,
  subscriptionId,
  signature,
}: {
  paymentId: string;
  subscriptionId: string;
  signature: string;
}): boolean {
  const expected = createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${paymentId}|${subscriptionId}`)
    .digest("hex");

  return expected === signature;
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const paymentId =
      typeof body.razorpay_payment_id === "string"
        ? body.razorpay_payment_id
        : "";
    const subscriptionId =
      typeof body.razorpay_subscription_id === "string"
        ? body.razorpay_subscription_id
        : "";
    const signature =
      typeof body.razorpay_signature === "string"
        ? body.razorpay_signature
        : "";

    if (!paymentId || !subscriptionId || !signature) {
      return NextResponse.json(
        { error: "Missing Razorpay verification fields" },
        { status: 400 }
      );
    }

    if (
      !verifySubscriptionPaymentSignature({
        paymentId,
        subscriptionId,
        signature,
      })
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const [subscription] = await db
      .select({
        userId: subscriptions.userId,
        planType: subscriptions.planType,
      })
      .from(subscriptions)
      .where(eq(subscriptions.razorpaySubscriptionId, subscriptionId))
      .limit(1);

    if (!subscription || subscription.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    const durationDays = PLAN_DURATION_DAYS[subscription.planType] ?? 32;
    const expiresAt = addDays(new Date(), durationDays);

    await Promise.all([
      db
        .update(subscriptions)
        .set({ status: "active", expiresAt, updatedAt: new Date() })
        .where(eq(subscriptions.razorpaySubscriptionId, subscriptionId)),
      db
        .update(users)
        .set({
          isPro: true,
          subscriptionStatus: "active",
          razorpaySubscriptionId: subscriptionId,
        })
        .where(eq(users.id, session.user.id)),
    ]);

    return NextResponse.json({ isPro: true });
  } catch (error) {
    console.error("Subscription verify error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

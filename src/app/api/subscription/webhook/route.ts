import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { createHmac } from "crypto";
import { NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

// Plan durations in days with a small buffer
const PLAN_DURATION_DAYS: Record<string, number> = {
  monthly: 32,
  biannual: 186,
};

function verifySignature(rawBody: string, signature: string): boolean {
  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return expected === signature;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ?? "";

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.event;

    const getSubId = (): string | null =>
      event.payload?.subscription?.entity?.id ?? null;

    const subId = getSubId();
    if (!subId) {
      const paymentSubId: string | null =
        event.payload?.payment?.entity?.subscription_id ?? null;
      if (!paymentSubId) return NextResponse.json({ received: true });
      return handleEvent(eventType, paymentSubId, event);
    }

    return handleEvent(eventType, subId, event);
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function handleEvent(
  eventType: string,
  subscriptionId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _event: any
): Promise<NextResponse> {
  switch (eventType) {
    case "subscription.activated":
    case "subscription.charged":
    case "payment.captured": {
      // Look up plan type from subscriptions table to calculate correct expiry
      const [sub] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.razorpaySubscriptionId, subscriptionId))
        .limit(1);

      const durationDays =
        PLAN_DURATION_DAYS[sub?.planType ?? "monthly"] ?? 32;
      const expiresAt = addDays(new Date(), durationDays);

      // Update subscriptions table
      await db
        .update(subscriptions)
        .set({ status: "active", expiresAt, updatedAt: new Date() })
        .where(eq(subscriptions.razorpaySubscriptionId, subscriptionId));

      // Update users table (quick-access isPro flag)
      await db
        .update(users)
        .set({ isPro: true, subscriptionStatus: "active" })
        .where(eq(users.razorpaySubscriptionId, subscriptionId));
      break;
    }

    case "subscription.cancelled":
    case "subscription.completed": {
      await db
        .update(subscriptions)
        .set({ status: "cancelled", expiresAt: new Date(), updatedAt: new Date() })
        .where(eq(subscriptions.razorpaySubscriptionId, subscriptionId));

      await db
        .update(users)
        .set({ isPro: false, subscriptionStatus: "cancelled" })
        .where(eq(users.razorpaySubscriptionId, subscriptionId));
      break;
    }

    case "subscription.halted": {
      await db
        .update(subscriptions)
        .set({ status: "halted", updatedAt: new Date() })
        .where(eq(subscriptions.razorpaySubscriptionId, subscriptionId));

      await db
        .update(users)
        .set({ isPro: false, subscriptionStatus: "halted" })
        .where(eq(users.razorpaySubscriptionId, subscriptionId));
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}

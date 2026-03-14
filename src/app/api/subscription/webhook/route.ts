import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { createHmac } from "crypto";
import { NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

// Razorpay signs the raw request body with HMAC-SHA256
function verifySignature(rawBody: string, signature: string): boolean {
  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return expected === signature;
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

    // Helper: resolve subscription ID from the event payload
    const getSubId = (): string | null =>
      event.payload?.subscription?.entity?.id ?? null;

    const subId = getSubId();
    if (!subId) {
      // payment.captured carries subscription under payment entity notes or subscription_id
      const paymentSubId: string | null =
        event.payload?.payment?.entity?.subscription_id ?? null;
      if (!paymentSubId) {
        // Nothing to act on
        return NextResponse.json({ received: true });
      }
      return handleEvent(eventType, paymentSubId, event);
    }

    return handleEvent(eventType, subId, event);
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
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
      await db
        .update(users)
        .set({ isPro: true, subscriptionStatus: "active" })
        .where(eq(users.razorpaySubscriptionId, subscriptionId));
      break;
    }

    case "subscription.cancelled": {
      await db
        .update(users)
        .set({ isPro: false, subscriptionStatus: "cancelled" })
        .where(eq(users.razorpaySubscriptionId, subscriptionId));
      break;
    }

    case "subscription.halted": {
      // Razorpay halts when payment fails repeatedly
      await db
        .update(users)
        .set({ isPro: false, subscriptionStatus: "halted" })
        .where(eq(users.razorpaySubscriptionId, subscriptionId));
      break;
    }

    case "subscription.completed": {
      // All billing cycles done — treat same as cancelled
      await db
        .update(users)
        .set({ isPro: false, subscriptionStatus: "cancelled" })
        .where(eq(users.razorpaySubscriptionId, subscriptionId));
      break;
    }

    default:
      // Unhandled event — still return 200 so Razorpay doesn't retry
      break;
  }

  return NextResponse.json({ received: true });
}

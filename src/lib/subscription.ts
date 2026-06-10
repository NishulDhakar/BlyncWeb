import { db } from "./db";
import { users, subscriptions } from "./schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const razorpayAuth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");

const ACTIVE_RAZORPAY_STATUSES = new Set(["authenticated", "active"]);

const PLAN_DURATION_DAYS: Record<string, number> = {
  monthly: 32,
  biannual: 186,
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Server-only. Returns true if the user has an active pro subscription.
 * Falls back to Razorpay API if the webhook hasn't fired yet (status = "created").
 */
export const getUserIsPro = cache(async (userId: string): Promise<boolean> => {
  try {
    const [user] = await db
      .select({
        isPro: users.isPro,
        subscriptionStatus: users.subscriptionStatus,
        razorpaySubscriptionId: users.razorpaySubscriptionId,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user?.isPro === true && user?.subscriptionStatus === "active") return true;

    // Webhook may not have fired — verify directly with Razorpay
    const rzpSubId = user?.razorpaySubscriptionId;
    if (!rzpSubId) return false;

    const rzpRes = await fetch(`https://api.razorpay.com/v1/subscriptions/${rzpSubId}`, {
      headers: { Authorization: `Basic ${razorpayAuth}` },
      next: { revalidate: 0 },
    });

    if (!rzpRes.ok) return false;
    const rzpSub = await rzpRes.json();

    if (!ACTIVE_RAZORPAY_STATUSES.has(rzpSub.status)) return false;

    // Sync DB so subsequent requests don't need the API call
    const [localSub] = await db
      .select({ planType: subscriptions.planType })
      .from(subscriptions)
      .where(eq(subscriptions.razorpaySubscriptionId, rzpSubId))
      .limit(1);

    const durationDays = PLAN_DURATION_DAYS[localSub?.planType ?? "monthly"] ?? 32;
    const expiresAt = addDays(new Date(), durationDays);

    await Promise.all([
      db
        .update(subscriptions)
        .set({ status: "active", expiresAt, updatedAt: new Date() })
        .where(eq(subscriptions.razorpaySubscriptionId, rzpSubId)),
      db
        .update(users)
        .set({ isPro: true, subscriptionStatus: "active" })
        .where(eq(users.id, userId)),
    ]);

    return true;
  } catch (error) {
    console.error("[getUserIsPro] Error checking subscription status:", error);
    return false;
  }
});

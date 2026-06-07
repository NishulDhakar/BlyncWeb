import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const razorpayAuth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");

// Razorpay statuses that mean the user has paid and is active
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

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ isPro: false, error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({
        isPro: users.isPro,
        subscriptionStatus: users.subscriptionStatus,
        razorpaySubscriptionId: users.razorpaySubscriptionId,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    // Already confirmed active in DB
    if (user?.isPro === true && user?.subscriptionStatus === "active") {
      return NextResponse.json({ isPro: true });
    }

    // Webhook hasn't fired yet — check Razorpay directly
    const rzpSubId = user?.razorpaySubscriptionId;
    if (rzpSubId) {
      try {
        const rzpRes = await fetch(`https://api.razorpay.com/v1/subscriptions/${rzpSubId}`, {
          headers: { Authorization: `Basic ${razorpayAuth}` },
        });

        if (rzpRes.ok) {
          const rzpSub = await rzpRes.json();

          if (ACTIVE_RAZORPAY_STATUSES.has(rzpSub.status)) {
            // Sync DB — webhook was slow/missed
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
                .where(eq(users.id, session.user.id)),
            ]);

            return NextResponse.json({ isPro: true });
          }
        }
      } catch {
        // Razorpay API unavailable — fall through to false
      }
    }

    return NextResponse.json({ isPro: false });
  } catch {
    return NextResponse.json({ isPro: false }, { status: 500 });
  }
}

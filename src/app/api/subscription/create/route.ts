import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const RAZORPAY_PLAN_ID = process.env.RAZORPAY_PLAN_ID!;

const razorpayAuth = Buffer.from(
  `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`
).toString("base64");

export async function POST() {
  try {
    let session;
    try {
      session = await auth.api.getSession({ headers: await headers() });
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId, email, name } = session.user;

    // Fetch user to check for existing Razorpay customer ID
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If already Pro with an active subscription, return early
    if (user.isPro && user.subscriptionStatus === "active") {
      return NextResponse.json(
        { error: "Already subscribed" },
        { status: 400 }
      );
    }

    // Create or reuse Razorpay customer
    let customerId = user.razorpayCustomerId;
    if (!customerId) {
      const customerRes = await fetch("https://api.razorpay.com/v1/customers", {
        method: "POST",
        headers: {
          Authorization: `Basic ${razorpayAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name ?? email, email, fail_existing: "0" }),
      });
      if (!customerRes.ok) {
        const err = await customerRes.json();
        console.error("Razorpay create customer error:", err);
        return NextResponse.json(
          { error: "Failed to create customer" },
          { status: 500 }
        );
      }
      const customer = await customerRes.json();
      customerId = customer.id;

      await db
        .update(users)
        .set({ razorpayCustomerId: customerId })
        .where(eq(users.id, userId));
    }

    // Create subscription
    const subRes = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${razorpayAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: RAZORPAY_PLAN_ID,
        customer_notify: 1,
        quantity: 1,
        total_count: 12, // 12 months; Razorpay auto-renews after this too
      }),
    });

    if (!subRes.ok) {
      const err = await subRes.json();
      console.error("Razorpay create subscription error:", err);
      return NextResponse.json(
        { error: "Failed to create subscription" },
        { status: 500 }
      );
    }

    const subscription = await subRes.json();

    // Persist subscription ID immediately so webhook can match it
    await db
      .update(users)
      .set({
        razorpaySubscriptionId: subscription.id,
        subscriptionStatus: "created",
      })
      .where(eq(users.id, userId));

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: RAZORPAY_KEY_ID,
      prefill: { name: name ?? "", email },
    });
  } catch (error) {
    console.error("Subscription create error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

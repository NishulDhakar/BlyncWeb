import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Server-only helper. Returns true if the user currently has an active pro subscription.
 * Uses the isPro flag on users table (kept accurate by the Razorpay webhook).
 */
export async function getUserIsPro(userId: string): Promise<boolean> {
  const [user] = await db
    .select({ isPro: users.isPro, subscriptionStatus: users.subscriptionStatus })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user?.isPro === true && user?.subscriptionStatus === "active";
}

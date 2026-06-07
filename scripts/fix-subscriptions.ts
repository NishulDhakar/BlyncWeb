import { db } from "../src/lib/db";
import { users, subscriptions } from "../src/lib/schema";
import { eq } from "drizzle-orm";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const razorpayAuth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");

const ACTIVE_RAZORPAY_STATUSES = new Set(["authenticated", "active"]);

async function main() {
  console.log("Fetching all pro users from the database...");
  const proUsers = await db.select().from(users).where(eq(users.isPro, true));
  console.log(`Found ${proUsers.length} users marked as 'isPro'.`);

  let fixedCount = 0;

  for (const user of proUsers) {
    if (!user.razorpaySubscriptionId) {
      console.log(`Skipping user ${user.email} because they have no razorpaySubscriptionId.`);
      continue;
    }
    
    try {
      const res = await fetch(`https://api.razorpay.com/v1/subscriptions/${user.razorpaySubscriptionId}`, {
        headers: { Authorization: `Basic ${razorpayAuth}` },
      });
      
      if (!res.ok) {
        console.error(`Failed to fetch razorpay sub for user ${user.email}. Are your Razorpay keys correct?`);
        continue;
      }
      
      const rzpSub = await res.json();
      
      if (!ACTIVE_RAZORPAY_STATUSES.has(rzpSub.status)) {
        console.log(`\nUser ${user.email} has a FALSE active status.`);
        console.log(`Actual Razorpay status is: ${rzpSub.status}. Fixing in database...`);
        
        // Update user table
        await db.update(users)
          .set({ isPro: false, subscriptionStatus: rzpSub.status })
          .where(eq(users.id, user.id));
          
        // Update subscriptions table
        await db.update(subscriptions)
          .set({ status: rzpSub.status, updatedAt: new Date() })
          .where(eq(subscriptions.razorpaySubscriptionId, user.razorpaySubscriptionId));
          
        fixedCount++;
        console.log(`✅ Fixed user ${user.email}.`);
      } else {
        console.log(`User ${user.email} is genuinely active.`);
      }
    } catch (e) {
      console.error(`Error processing user ${user.email}:`, e);
    }
  }
  
  console.log(`\nDone! Successfully fixed ${fixedCount} unpaid users.`);
  process.exit(0);
}

main();

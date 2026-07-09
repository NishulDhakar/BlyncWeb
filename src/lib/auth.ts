import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { users, sessions, accounts, verifications } from "./schema";
import { sendWelcomeEmail } from "./mailer";
import { cache } from "react";
import { headers } from "next/headers";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  user: {
    additionalFields: {
      isPro: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      subscriptionStatus: {
        type: "string",
        required: false,
        input: false,
      },
      razorpaySubscriptionId: {
        type: "string",
        required: false,
        input: false,
      },
      razorpayCustomerId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://10.0.2.2:3000",
    "http://10.0.2.2:3001",
    "http://localhost:8081",
    "games-apti://",
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  rateLimit: {
    window: 60,
    max: 10,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await sendWelcomeEmail(user.email, user.name ?? 'there');
          } catch (err) {
            console.error('[mailer] welcome email failed:', err);
          }
        },
      },
    },
  },
});

export const getCachedSession = cache(async () => {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof Error && ((error as any).digest === "DYNAMIC_SERVER_USAGE" || error.message?.includes("Dynamic server usage"))) {
      throw error;
    }
    console.error("[getCachedSession] Error fetching session:", error);
    return null;
  }
});

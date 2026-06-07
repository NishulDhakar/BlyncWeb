import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getProfileStats } from "@/features/profile/actions";
import ProfileClient from "./ProfileClient";
import { getUserIsPro } from "@/lib/subscription";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export const metadata: Metadata = {
  title: "My Profile",
  robots: { index: false },
};

export default async function ProfilePage() {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    if (error instanceof Error && ((error as any).digest === "DYNAMIC_SERVER_USAGE" || error.message?.includes("Dynamic server usage"))) {
      throw error;
    }
    console.error("[ProfilePage] Session fetch failed:", error);
  }

  if (!session) redirect("/register");

  let isPro = false;
  let activeSub = null;
  let stats: any = {
    gamesPlayed: 0,
    averageScore: 0,
    highestScores: {},
    recentActivity: [],
  };

  try {
    isPro = await getUserIsPro(session.user.id);

    if (isPro) {
      const [sub] = await db
        .select({ planType: subscriptions.planType, expiresAt: subscriptions.expiresAt })
        .from(subscriptions)
        .where(and(eq(subscriptions.userId, session.user.id), eq(subscriptions.status, "active")))
        .limit(1);
      activeSub = sub ?? null;
    }

    stats = await getProfileStats(session.user.id);
  } catch (error) {
    console.error("[ProfilePage] Error loading profile details:", error);
  }

  return (
    <ProfileClient
      user={{ ...session.user, isPro }}
      stats={stats}
      subscription={activeSub}
    />
  );
}

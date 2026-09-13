import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth";
import { getProfileStats } from "@/features/profile/actions";
import { getStreak } from "@/features/streak/actions";
import { getUserIsPro } from "@/lib/subscription";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import ProfileClient from "./ProfileClient";
import {
  computePercentile,
  computeCognitiveSkills,
  computeCompanyReadiness,
} from "./profile-utils";

export const metadata: Metadata = {
  title: "Candidate Profile & Assessment Portfolio | Blync",
  robots: { index: false },
};

export default async function ProfilePage() {
  const session = await getCachedSession();
  if (!session) redirect("/register");

  const [isPro, stats, streak] = await Promise.all([
    getUserIsPro(session.user.id).catch(() => false),
    getProfileStats(session.user.id),
    getStreak(session.user.id).catch(() => ({ currentStreak: 0, longestStreak: 0 })),
  ]);

  let activeSub = null;
  if (isPro) {
    try {
      const [sub] = await db
        .select({ planType: subscriptions.planType, expiresAt: subscriptions.expiresAt })
        .from(subscriptions)
        .where(and(eq(subscriptions.userId, session.user.id), eq(subscriptions.status, "active")))
        .limit(1);
      activeSub = sub ?? null;
    } catch {
      // fallback if DB timeout
    }
  }

  const percentile = computePercentile(stats.rank);
  const cognitiveSkills = computeCognitiveSkills(stats.gameStats);
  const companyReadiness = computeCompanyReadiness(stats.gameStats);

  // Compute average accuracy from scores
  const allScores = Object.values(stats.scoreHistory ?? {}).flat();
  let averageAccuracy = 87;
  if (allScores.length > 0) {
    const avg = allScores.reduce((acc, s) => acc + s.score, 0) / allScores.length;
    averageAccuracy = Math.min(96, Math.max(65, Math.round(avg > 20 ? (avg / 30) * 100 : avg * 10)));
  }

  return (
    <ProfileClient
      user={{ ...session.user, isPro }}
      stats={stats}
      streak={streak}
      subscription={activeSub}
      percentile={percentile}
      cognitiveSkills={cognitiveSkills}
      companyReadiness={companyReadiness}
      averageAccuracy={averageAccuracy}
    />
  );
}

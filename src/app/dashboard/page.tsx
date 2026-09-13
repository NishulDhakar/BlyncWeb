import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth";
import { getProfileStats } from "@/features/profile/actions";
import { getStreak } from "@/features/streak/actions";
import {
  computePerformanceOverview,
  buildContinuePractice,
  computePlacementReadiness,
  buildCompanyPreparation,
  buildRecentActivity,
  buildPersonalRecommendation,
  buildUserGoal,
} from "./dashboard-utils";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getCachedSession();
  if (!session) redirect("/register");

  const [stats, streak] = await Promise.all([
    getProfileStats(session.user.id),
    getStreak(session.user.id).catch(() => ({ currentStreak: 0, longestStreak: 0 })),
  ]);

  const overview = computePerformanceOverview(
    stats.totalGamesPlayed,
    stats.gameStats,
    stats.scoreHistory
  );
  const continuePractice = buildContinuePractice(stats.gameStats, stats.scoreHistory);
  const readiness = computePlacementReadiness(
    stats.totalGamesPlayed,
    overview.averageAccuracy.value
  );
  const companies = buildCompanyPreparation(stats.gameStats);
  const recentActivity = buildRecentActivity(stats.scoreHistory);
  const recommendation = buildPersonalRecommendation(continuePractice);
  const goal = buildUserGoal(readiness.score);

  return (
    <DashboardClient
      firstName={session.user.name?.split(" ")[0] ?? "there"}
      streak={streak}
      overview={overview}
      continuePractice={continuePractice}
      readiness={readiness}
      companies={companies}
      recentActivity={recentActivity}
      recommendation={recommendation}
      goal={goal}
    />
  );
}

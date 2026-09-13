import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth";
import {
  getLeaderboard,
  getUserStanding,
  getLeaderboardStats,
} from "@/features/leaderboard/actions";
import DashboardLeaderboardClient from "./DashboardLeaderboardClient";

export const metadata: Metadata = {
  title: "Candidate Leaderboard | Blync Dashboard",
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardLeaderboardPage(props: PageProps) {
  const session = await getCachedSession();
  if (!session) redirect("/register");

  const searchParams = await props.searchParams;
  const game = typeof searchParams.game === "string" ? searchParams.game : "overall";

  const [entries, userStanding, stats] = await Promise.all([
    getLeaderboard(game, 50),
    getUserStanding(session.user.id, game),
    getLeaderboardStats(),
  ]);

  return (
    <DashboardLeaderboardClient
      entries={entries}
      userStanding={userStanding}
      stats={stats}
      selectedGame={game}
      currentUserId={session.user.id}
    />
  );
}

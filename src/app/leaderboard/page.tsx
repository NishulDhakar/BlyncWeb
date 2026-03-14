import { getLeaderboard } from "@/features/leaderboard/actions";
import LeaderboardClient from "./client";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Leaderboard — Top Capgemini Aptitude Scores | Blync",
  description:
    "See who's leading the Blync cognitive games leaderboard. Top scores across Switch, Digit, Motion, and Deductive Challenges for Capgemini placement prep.",
  alternates: {
    canonical: `${siteConfig.url}/leaderboard`,
  },
  openGraph: {
    title: "Leaderboard | Blync Cognitive Games",
    description:
      "Top performers in Capgemini & Cognizant game-based aptitude practice on Blync.",
    url: `${siteConfig.url}/leaderboard`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Blync Leaderboard" }],
  },
};

export default async function LeaderboardPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const game = typeof searchParams.game === 'string' ? searchParams.game : 'overall';

  // Get current user — fail gracefully so a session/DB error doesn't crash the page
  let currentUserId: string | undefined;
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    currentUserId = session?.user?.id;
  } catch (e) {
    console.error('Failed to fetch session on leaderboard page:', e);
  }

  // Fetch leaderboard data
  try {
    const data = await getLeaderboard(game === 'overall' ? undefined : game);
    return <LeaderboardClient data={data} gameId={game} currentUserId={currentUserId} />;
  } catch (error) {
    console.error('Failed to fetch leaderboard data:', error);
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
        <p className="text-red-500">Failed to load leaderboard data. Please try again later.</p>
      </div>
    );
  }
}

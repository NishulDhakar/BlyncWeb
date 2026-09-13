import type { Metadata } from "next";
import { liveGames, playHref } from "@/games/registry";
import GamesDirectoryClient from "./GamesDirectoryClient";

export const metadata: Metadata = {
  title: "Assessment Games | Blync Dashboard",
  robots: { index: false },
};

export default function DashboardGamesPage() {
  const allLive = liveGames();

  const games = allLive.map((g) => ({
    ...g,
    href: playHref(g),
  }));

  return <GamesDirectoryClient games={games} />;
}

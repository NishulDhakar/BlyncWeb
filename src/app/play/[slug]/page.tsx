import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GameShell from "@/games/shell/GameShell";
import GameMount from "@/games/GameMount";
import { hasReactModule } from "@/games/moduleRegistry";
import { gamePlayMetadata } from "@/games/seo";
import { getGame, liveGames } from "@/games/registry";

/**
 * Gameplay route for every React game module.
 *
 * One dynamic segment instead of a page file per game: the registry supplies
 * the metadata and the loader supplies a per-game lazy chunk, so adding a game
 * needs no new route. The existing hand-written /play/<slug> pages (switch,
 * digit, grid, motion, inductive, deductive) keep their own files — Next
 * matches those static segments ahead of this dynamic one, so they are
 * untouched.
 */

type Props = { params: Promise<{ slug: string }> };

/** Warms the router cache for these slugs; unknown slugs still 404. */
export function generateStaticParams() {
  return liveGames()
    .filter((game) => game.kind === "react" && !game.href)
    .map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return gamePlayMetadata(slug);
}

export default async function PlayGamePage({ params }: Props) {
  const { slug } = await params;

  const game = getGame(slug);
  if (!game || !hasReactModule(slug) || game.comingSoon) notFound();

  return (
    <GameShell slug={slug} wide={game.slug === "motion-challenge-advanced"}>
      <GameMount slug={slug} />
    </GameShell>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HtmlGame from "@/games/shell/renderHtmlGame";
import { gamePlayMetadata } from "@/games/seo";
import { getGame, gamesInCategory } from "@/games/registry";

/**
 * The Cognizant communication rounds. Single-file HTML documents, several of
 * which record audio — hence the microphone permission on the frame. Nothing
 * leaves the browser; the scoring runs inside the document.
 */

type Props = { params: Promise<{ slug: string }> };

/** Rounds that need microphone or audio playback access. */
const NEEDS_MEDIA = new Set([
  "read-aloud",
  "listen-and-repeat",
  "comprehension-round",
  "open-response",
]);

export function generateStaticParams() {
  return gamesInCategory("communication").map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return gamePlayMetadata(slug);
}

export default async function CommunicationRoundPage({ params }: Props) {
  const { slug } = await params;

  const game = getGame(slug);
  if (!game || game.kind !== "html" || !game.htmlFolder) notFound();

  return (
    <HtmlGame
      folder={game.htmlFolder}
      title={game.name}
      allow={NEEDS_MEDIA.has(slug) ? "microphone; autoplay" : undefined}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HtmlGame from "@/games/shell/renderHtmlGame";
import { gamePlayMetadata } from "@/games/seo";
import { getGame, gamesInCategory } from "@/games/registry";

/**
 * Timed HTML assessments: the debugging rounds and the Accenture technical
 * quiz. Each ships as a self-contained document, so it renders inside a
 * sandboxed iframe rather than being rewritten as React.
 */

type Props = { params: Promise<{ slug: string }> };

/** The sibling script each assessment folder loads. */
const SCRIPT_FILE: Record<string, string> = {
  "accenture-technical-quiz": "app.js",
  "debugging-assessment-1": "script.js",
  "debugging-assessment-2": "script.js",
};

export function generateStaticParams() {
  return gamesInCategory("quiz").map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return gamePlayMetadata(slug);
}

export default async function AssessmentPage({ params }: Props) {
  const { slug } = await params;

  const game = getGame(slug);
  if (!game || game.kind !== "html" || !game.htmlFolder) notFound();

  return (
    <HtmlGame
      folder={game.htmlFolder}
      scriptFile={SCRIPT_FILE[slug]}
      title={game.name}
    />
  );
}

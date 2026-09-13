import Link from "next/link";
import { Clock, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { gamesInCategory, playHref, seoHref } from "@/games/registry";
import type { GameCategory, GameDefinition } from "@/games/types";

/**
 * Registry-driven game grid.
 *
 * Replaces GamesCard / MemoryGamesCard / BrainGamesCard, which each held a
 * hand-maintained copy of the game list. A game added to the registry now shows
 * up on its category hub with no further edit — that was the failure mode
 * before: eight games existed in config but only six had cards.
 *
 * Server component: no client JS, and the links are real anchors, so the whole
 * grid is crawlable.
 */

const DIFFICULTY_STYLE: Record<GameDefinition["difficulty"], string> = {
  easy: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10",
  medium: "text-amber-400 border-amber-500/25 bg-amber-500/10",
  hard: "text-rose-400 border-rose-500/25 bg-rose-500/10",
};

const COMPANY_LABEL: Record<GameDefinition["company"], string | null> = {
  capgemini: "Capgemini",
  cognizant: "Cognizant",
  accenture: "Accenture",
  general: null,
};

function GameCard({ game }: { game: GameDefinition }) {
  const company = COMPANY_LABEL[game.company];

  return (
    <li>
      <article className="group flex h-full flex-col rounded-2xl border border-border/50 bg-muted/10 p-5 transition-colors hover:border-border">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {company && (
            <span className="rounded-full border border-border/40 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
              {company}
            </span>
          )}
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize",
              DIFFICULTY_STYLE[game.difficulty]
            )}
          >
            {game.difficulty}
          </span>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-500 dark:text-amber-400">
            Pro
          </span>
        </div>

        {/* h3 — the category page owns the h1, section headings are h2. */}
        <h3 className="text-lg font-bold leading-snug">
          <Link
            href={seoHref(game)}
            className="after:absolute after:inset-0 hover:underline"
          >
            {game.name}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {game.tagline}
        </p>

        <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            <dt className="sr-only">Duration</dt>
            <dd>{game.duration}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="size-3.5" aria-hidden="true" />
            <dt className="sr-only">Trains</dt>
            <dd>{game.skills.slice(0, 2).join(", ")}</dd>
          </div>
        </dl>

        <div className="relative z-10 mt-5 flex gap-2">
          <Link
            href={seoHref(game)}
            className="inline-flex items-center rounded-lg border border-border/50 px-3 py-1.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-border hover:text-foreground"
          >
            Read guide
          </Link>
          <Link
            href={playHref(game)}
            className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Play Challenge
          </Link>
        </div>
      </article>
    </li>
  );
}

export default function GameGrid({
  category,
  games,
  heading,
}: {
  category?: GameCategory;
  games?: readonly GameDefinition[];
  heading?: string;
}) {
  const items = games ?? (category ? gamesInCategory(category) : []);
  if (items.length === 0) return null;

  return (
    <section className="mb-16">
      {heading && <h2 className="mb-6 text-2xl font-semibold">{heading}</h2>}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </ul>
    </section>
  );
}

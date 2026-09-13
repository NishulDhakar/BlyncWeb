import Link from "next/link";
import { Trophy } from "lucide-react";
import Music from "@/components/common/music";
import { cn } from "@/lib/utils";
import { getGame, relatedGames } from "@/games/registry";

/**
 * The chrome every game renders inside: HUD, centred play area, and the
 * internal-link footer.
 *
 * This is a server component — the HUD values arrive as already-formatted
 * strings from the game's client module, so none of this markup ships JS.
 * `Music` is the only interactive child.
 */
export interface GameShellProps {
  /** Registry slug. Drives the title and the related-games footer links. */
  slug: string;
  /** Overrides the registry name in the HUD (e.g. "Round 2"). */
  title?: string;
  level?: number | string;
  /** Pre-formatted, e.g. "02:14". */
  timer?: string | number;
  score?: number;
  /** Extra HUD content — lives, streak, a mode toggle. */
  hud?: React.ReactNode;
  children: React.ReactNode;
  /** Widen the play area for board games that need the room. */
  wide?: boolean;
}

function HudTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex min-w-14 flex-col items-center rounded-xl border border-border/40 bg-muted/50 px-3 py-1.5">
      <span className="mb-0.5 text-[9px] font-bold uppercase leading-none tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="text-base font-black leading-none tabular-nums">{value}</span>
    </div>
  );
}

export default function GameShell({
  slug,
  title,
  level,
  timer,
  score,
  hud,
  children,
  wide = false,
}: GameShellProps) {
  const game = getGame(slug);
  const heading = title ?? game?.name ?? "Challenge";
  const related = relatedGames(slug).slice(0, 4);
  const hasHud = level !== undefined || timer !== undefined || score !== undefined || hud !== undefined;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-x-hidden pt-16 sm:pt-20">
      {/* ── HUD (only when game provides HUD items) ── */}
      {hasHud && (
        <header className="z-10 w-full px-4 sm:px-6 mb-4">
          <div className={cn("mx-auto", wide ? "max-w-5xl" : "max-w-2xl")}>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/50 bg-card px-4 py-2.5 shadow-sm">
              <div className="flex shrink-0 items-center gap-2.5">
                <Music />
                {level !== undefined && <HudTile label="Level" value={level} />}
                {score !== undefined && <HudTile label="Score" value={score} />}
              </div>

              {/* The H1 lives on the SEO landing page, not here — this is a
                  noindex play route, so a <p> keeps the outline clean. */}
              <div className="hidden flex-1 justify-center sm:flex">
                <p className="rounded-xl border border-primary/15 bg-primary/8 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary/80">
                  {heading}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2.5">
                {hud && <div className="hidden sm:block">{hud}</div>}
                {timer !== undefined && <HudTile label="Time" value={<span className="font-mono">{timer}</span>} />}
                <Link
                  href="/leaderboard"
                  className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 transition-all duration-200 hover:border-amber-400/35 hover:bg-amber-500/15"
                >
                  <Trophy className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                  <span className="hidden text-xs font-bold text-amber-300 xs:block">Rank</span>
                </Link>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between px-1 sm:hidden">
              <p className="text-xs font-semibold tracking-wide text-primary/70">{heading}</p>
              {hud}
            </div>
          </div>
        </header>
      )}

      {/* ── Play area ── */}
      <main
        className={cn(
          "relative z-10 mb-16 flex w-full flex-col items-center px-4 md:px-0",
          wide ? "max-w-5xl" : "max-w-2xl"
        )}
      >
        {children}
      </main>

      {/* ── Internal links — registry-driven, so new games are never orphans ── */}
      <footer className="relative z-10 mb-12 w-full max-w-2xl px-4 md:px-0">
        <nav aria-label="More challenges" className="border-t border-border/30 pt-8">
          <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            More Challenges
          </p>
          <ul className="flex flex-wrap justify-center gap-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/games/${item.category}/${item.slug}`}
                  className="rounded-full border border-border/30 px-3 py-1.5 text-xs font-medium text-muted-foreground/50 transition-all duration-200 hover:border-border/60 hover:bg-muted/30 hover:text-foreground/80"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </footer>
    </div>
  );
}

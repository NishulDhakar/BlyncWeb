import Link from "next/link";
import {
  Gamepad2,
  ArrowRight,
  ArrowRightLeft,
  LayoutGrid,
  Calculator,
  Move,
  Puzzle,
  Brain,
  Binary,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GameStat } from "@/features/profile/actions";
import { getGame, playHref } from "@/games/registry";

const GAME_ICONS: Record<string, LucideIcon> = {
  "switch-challenge": ArrowRightLeft,
  "grid-challenge": LayoutGrid,
  "digit-challenge": Calculator,
  "motion-challenge": Move,
  "deductive-challenge": Puzzle,
  "inductive-challenge": Brain,
  "bubble-math": Binary,
};

const DEFAULT_FEATURED_GAMES: GameStat[] = [
  { gameId: "switch-challenge", gameName: "Switch Challenge", bestScore: 0, gamesPlayed: 0 },
  { gameId: "grid-challenge", gameName: "Grid Challenge", bestScore: 0, gamesPlayed: 0 },
  { gameId: "digit-challenge", gameName: "Digit Challenge", bestScore: 0, gamesPlayed: 0 },
  { gameId: "motion-challenge", gameName: "Motion Challenge", bestScore: 0, gamesPlayed: 0 },
  { gameId: "deductive-challenge", gameName: "Deductive Challenge", bestScore: 0, gamesPlayed: 0 },
];

export interface GamePerformanceTableProps {
  gameStats: GameStat[];
  className?: string;
}

export function GamePerformanceTable({
  gameStats,
  className,
}: GamePerformanceTableProps) {
  const displayStats = gameStats.length > 0 ? gameStats : DEFAULT_FEATURED_GAMES;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card p-4 sm:p-5 shadow-2xs",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-4 w-4 text-primary shrink-0" />
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Assessment Game Breakdown
          </h2>
        </div>
        <Link
          href="/dashboard/games"
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          All 26 challenges →
        </Link>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Individual round performance, sessions completed, and personal best scores.
      </p>

      <div className="mt-4 divide-y divide-border/40">
        {displayStats.map((game) => {
          const Icon = GAME_ICONS[game.gameId] ?? Gamepad2;
          const gameDef = getGame(game.gameId);
          const companyTag = gameDef?.company
            ? gameDef.company.charAt(0).toUpperCase() + gameDef.company.slice(1)
            : "Multi-Company";

          return (
            <div
              key={game.gameId}
              className="flex items-center justify-between py-2.5 first:pt-1 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/30 text-foreground">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-semibold text-foreground">
                      {game.gameName}
                    </span>
                    <span className="hidden sm:inline-flex rounded border border-border/40 bg-muted/30 px-1.5 py-0.2 text-[9px] font-medium text-muted-foreground">
                      {companyTag}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {game.gamesPlayed > 0
                      ? `${game.gamesPlayed} ${game.gamesPlayed === 1 ? "round" : "rounds"} completed`
                      : "Not played yet"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="block text-[11px] text-muted-foreground">Personal Best</span>
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    {game.bestScore > 0
                      ? game.bestScore > 20
                        ? `${game.bestScore} pts`
                        : `${game.bestScore * 10}%`
                      : "—"}
                  </span>
                </div>

                <Link
                  href={(() => {
                    const reg = getGame(game.gameId);
                    return reg ? playHref(reg) : `/play/${game.gameId}`;
                  })()}
                  className="inline-flex h-7 items-center justify-center gap-1 rounded-md border border-border/60 bg-muted/30 px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  <span>{game.gamesPlayed > 0 ? "Drill" : "Start"}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


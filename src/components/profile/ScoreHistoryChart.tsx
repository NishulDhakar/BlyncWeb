import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScoreEntry } from "@/features/profile/actions";
import { formatGameHistoryChart } from "@/app/(root)/profile/profile-utils";

export interface ScoreHistoryChartProps {
  scoreHistory: Record<string, ScoreEntry[]>;
  availableGames: { slug: string; name: string }[];
  className?: string;
}

export function ScoreHistoryChart({
  scoreHistory,
  availableGames,
  className,
}: ScoreHistoryChartProps) {
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const sessions = formatGameHistoryChart(scoreHistory, selectedGame);

  const hasSessions = sessions.length > 0;
  const scores = sessions.map((s) => s.score);
  const highest = hasSessions ? Math.max(...scores) : null;
  const average =
    hasSessions
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;
  const latest = hasSessions ? scores[scores.length - 1] : null;
  const first = hasSessions ? scores[0] : null;
  const diff = latest !== null && first !== null ? latest - first : 0;
  const improvement =
    scores.length >= 2
      ? diff > 0
        ? `+${diff}%`
        : diff === 0
        ? "0%"
        : `${diff}%`
      : "—";

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card p-4 sm:p-5 shadow-2xs",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary shrink-0" />
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Performance Trajectory
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Assessment score progression across recent sessions.
          </p>
        </div>

        {/* Game Filter tabs */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border/40 bg-muted/30 p-0.5 self-start sm:self-auto">
          <button
            onClick={() => setSelectedGame("all")}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
              selectedGame === "all"
                ? "bg-card text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {availableGames.slice(0, 4).map((game) => (
            <button
              key={game.slug}
              onClick={() => setSelectedGame(game.slug)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                selectedGame === game.slug
                  ? "bg-card text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {game.name.replace(" Challenge", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Stats summary banner */}
      <div className="mt-4 grid grid-cols-4 gap-2 border-y border-border/40 py-2.5 text-center text-xs">
        <div>
          <span className="block text-[11px] text-muted-foreground">Highest</span>
          <span className="font-bold tabular-nums text-foreground">
            {highest !== null ? `${highest}%` : "—"}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-muted-foreground">Average</span>
          <span className="font-bold tabular-nums text-foreground">
            {average !== null ? `${average}%` : "—"}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-muted-foreground">Latest</span>
          <span className="font-bold tabular-nums text-foreground">
            {latest !== null ? `${latest}%` : "—"}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-muted-foreground">Trajectory</span>
          <span
            className={cn(
              "font-bold tabular-nums",
              scores.length >= 2
                ? diff >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
                : "text-muted-foreground"
            )}
          >
            {improvement}
          </span>
        </div>
      </div>

      {/* Interactive Bar Progression Chart or Empty State */}
      {!hasSessions ? (
        <div className="mt-5 flex h-36 flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20 p-6 text-center">
          <p className="text-xs font-medium text-foreground">No assessment sessions recorded yet</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Complete rounds in any challenge to begin tracking your performance trajectory over time.
          </p>
        </div>
      ) : (
        <div className="mt-5">
          <div className="relative flex h-32 items-end gap-1.5 border-b border-border/50 pb-2 pt-4 sm:gap-2">
            {sessions.map((session, idx) => {
              const heightPercent = Math.max(12, session.score);
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={session.sessionNumber}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-10 z-20 flex flex-col items-center rounded-md border border-border/70 bg-popover px-2 py-1 shadow-md animate-in fade-in-0 duration-100">
                      <span className="text-[10px] font-bold text-popover-foreground">
                        {session.score}%
                      </span>
                      <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                        {session.dateStr}
                      </span>
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    className={cn(
                      "w-full rounded-t-sm transition-all duration-150",
                      isHovered
                        ? "bg-primary"
                        : "bg-muted-foreground/25 group-hover:bg-primary/70"
                    )}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
            <span>Session {sessions[0]?.sessionNumber ?? 1}</span>
            <span>Session {sessions[Math.floor(sessions.length / 2)]?.sessionNumber ?? 4}</span>
            <span>Session {sessions[sessions.length - 1]?.sessionNumber ?? 7}</span>
          </div>
        </div>
      )}
    </div>
  );
}


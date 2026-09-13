"use client";

import { Heart, RotateCcw, Target, Timer, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { CoolMode } from "@/components/ui/cool-mode";
import { cn } from "@/lib/utils";
import { toPercent } from "@/games/lib/format";

/**
 * The results screen and HUD atoms shared by every game.
 *
 * Each ported game arrived with its own copy of these. There is no shared
 * start screen: every game auto-starts on mount (see each game's
 * initialState()) rather than gating play behind a "Start Game" button, so
 * there is nothing here for that phase to render.
 */

// ── HUD atoms ───────────────────────────────────────────────────────────────

export function LivesRow({ lives, max = 3 }: { lives: number; max?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${lives} of ${max} lives remaining`}>
      {Array.from({ length: max }, (_, i) => (
        <Heart
          key={i}
          aria-hidden="true"
          className={cn(
            "size-4 transition-colors",
            i < lives ? "fill-destructive text-destructive" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

export function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-border/50 bg-card px-4 py-3">
      {Icon && <Icon className="size-4 text-muted-foreground" />}
      <span className="text-xl font-black leading-none tabular-nums">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/** Time remaining as a bar. Turns amber then red as the budget runs out. */
export function TimerBar({ timeLeft, timeLimit }: { timeLeft: number; timeLimit: number }) {
  const pct = toPercent(timeLeft, timeLimit);
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-label="Time remaining"
      aria-valuenow={timeLeft}
      aria-valuemin={0}
      aria-valuemax={timeLimit}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-1000 ease-linear",
          pct > 50 ? "bg-primary" : pct > 20 ? "bg-amber-500" : "bg-destructive"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Results screen ──────────────────────────────────────────────────────────

export interface GameResultScreenProps {
  score: number;
  correct?: number;
  wrong?: number;
  levelsCleared?: number;
  bestStreak?: number;
  onRestart: () => void;
  /** True once the score has been written to the leaderboard. */
  saved?: boolean;
  children?: React.ReactNode;
}

export function GameResultScreen({
  score,
  correct,
  wrong,
  levelsCleared,
  bestStreak,
  onRestart,
  saved,
  children,
}: GameResultScreenProps) {
  const attempted = (correct ?? 0) + (wrong ?? 0);

  return (
    <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 text-center text-card-foreground sm:p-8">
      <Trophy className="mx-auto size-10 text-amber-400" aria-hidden="true" />
      <h2 className="mt-4 font-game text-xl leading-tight sm:text-2xl">Session Complete</h2>

      <p className="mt-6 text-5xl font-black tabular-nums">{score}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Final Score
      </p>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {correct !== undefined && <StatTile label="Correct" value={correct} icon={Target} />}
        {wrong !== undefined && <StatTile label="Missed" value={wrong} icon={Zap} />}
        {levelsCleared !== undefined && (
          <StatTile label="Level" value={levelsCleared} icon={Timer} />
        )}
        {bestStreak !== undefined && <StatTile label="Streak" value={bestStreak} icon={Zap} />}
      </div>

      {attempted > 0 && correct !== undefined && (
        <p className="mt-5 text-sm text-muted-foreground">
          Accuracy <span className="font-bold text-foreground">{toPercent(correct, attempted)}%</span>{" "}
          across {attempted} question{attempted === 1 ? "" : "s"}.
        </p>
      )}

      {children}

      <CoolMode className="w-full">
        <ShimmerButton className="mt-7 w-full h-11 text-sm font-semibold shadow-md" onClick={onRestart}>
          <RotateCcw className="size-4 mr-2" aria-hidden="true" />
          Play Again
        </ShimmerButton>
      </CoolMode>

      <p className="mt-3 h-4 text-xs text-muted-foreground">
        {saved ? "Score saved to the leaderboard." : ""}
      </p>
    </section>
  );
}

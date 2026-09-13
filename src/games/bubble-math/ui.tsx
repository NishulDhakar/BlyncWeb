"use client";

import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  CheckCircle2,
  Heart,
  RotateCcw,
  Timer,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BubbleOrder, BubblePhase, MathBubble } from "./logic";

type Props = {
  phase: BubblePhase;
  level: number;
  lives: number;
  score: number;
  streak: number;
  bestStreak: number;
  highestLevel: number;
  order: BubbleOrder;
  bubbles: MathBubble[];
  selectedIds: number[];
  expectedIds: number[];
  timeLeft: number;
  timeLimit: number;
  failedReason: string;
  onBubbleClick: (bubbleId: number) => void;
  onReset: () => void;
};

const bubbleColorClass: Record<MathBubble["color"], string> = {
  gold: "border-arcade-ink bg-arcade text-black shadow-[inset_-8px_-10px_0_rgba(138,98,0,0.24),0_0_22px_rgba(255,197,22,0.35)]",
  green: "border-success-ink bg-success text-black shadow-[inset_-8px_-10px_0_rgba(20,83,45,0.24),0_0_22px_rgba(34,197,94,0.28)]",
  rose: "border-danger-ink bg-danger text-black shadow-[inset_-8px_-10px_0_rgba(136,19,55,0.22),0_0_22px_rgba(251,113,133,0.28)]",
  blue: "border-[#1d4ed8] bg-[#60a5fa] text-black shadow-[inset_-8px_-10px_0_rgba(29,78,216,0.22),0_0_22px_rgba(96,165,250,0.28)]",
  violet: "border-[#6d28d9] bg-[#a78bfa] text-black shadow-[inset_-8px_-10px_0_rgba(109,40,217,0.22),0_0_22px_rgba(167,139,250,0.28)]",
};

function StatPill({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-md border-2 border-border bg-card px-3 py-2 text-card-foreground shadow-pop-xs sm:px-4",
        className
      )}
    >
      <p className="font-inter text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate font-game text-2xl leading-none text-card-foreground sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function Hud({ lives, level, score, streak }: Pick<Props, "lives" | "level" | "score" | "streak">) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatPill label="Level" value={level} />
      <StatPill label="Score" value={score} />
      <div className="rounded-md border-2 border-border bg-card px-3 py-2 text-card-foreground shadow-pop-xs sm:px-4">
        <p className="font-inter text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Lives
        </p>
        <div className="mt-1 flex h-7 items-center gap-1.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <Heart
              key={index}
              className={cn(
                "size-5",
                index < lives ? "fill-danger text-danger" : "text-muted-foreground/35"
              )}
            />
          ))}
        </div>
      </div>
      <div className="rounded-md border-2 border-border bg-card px-3 py-2 text-card-foreground shadow-pop-xs sm:px-4">
        <p className="font-inter text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Streak
        </p>
        <p className="mt-0.5 flex items-center gap-1 font-game text-2xl leading-none text-primary sm:text-3xl">
          <Zap className="size-4 fill-arcade" />
          {streak}
        </p>
      </div>
    </div>
  );
}

function GameShell({
  children,
  phaseLabel,
  lives,
  level,
  score,
  streak,
}: {
  children: React.ReactNode;
  phaseLabel: string;
  lives: number;
  level: number;
  score: number;
  streak: number;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
      <Hud lives={lives} level={level} score={score} streak={streak} />
      {children}
    </div>
  );
}

function BubbleField({
  phase,
  bubbles,
  selectedIds,
  expectedIds,
  onBubbleClick,
}: Pick<Props, "phase" | "bubbles" | "selectedIds" | "expectedIds" | "onBubbleClick">) {
  const canClick = phase === "playing";

  return (
    <div
      className={cn(
        "relative aspect-[16/10] min-h-[360px] w-full overflow-hidden rounded-lg border-4 border-border bg-card shadow-pop-lg",
        "",
        phase === "round-failed" && "animate-[grid-shake_0.38s_ease-in-out]"
      )}
    >
      {bubbles.map((bubble) => {
        const selectedIndex = selectedIds.indexOf(bubble.id);
        const isSelected = selectedIndex >= 0;
        const nextBubble = expectedIds[selectedIds.length] === bubble.id;

        return (
          <button
            key={bubble.id}
            type="button"
            disabled={!canClick || isSelected}
            onClick={() => onBubbleClick(bubble.id)}
            className={cn(
              "absolute flex size-[clamp(92px,17vw,140px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 px-3 text-center transition-all duration-200",
              bubbleColorClass[bubble.color],
              canClick && !isSelected && "hover:-translate-y-[calc(50%+4px)] hover:scale-105 focus-visible:ring-4 focus-visible:ring-ring/50",
              isSelected && "scale-90 opacity-55 grayscale",
              nextBubble && canClick && "ring-4 ring-ring/40"
            )}
            style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
            aria-label={`${bubble.expression} equals ${bubble.value}`}
          >
            <span className="font-game text-[clamp(1.35rem,3.8vw,2.25rem)] leading-none">
              {bubble.expression}
            </span>
            <span className="mt-1 font-inter text-xs font-black uppercase tracking-wide opacity-70">
              {isSelected ? `Pick ${selectedIndex + 1}` : "Solve"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TimerBar({ timeLeft, timeLimit }: Pick<Props, "timeLeft" | "timeLimit">) {
  const progress = Math.max(0, timeLeft / timeLimit);

  return (
    <div className="rounded-lg border-4 border-border bg-card p-3 text-card-foreground shadow-pop-md">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-inter text-xs font-black uppercase tracking-wide text-muted-foreground">
          <Timer className="size-4" />
          Timer
        </p>
        <p className="font-game text-3xl leading-none text-primary">{timeLeft}s</p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-border bg-muted">
        <div
          className={cn(
            "h-full transition-all duration-500",
            progress > 0.5 ? "bg-success" : progress > 0.25 ? "bg-arcade" : "bg-danger"
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

function OrderBadge({ order }: { order: BubbleOrder }) {
  const Icon = order === "asc" ? ArrowUpNarrowWide : ArrowDownNarrowWide;

  return (
    <div className="flex items-center gap-3 rounded-lg border-4 border-border bg-card p-3 text-card-foreground shadow-pop-md">
      <div className="flex size-12 items-center justify-center rounded-md border-2 border-arcade-ink bg-arcade text-black">
        <Icon className="size-7" />
      </div>
      <div>
        <p className="font-inter text-[10px] font-black uppercase tracking-wide text-muted-foreground">
          Requested order
        </p>
        <p className="font-game text-2xl leading-none text-card-foreground sm:text-3xl">
          {order === "asc" ? "Lowest to Highest" : "Highest to Lowest"}
        </p>
      </div>
    </div>
  );
}

export default function BubbleMathUI({
  phase,
  level,
  lives,
  score,
  streak,
  bestStreak,
  highestLevel,
  order,
  bubbles,
  selectedIds,
  expectedIds,
  timeLeft,
  timeLimit,
  failedReason,
  onBubbleClick,
  onReset,
}: Props) {
  if (phase === "results") {
    return (
      <GameShell
        phaseLabel="Run complete"
        lives={lives}
        level={level}
        score={score}
        streak={streak}
      >
        <section className="mx-auto grid w-full max-w-3xl gap-4 rounded-lg border-4 border-border bg-card p-5 text-center text-card-foreground shadow-pop-xl sm:grid-cols-3">
          <div className="sm:col-span-3">
            <Trophy className="mx-auto size-10 fill-arcade text-arcade" />
            <h2 className="mt-3 font-game text-4xl leading-none text-card-foreground drop-shadow-pop-sm">
              Game Over
            </h2>
          </div>
          <StatPill label="Final Score" value={score} />
          <StatPill label="Best Level" value={highestLevel} />
          <StatPill label="Best Streak" value={bestStreak} />
          <Button
            variant="pixel"
            size="lg"
            onClick={onReset}
            className="h-12 rounded-lg border-4 font-game text-2xl sm:col-span-3"
          >
            <RotateCcw className="size-5" />
            Play Again
          </Button>
        </section>
      </GameShell>
    );
  }

  return (
    <GameShell
      phaseLabel={
        phase === "round-success"
          ? "Correct sequence"
          : phase === "round-failed"
            ? failedReason
            : "Pop the bubbles in order"
      }
      lives={lives}
      level={level}
      score={score}
      streak={streak}
    >
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <OrderBadge order={order} />
          <TimerBar timeLeft={timeLeft} timeLimit={timeLimit} />
        </div>

        {(phase === "round-success" || phase === "round-failed") && (
          <div
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border-4 bg-card p-3 font-inter text-sm font-black shadow-pop-md",
              phase === "round-success"
                ? "border-success-ink text-success"
                : "border-danger-ink text-danger"
            )}
          >
            {phase === "round-success" ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
            {phase === "round-success" ? "Score +10, next level loading" : "Round reset loading"}
          </div>
        )}

        <BubbleField
          phase={phase}
          bubbles={bubbles}
          selectedIds={selectedIds}
          expectedIds={expectedIds}
          onBubbleClick={onBubbleClick}
        />
      </section>
    </GameShell>
  );
}

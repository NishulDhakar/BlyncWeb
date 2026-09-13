"use client";

import {
  CheckCircle2,
  Heart,
  Lock,
  RotateCcw,
  Trash2,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuickMathPhase, QuickMathProblem } from "./logic";

/* ─────────────────────────── Types ─────────────────────────── */

type Props = {
  phase: QuickMathPhase;
  level: number;
  lives: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  streak: number;
  bestStreak: number;
  highestLevel: number;
  problem: QuickMathProblem | null;
  userDigits: number[];
  timeLeft: number;
  timeLimit: number;
  onDigitClick: (digit: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onReset: () => void;
};

/* ─────────────────────────── HUD ─────────────────────────── */

function HudStrip({
  lives,
  level,
  score,
  streak,
  timeLeft,
  timeLimit,
}: Pick<Props, "lives" | "level" | "score" | "streak" | "timeLeft" | "timeLimit">) {
  const progress = Math.max(0, timeLeft / timeLimit);
  const timerColor =
    progress > 0.25 ? "bg-primary" : "bg-destructive";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm">
      {/* Stats row */}
      <div className="flex items-center justify-between gap-2">
        {/* Lives */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                "size-5 transition-all duration-300",
                i < lives
                  ? "fill-rose-500 text-rose-500"
                  : "fill-transparent text-muted-foreground/35"
              )}
            />
          ))}
        </div>

        {/* Timer count */}
        <span className="font-mono text-2xl font-black tabular-nums text-card-foreground">
          {timeLeft}s
        </span>

        {/* Streak */}
        <span className="flex items-center gap-1 rounded-xl border border-border bg-muted px-3 py-1 text-sm font-bold text-card-foreground">
          <Zap className="size-3.5 fill-primary text-primary" />
          {streak}x
        </span>
      </div>

      {/* Timer bar */}
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-700", timerColor)}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Level / Score row */}
      <div className="mt-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <span>Level {level}</span>
        <span className="text-card-foreground/70">{score} pts</span>
      </div>
    </div>
  );
}

/* ─────────────────────────── Equation board ─────────────────────────── */

function EquationBoard({
  problem,
  userDigits,
  phase,
}: Pick<Props, "problem" | "userDigits" | "phase">) {
  if (!problem) return null;

  /* Build token list tagging each "_" with its blank index */
  const displayTokens = problem.tokens.map((token, index) => {
    if (token === "_") {
      const bi = problem.tokens.slice(0, index).filter((item) => item === "_").length;
      return { token, index, blankIndex: bi };
    }
    return { token, index, blankIndex: -1 };
  });

  const filledCount = userDigits.length;
  const isCorrect = phase === "correct";
  const isWrong = phase === "wrong";

  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-5 transition-all duration-300",
        isCorrect
          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/25"
          : isWrong
          ? "border-rose-400 bg-rose-50 dark:bg-rose-950/25 animate-[grid-shake_0.38s_ease-in-out]"
          : "border-border bg-card text-card-foreground shadow-sm"
      )}
    >
      {/* Equation row */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 min-h-[5rem]">
        {displayTokens.map(({ token, index, blankIndex }) => {
          if (token === "_") {
            const value = userDigits[blankIndex];
            const isFilled = value !== undefined;
            /* Cursor: the next blank to fill */
            const isActive = blankIndex === filledCount && phase === "playing";

            return (
              <div
                key={`blank-${index}`}
                className={cn(
                  "flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl border-2 text-xl font-black transition-all duration-200",
                  isFilled
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : isActive
                    ? "border-border bg-muted text-muted-foreground animate-pulse"
                    : "border-border bg-background text-muted-foreground/40"
                )}
              >
                {isFilled ? value : ""}
              </div>
            );
          }

          const isOp = ["+", "-", "x"].includes(token);
          return (
            <span
              key={`token-${index}`}
              className={cn(
                "flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl border border-border bg-background text-xl font-black",
                isOp ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {token}
            </span>
          );
        })}

        {/* = sign */}
        <span className="text-3xl font-black text-muted-foreground/45">=</span>

        {/* Target */}
        <span
          className={cn(
            "flex h-10 min-w-fit px-2 items-center justify-center rounded-2xl border-2 text-xl font-black",
            isCorrect
              ? "border-emerald-500 bg-emerald-100 text-emerald-700"
              : "border-border bg-muted text-foreground"
          )}
        >
          {problem.target}
        </span>
      </div>

      {/* Feedback banner */}
      {(isCorrect || isWrong) && (
        <div
          className={cn(
            "mt-4 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold",
            isCorrect
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200"
          )}
        >
          {isCorrect ? (
            <><CheckCircle2 className="size-4" /> Correct! Next level…</>
          ) : (
            <><XCircle className="size-4" /> Wrong! Life lost, moving on…</>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Numpad ─────────────────────────── */

function Numpad({
  problem,
  userDigits,
  phase,
  onDigitClick,
  onDelete,
  onSubmit,
}: Pick<Props, "problem" | "userDigits" | "phase" | "onDigitClick" | "onDelete" | "onSubmit">) {
  const canPlay = phase === "playing" && Boolean(problem);
  const isFull = Boolean(problem) && userDigits.length >= (problem?.blanks ?? 0);
  const canSubmit = canPlay && isFull;
  const canDelete = canPlay && userDigits.length > 0;

  /* How many times each digit appears in current selection — for subtle badge */
  const digitCount: Record<number, number> = {};
  userDigits.forEach((d) => {
    digitCount[d] = (digitCount[d] ?? 0) + 1;
  });

  return (
    <div className="flex flex-col gap-3">
      {/* 3x3 grid: 1-9 */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => {
          const count = digitCount[d] ?? 0;
          const isUsed = count > 0;
          const disabled = !canPlay || isFull;

          return (
            <button
              key={d}
              type="button"
              disabled={disabled}
              onClick={() => onDigitClick(d)}
              className={cn(
                "relative h-16 rounded-2xl border-2 text-3xl font-black transition-all duration-150 select-none",
                isUsed
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : disabled
                  ? "border-border bg-muted text-muted-foreground/35 cursor-not-allowed"
                  : "border-border bg-card text-card-foreground hover:bg-muted hover:border-ring hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm"
              )}
            >
              {d}
              {/* Badge if digit used more than once */}
              {count > 1 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-black text-background">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom row: delete | 0 | submit */}
      <div className="grid grid-cols-3 gap-3">
        {/* Delete */}
        <button
          type="button"
          disabled={!canDelete}
          onClick={onDelete}
          className={cn(
            "h-16 flex items-center justify-center rounded-2xl border-2 text-sm font-bold transition-all duration-150 active:scale-95",
            canDelete
              ? "border-border bg-card text-muted-foreground hover:bg-muted hover:text-destructive cursor-pointer"
              : "border-border bg-muted text-muted-foreground/35 cursor-not-allowed"
          )}
        >
          <Trash2 className="size-6" />
        </button>

        {/* 0 */}
        {(() => {
          const count = digitCount[0] ?? 0;
          const isUsed = count > 0;
          const disabled = !canPlay || isFull;
          return (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onDigitClick(0)}
              className={cn(
                "relative h-16 rounded-2xl border-2 text-3xl font-black transition-all duration-150 select-none",
                isUsed
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : disabled
                  ? "border-border bg-muted text-muted-foreground/35 cursor-not-allowed"
                  : "border-border bg-card text-card-foreground hover:bg-muted hover:border-ring hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm"
              )}
            >
              0
              {count > 1 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-black text-background">
                  {count}
                </span>
              )}
            </button>
          );
        })()}

        {/* Submit / Lock */}
        <button
          type="button"
          disabled={!canSubmit}
          onClick={onSubmit}
          className={cn(
            "h-16 flex items-center justify-center rounded-2xl border-2 transition-all duration-150 active:scale-95",
            canSubmit
              ? "border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer"
              : "border-border bg-muted text-muted-foreground/35 cursor-not-allowed"
          )}
        >
          <Lock className="size-6" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── Results screen ─────────────────────────── */

function ResultsScreen({
  score,
  highestLevel,
  bestStreak,
  correctCount,
  wrongCount,
  onReset,
}: Pick<Props, "score" | "highestLevel" | "bestStreak" | "correctCount" | "wrongCount" | "onReset">) {
  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div>
        <Trophy className="mx-auto size-14 fill-primary text-primary" />
        <h2 className="mt-3 text-4xl font-black tracking-tight text-foreground">Game Over</h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">Here&apos;s how you did</p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full">
        {[
          { label: "Score", value: score },
          { label: "Best Level", value: highestLevel },
          { label: "Best Streak", value: bestStreak },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-black text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 py-4">
          <CheckCircle2 className="size-5 text-emerald-500" />
          <span className="text-3xl font-black text-emerald-600">{correctCount}</span>
          <span className="text-xs font-bold text-muted-foreground">correct</span>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-rose-300 bg-rose-50 py-4">
          <XCircle className="size-5 text-rose-500" />
          <span className="text-3xl font-black text-rose-600">{wrongCount}</span>
          <span className="text-xs font-bold text-muted-foreground">wrong</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-2.5 rounded-2xl border-2 border-border bg-card px-8 py-4 text-base font-bold text-card-foreground shadow-sm transition-all hover:bg-muted hover:border-ring active:scale-95"
      >
        <RotateCcw className="size-4" />
        Play Again
      </button>
    </div>
  );
}

/* ─────────────────────────── Main export ─────────────────────────── */

export default function QuickMathUI({
  phase,
  level,
  lives,
  score,
  correctCount,
  wrongCount,
  streak,
  bestStreak,
  highestLevel,
  problem,
  userDigits,
  timeLeft,
  timeLimit,
  onDigitClick,
  onDelete,
  onSubmit,
  onReset,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-sm">
      {/* -- Results -- */}
      {phase === "results" && (
        <ResultsScreen
          score={score}
          highestLevel={highestLevel}
          bestStreak={bestStreak}
          correctCount={correctCount}
          wrongCount={wrongCount}
          onReset={onReset}
        />
      )}

      {/* -- Playing / Correct / Wrong -- */}
      {(phase === "playing" || phase === "correct" || phase === "wrong") && (
        <div className="flex flex-col gap-4">
          {/* Title label */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Quick Math
            </p>
          </div>

          {/* HUD */}
          <HudStrip
            lives={lives}
            level={level}
            score={score}
            streak={streak}
            timeLeft={timeLeft}
            timeLimit={timeLimit}
          />

          {/* Equation */}
          <EquationBoard problem={problem} userDigits={userDigits} phase={phase} />

          {/* Numpad */}
          <Numpad
            problem={problem}
            userDigits={userDigits}
            phase={phase}
            onDigitClick={onDigitClick}
            onDelete={onDelete}
            onSubmit={onSubmit}
          />
        </div>
      )}
    </div>
  );
}

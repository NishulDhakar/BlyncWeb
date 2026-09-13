"use client";

import {
  CheckCircle2,
  RotateCcw,
  SkipForward,
  Target,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MotionChallengeBoard from "./board";
import type {
  MotionEntity,
  MotionGameStatus,
  MotionLevel,
  MoveDirection,
} from "./logic";

type Props = {
  levelNumber: number;
  totalLevels: number;
  level: MotionLevel;
  timer: string;
  entities: MotionEntity[];
  selectedId: string | null;
  moves: number;
  score: number;
  correct: number;
  wrong: number;
  gameStatus: MotionGameStatus;
  isLevelWon: boolean;
  onSelect: (id: string | null) => void;
  onMove: (id: string, direction: MoveDirection) => void;
  onResetLevel: () => void;
  onSkipLevel: () => void;
  onNextLevel: () => void;
  onResetGame: () => void;
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

function GameShell({
  children,
  phaseLabel,
  levelNumber,
  totalLevels,
  timer,
  score,
  correct,
  wrong,
}: {
  children: React.ReactNode;
  phaseLabel: string;
  levelNumber: number;
  totalLevels: number;
  timer: string;
  score: number;
  correct: number;
  wrong: number;
}) {
  const progress = Math.min(100, Math.round(((levelNumber - 1) / totalLevels) * 100));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:gap-4">
      {/* Level progress bar */}
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-inter text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Level {levelNumber} of {totalLevels} · {phaseLabel}
          </span>
          <span className="font-inter text-xs font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full border border-border bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-arcade to-arcade transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
        <StatPill label="Level" value={`${levelNumber}/${totalLevels}`} />
        <StatPill label="Session" value={timer} />
        <StatPill label="Score" value={score} />
        <StatPill label="Solved" value={correct} className="border-success-ink" />
        <StatPill label="Skipped" value={wrong} className="border-danger-ink" />
      </div>
      {children}
    </div>
  );
}

function LevelCard({
  level,
  moves,
  levelNumber,
  totalLevels,
}: {
  level: MotionLevel;
  moves: number;
  levelNumber: number;
  totalLevels: number;
}) {
  const overPar = moves > level.par;

  return (
    <div className="rounded-lg border-4 border-border bg-card p-3 text-card-foreground shadow-pop-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-inter text-[10px] font-black uppercase tracking-wide text-muted-foreground">
            Board · {levelNumber}/{totalLevels}
          </p>
          <p className="mt-1 font-game text-2xl leading-none text-card-foreground sm:text-3xl">
            {level.name}
          </p>
        </div>
        <div className="text-right">
          <p className="font-inter text-[10px] font-black uppercase tracking-wide text-muted-foreground">
            Moves / Par
          </p>
          <p
            className={cn(
              "mt-1 font-game text-3xl leading-none",
              overPar ? "text-danger" : "text-primary"
            )}
          >
            {moves}/{level.par}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MotionChallengeUI({
  levelNumber,
  totalLevels,
  level,
  timer,
  entities,
  selectedId,
  moves,
  score,
  correct,
  wrong,
  gameStatus,
  isLevelWon,
  onSelect,
  onMove,
  onResetLevel,
  onSkipLevel,
  onNextLevel,
  onResetGame,
}: Props) {
  if (gameStatus === "results") {
    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

    return (
      <GameShell
        phaseLabel="Session complete"
        levelNumber={levelNumber}
        totalLevels={totalLevels}
        timer={timer}
        score={score}
        correct={correct}
        wrong={wrong}
      >
        <section className="mx-auto grid w-full max-w-3xl gap-4 rounded-lg border-4 border-border bg-card p-5 text-center text-card-foreground shadow-pop-xl sm:grid-cols-3">
          <div className="sm:col-span-3">
            <Trophy className="mx-auto size-10 fill-arcade text-arcade" />
            <h2 className="mt-3 font-game text-4xl leading-none text-card-foreground drop-shadow-pop-sm">
              Results
            </h2>
          </div>
          <StatPill label="Final Score" value={score} />
          <StatPill label="Boards Solved" value={correct} className="border-success-ink" />
          <StatPill label="Accuracy" value={`${accuracy}%`} />
          <Button
            variant="pixel"
            size="lg"
            onClick={onResetGame}
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
      phaseLabel={isLevelWon ? "Board cleared — move to the next!" : "Move the red ball into the hole"}
      levelNumber={levelNumber}
      totalLevels={totalLevels}
      timer={timer}
      score={score}
      correct={correct}
      wrong={wrong}
    >
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-3 sm:gap-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_250px] lg:gap-4">
          <LevelCard level={level} moves={moves} levelNumber={levelNumber} totalLevels={totalLevels} />
          <div className="rounded-lg border-4 border-border bg-card p-3 text-card-foreground shadow-pop-md">
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 font-inter text-xs font-black uppercase tracking-wide text-muted-foreground">
                <Timer className="size-4" />
                Session
              </p>
              <p className="font-game text-3xl leading-none text-primary">{timer}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                variant="pixel"
                size="sm"
                onClick={onResetLevel}
                className="h-10 rounded-lg border-4 font-game text-lg"
                aria-label="Reset board"
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
              <Button
                variant="pixel"
                size="sm"
                onClick={onSkipLevel}
                className="h-10 rounded-lg border-4 bg-danger font-game text-lg shadow-danger-sm hover:shadow-danger-xs"
                aria-label="Skip board"
              >
                <SkipForward className="size-4" />
                Skip
              </Button>
            </div>
          </div>
        </div>

        {isLevelWon && (
          <div className="flex flex-col items-center gap-3 rounded-lg border-4 border-success-ink bg-card p-4 shadow-pop-md sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2 font-inter text-sm font-black text-success">
              <CheckCircle2 className="size-5" />
              Cleared in {moves} moves
            </div>
            {levelNumber < totalLevels && (
              <Button
                variant="pixel"
                size="sm"
                onClick={onNextLevel}
                className="h-10 rounded-lg border-4 border-success-ink bg-success font-game text-lg text-black shadow-success-sm hover:shadow-success-xs"
                aria-label="Next level"
              >
                Next Level
                <SkipForward className="size-4" />
              </Button>
            )}
          </div>
        )}

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-4">
          <MotionChallengeBoard
            level={level}
            entities={entities}
            selectedId={selectedId}
            disabled={isLevelWon}
            onSelect={onSelect}
            onMove={onMove}
          />
          <aside className="grid gap-3 rounded-lg border-4 border-border bg-card p-4 shadow-pop-md lg:content-start">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-[#7f1d1d] bg-[#ef4444] text-white">
                <Target className="size-5" />
              </div>
              <p className="font-inter text-sm font-semibold leading-6 text-muted-foreground">
                Drag a piece to any eligible cell, or tap it and use the arrow buttons.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-[#92400e] bg-arcade text-black">
                <Zap className="size-5" />
              </div>
              <p className="font-inter text-sm font-semibold leading-6 text-muted-foreground">
                Horizontal and vertical blocks only slide along their own track.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </GameShell>
  );
}

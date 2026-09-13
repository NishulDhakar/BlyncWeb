"use client";

import {
  ArrowDown,
  DoorOpen,
  MapPin,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  Cell,
  Direction,
  GameMode,
  KeyGoal,
  KeyDoorPhase,
  LevelDefinition,
} from "./logic";

type Props = {
  phase: KeyDoorPhase;
  mode: GameMode;
  level: number;
  score: number;
  streak: number;
  highestLevel: number;
  elapsedSeconds: number;
  levelData: LevelDefinition;
  activeKeys: Cell[];
  position: Cell;
  hasKey: boolean;
  keyGoal: KeyGoal;
  keysLeft: number;
  collectedKeys: string[];
  message: string;
  failedCell: Cell | null;
  attemptedCell: Cell | null;
  showSolution: boolean;
  openEdges: Set<string>;
  onMove: (direction: Direction) => void;
  onReset: () => void;
  onKeyGoalChange: (keyGoal: KeyGoal) => void;
  onToggleSolution: () => void;
};

function sameCell(a: Cell, b: Cell) {
  return a.row === b.row && a.col === b.col;
}

function edgeKey(from: Cell, to: Cell) {
  return `${from.row},${from.col}->${to.row},${to.col}`;
}

function cellKey(cell: Cell) {
  return `${cell.row},${cell.col}`;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

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

function Hud({
  level,
  score,
  streak,
  elapsedSeconds,
  hasKey,
  keysLeft,
}: Pick<Props, "level" | "score" | "streak" | "elapsedSeconds" | "hasKey" | "keysLeft">) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <StatPill label="Score" value={score} />
      <StatPill label="Level" value={level} />
      <StatPill label="Time" value={formatTime(elapsedSeconds)} />
      <div className="rounded-md border-2 border-border bg-card px-3 py-2 text-card-foreground shadow-pop-xs sm:px-4">
        <p className="font-inter text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Keys Left
        </p>
        <p className={cn("mt-0.5 flex items-center gap-1 font-game text-2xl leading-none sm:text-3xl", hasKey ? "text-primary" : "text-muted-foreground/45")}>
          <KeyRound className={cn("size-5", hasKey && "fill-arcade")} />
          {keysLeft === 0 ? "Done" : keysLeft}
        </p>
      </div>
      <div className="rounded-md border-2 border-border bg-card px-3 py-2 text-card-foreground shadow-pop-xs sm:px-4">
        <p className="font-inter text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Streak
        </p>
        <p className="mt-0.5 flex items-center gap-1 font-game text-2xl leading-none text-success sm:text-3xl">
          <Zap className="size-4 fill-success" />
          {streak}
        </p>
      </div>
    </div>
  );
}

function GameShell({
  children,
  phaseLabel,
  level,
  score,
  streak,
  elapsedSeconds,
  hasKey,
  keysLeft,
}: {
  children: React.ReactNode;
  phaseLabel: string;
  level: number;
  score: number;
  streak: number;
  elapsedSeconds: number;
  hasKey: boolean;
  keysLeft: number;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
      <Hud
        level={level}
        score={score}
        streak={streak}
        elapsedSeconds={elapsedSeconds}
        hasKey={hasKey}
        keysLeft={keysLeft}
      />
      {children}
    </div>
  );
}

function DirectionButton({
  direction,
  onMove,
  children,
  className,
}: {
  direction: Direction;
  onMove: (direction: Direction) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      type="button"
      aria-label={`Move ${direction}`}
      title={`Move ${direction}`}
      onClick={() => onMove(direction)}
      className={cn(
        "size-12 rounded-md border-2 border-border bg-card p-0 text-card-foreground shadow-pop-xs hover:bg-primary hover:text-primary-foreground",
        className
      )}
    >
      {children}
    </Button>
  );
}

function DirectionPad({ onMove, disabled }: { onMove: (direction: Direction) => void; disabled: boolean }) {
  return (
    <div className={cn("mx-auto grid w-40 grid-cols-3 gap-2", disabled && "pointer-events-none opacity-45")}>
      <span />
      <DirectionButton direction="up" onMove={onMove}>
        <ArrowUp className="size-6" />
      </DirectionButton>
      <span />
      <DirectionButton direction="left" onMove={onMove}>
        <ArrowLeft className="size-6" />
      </DirectionButton>
      <DirectionButton direction="down" onMove={onMove}>
        <ArrowDown className="size-6" />
      </DirectionButton>
      <DirectionButton direction="right" onMove={onMove}>
        <ArrowRight className="size-6" />
      </DirectionButton>
    </div>
  );
}

function Board({
  phase,
  levelData,
  activeKeys,
  position,
  collectedKeys,
  failedCell,
  attemptedCell,
  showSolution,
  openEdges,
}: Pick<Props, "phase" | "levelData" | "activeKeys" | "position" | "collectedKeys" | "failedCell" | "attemptedCell" | "showSolution" | "openEdges">) {
  const cells = Array.from({ length: levelData.size * levelData.size }, (_, index) => ({
    row: Math.floor(index / levelData.size),
    col: index % levelData.size,
  }));
  const solutionKeys = new Set(levelData.solution.map((cell) => `${cell.row},${cell.col}`));

  return (
    <div className="mx-auto w-full max-w-[min(88vw,520px)]">
      <div
        className={cn(
          "grid aspect-square overflow-hidden rounded-lg border-4 border-border bg-background shadow-pop-xl",
          phase === "locked" && "animate-[grid-shake_0.38s_ease-in-out]"
        )}
        style={{ gridTemplateColumns: `repeat(${levelData.size}, minmax(0, 1fr))` }}
      >
        {cells.map((cell) => {
          const isPlayer = sameCell(cell, position);
          const isKey = activeKeys.some((key) => sameCell(cell, key) && !collectedKeys.includes(cellKey(key)));
          const isExit = sameCell(cell, levelData.exit);
          const isStart = sameCell(cell, levelData.start);
          const isFailed = failedCell && sameCell(cell, failedCell);
          const isAttempted = attemptedCell && sameCell(cell, attemptedCell);
          const isSolution = showSolution && solutionKeys.has(`${cell.row},${cell.col}`);

          return (
            <div
              key={`${cell.row}-${cell.col}`}
              className={cn(
                "relative flex min-h-0 min-w-0 items-center justify-center border border-border bg-card transition-all duration-200",
                (cell.row + cell.col) % 2 === 0 && "bg-muted",
                isStart && "bg-secondary",
                isSolution && "bg-success-ink/70",
                isPlayer && "z-10 scale-[0.96] bg-[#60a5fa] text-black shadow-[inset_0_0_0_3px_#dbeafe]",
                (isFailed || isAttempted) && phase === "locked" && "bg-danger text-black"
              )}
            >
              {showSolution && (
                <>
                  {cell.row > 0 && openEdges.has(edgeKey(cell, { row: cell.row - 1, col: cell.col })) && (
                    <span className="absolute top-1 h-2 w-0.5 bg-success" />
                  )}
                  {cell.row < levelData.size - 1 && openEdges.has(edgeKey(cell, { row: cell.row + 1, col: cell.col })) && (
                    <span className="absolute bottom-1 h-2 w-0.5 bg-success" />
                  )}
                  {cell.col > 0 && openEdges.has(edgeKey(cell, { row: cell.row, col: cell.col - 1 })) && (
                    <span className="absolute left-1 h-0.5 w-2 bg-success" />
                  )}
                  {cell.col < levelData.size - 1 && openEdges.has(edgeKey(cell, { row: cell.row, col: cell.col + 1 })) && (
                    <span className="absolute right-1 h-0.5 w-2 bg-success" />
                  )}
                </>
              )}
              <div className="relative z-10 flex aspect-square w-[46%] items-center justify-center rounded-md">
                {isPlayer ? (
                  <MapPin
                    aria-label="Your position"
                    className="h-full w-full text-sky-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.45)]"
                  />
                ) : isKey ? (
                  <KeyRound
                    aria-label="Key"
                    className="h-full w-full text-amber-400 drop-shadow-[0_0_10px_rgba(255,197,22,0.55)]"
                  />
                ) : isExit ? (
                  <DoorOpen
                    aria-label="Exit door"
                    className="h-full w-full text-orange-400 drop-shadow-[0_0_10px_rgba(244,160,29,0.45)]"
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function KeyDoorUI({
  phase,
  mode,
  level,
  score,
  streak,
  highestLevel,
  elapsedSeconds,
  levelData,
  activeKeys,
  position,
  hasKey,
  keyGoal,
  keysLeft,
  collectedKeys,
  message,
  failedCell,
  attemptedCell,
  showSolution,
  openEdges,
  onMove,
  onReset,
  onKeyGoalChange,
  onToggleSolution,
}: Props) {
  const keyGoalControl = (
    <div className="flex rounded-md border-2 border-border bg-background p-1">
      {([1, 2] as const).map((option) => {
        const selected = keyGoal === option;
        return (
          <Button
            key={option}
            type="button"
            aria-pressed={selected}
            title={`${option} key mode`}
            onClick={() => onKeyGoalChange(option)}
            className={cn(
              "h-9 rounded-sm border-0 px-3 font-inter text-xs font-black uppercase tracking-wide",
              selected
                ? "bg-primary text-primary-foreground hover:bg-primary"
                : "bg-transparent text-muted-foreground hover:bg-card hover:text-card-foreground"
            )}
          >
            <KeyRound className={cn("size-4", selected && "fill-arcade")} />
            {option} Key
          </Button>
        );
      })}
    </div>
  );

  if (phase === "results") {
    return (
      <GameShell
        phaseLabel="Run complete"
        level={level}
        score={score}
        streak={streak}
        elapsedSeconds={elapsedSeconds}
        hasKey={hasKey}
        keysLeft={keysLeft}
      >
        <section className="mx-auto grid w-full max-w-3xl gap-4 rounded-lg border-4 border-border bg-card p-5 text-center text-card-foreground shadow-pop-xl sm:grid-cols-3">
          <div className="sm:col-span-3">
            <Trophy className="mx-auto size-10 fill-arcade text-arcade" />
            <h2 className="mt-3 font-game text-4xl leading-none text-card-foreground drop-shadow-pop-sm">
              All Locks Cleared
            </h2>
          </div>
          <StatPill label="Final Score" value={score} />
          <StatPill label="Best Level" value={highestLevel} />
          <StatPill label="Time" value={formatTime(elapsedSeconds)} />
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

  const controlsDisabled = phase === "locked" || phase === "level-complete";

  return (
    <GameShell
      phaseLabel={message}
      level={level}
      score={score}
      streak={streak}
      elapsedSeconds={elapsedSeconds}
      hasKey={hasKey}
      keysLeft={keysLeft}
    >
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 rounded-lg border-4 bg-card p-3 shadow-pop-md",
            phase === "locked"
              ? "border-danger-ink text-danger"
              : phase === "level-complete"
                ? "border-success-ink text-success"
                : "border-border text-card-foreground"
          )}
        >
          <p className="flex items-center gap-2 font-inter text-sm font-black">
            {phase === "level-complete" ? <CheckCircle2 className="size-5" /> : <KeyRound className="size-5" />}
            {message}
          </p>
          <div className="flex flex-wrap gap-2">
            {keyGoalControl}
            {mode === "practice" && (
              <Button
                type="button"
                onClick={onToggleSolution}
                className="h-10 rounded-md border-2 border-border bg-card px-3 font-inter text-xs font-black uppercase tracking-wide text-card-foreground hover:bg-success-ink hover:text-white"
              >
                {showSolution ? "Hide Solution" : "Show Solution"}
              </Button>
            )}
            <Button
              type="button"
              onClick={onReset}
              className="h-10 rounded-md border-2 border-border bg-card px-3 font-inter text-xs font-black uppercase tracking-wide text-card-foreground hover:bg-primary hover:text-primary-foreground"
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>
        </div>

        <Board
          phase={phase}
          levelData={levelData}
          activeKeys={activeKeys}
          position={position}
          collectedKeys={collectedKeys}
          failedCell={failedCell}
          attemptedCell={attemptedCell}
          showSolution={mode === "practice" && showSolution}
          openEdges={openEdges}
        />

        <DirectionPad onMove={onMove} disabled={controlsDisabled} />
      </section>
    </GameShell>
  );
}

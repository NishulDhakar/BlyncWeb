"use client";

import { Check, MapPin, RefreshCw, RotateCcw, Rocket, Shuffle, Timer, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  Board,
  CellPosition,
  PathGridSize,
  PathDirection,
  PathPhase,
  SelectedBlock,
} from "./logic";

type Props = {
  phase: PathPhase;
  gridSize: PathGridSize;
  level: number;
  score: number;
  streak: number;
  highestLevel: number;
  board: Board;
  selectedBlock: SelectedBlock | null;
  selectedBlockIsEditable: boolean;
  entryRow: number;
  exitRow: number;
  levelTitle: string;
  message: string;
  attempts: number;
  moves: number;
  timeLeft: number;
  timeLimit: number;
  tracedPath: CellPosition[];
  rocketStep: number;
  onSelectSize: (size: PathGridSize) => void;
  onSelectCell: (row: number, col: number) => void;
  onRotate: () => void;
  onChangeDirection: () => void;
  onConfirm: () => void;
  onRetry: () => void;
  onResetLevel: () => void;
  onRestart: () => void;
};

const gridSizes: PathGridSize[] = [3, 6, 9];

const directionSymbol: Record<PathDirection, string> = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

function sameCell(a: CellPosition, b: CellPosition) {
  return a.row === b.row && a.col === b.col;
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
  timeLeft,
}: Pick<Props, "level" | "score" | "streak" | "timeLeft">) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatPill label="Level" value={level} />
      <StatPill label="Score" value={score} />
      <StatPill label="Timer" value={formatTime(timeLeft)} />
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
  level,
  score,
  streak,
  timeLeft,
}: {
  children: React.ReactNode;
  phaseLabel: string;
  level: number;
  score: number;
  streak: number;
  timeLeft: number;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
      <Hud level={level} score={score} streak={streak} timeLeft={timeLeft} />
      {children}
    </div>
  );
}

function TimerBar({ timeLeft, timeLimit }: Pick<Props, "timeLeft" | "timeLimit">) {
  const progress = Math.max(0, Math.min(1, timeLeft / timeLimit));

  return (
    <div className="rounded-lg border-4 border-border bg-card p-3 text-card-foreground shadow-pop-md">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-inter text-xs font-black uppercase tracking-wide text-muted-foreground">
          <Timer className="size-4" />
          Timer
        </p>
        <p className="font-game text-3xl leading-none text-primary">{formatTime(timeLeft)}</p>
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

function SizeSelector({
  gridSize,
  onSelectSize,
}: Pick<Props, "gridSize" | "onSelectSize">) {
  return (
    <div className="rounded-lg border-4 border-border bg-card p-3 text-card-foreground shadow-pop-md">
      <p className="font-inter text-[10px] font-black uppercase tracking-wide text-muted-foreground">
        Grid size
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {gridSizes.map((size) => {
          const selected = gridSize === size;

          return (
            <Button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={cn(
                "h-10 rounded-md border-2 px-2 font-game text-xl leading-none shadow-pop-2xs",
                selected
                  ? "border-arcade-ink bg-arcade text-black hover:bg-[#ffd84d]"
                  : "border-border bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              {size}x{size}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function BoardView({
  board,
  selectedBlock,
  entryRow,
  exitRow,
  tracedPath,
  rocketStep,
  phase,
  onSelectCell,
}: Pick<
  Props,
  | "board"
  | "selectedBlock"
  | "entryRow"
  | "exitRow"
  | "tracedPath"
  | "rocketStep"
  | "phase"
  | "onSelectCell"
>) {
  const size = board.length;
  const railCells = Array.from({ length: size }, (_, index) => index);
  const rocketCell = phase === "animating" ? tracedPath[rocketStep] : null;

  return (
    <div className="mx-auto grid w-full max-w-[min(86vw,640px)] grid-cols-[28px_1fr_28px] gap-1.5 sm:grid-cols-[56px_1fr_56px] sm:gap-2">
      <div
        className="grid h-full"
        style={{ gridTemplateRows: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {railCells.map((row) => (
          <div key={row} className="flex min-h-0 items-center justify-center">
            {row === entryRow && (
              <Rocket
                aria-label="Rocket launch"
                className="h-5 w-5 text-primary sm:h-9 sm:w-9"
                strokeWidth={2.6}
              />
            )}
          </div>
        ))}
      </div>

      <div
        className={cn(
          "grid aspect-square overflow-hidden border-[3px] border-border bg-background shadow-pop-lg",
          phase === "failed" && "animate-[grid-shake_0.38s_ease-in-out]"
        )}
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {board.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected =
              selectedBlock &&
              Math.floor(rowIndex / 3) === selectedBlock.row &&
              Math.floor(colIndex / 3) === selectedBlock.col;
            const isTraced = tracedPath.some((pathCell) => sameCell(pathCell, { row: rowIndex, col: colIndex }));
            const isRocket = rocketCell && sameCell(rocketCell, { row: rowIndex, col: colIndex });
            const blockTop = rowIndex % 3 === 0;
            const blockLeft = colIndex % 3 === 0;
            const blockRight = colIndex % 3 === 2 || colIndex === size - 1;
            const blockBottom = rowIndex % 3 === 2 || rowIndex === size - 1;

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                disabled={phase !== "playing"}
                onClick={() => onSelectCell(rowIndex, colIndex)}
                className={cn(
                  "relative flex min-h-0 min-w-0 items-center justify-center border border-border transition-all duration-150",
                  cell.type === "path"
                    ? "bg-card text-card-foreground"
                    : "bg-muted text-transparent",
                  isTraced && cell.type === "path" && phase !== "playing" && "bg-success-ink text-[#bbf7d0]",
                  isSelected && "z-10 ring-[3px] ring-inset ring-arcade",
                  isSelected && blockTop && "border-t-arcade",
                  isSelected && blockRight && "border-r-arcade",
                  isSelected && blockBottom && "border-b-arcade",
                  isSelected && blockLeft && "border-l-arcade",
                  phase === "playing" && "hover:z-20 hover:ring-2 hover:ring-inset hover:ring-ring/70"
                )}
                aria-label={`Select 3x3 block ${Math.floor(rowIndex / 3) + 1}, ${Math.floor(colIndex / 3) + 1}`}
              >
                {cell.type === "path" && !isRocket && (
                  <span className="font-sans text-[clamp(1.1rem,3.7vw,2.2rem)] font-bold leading-none text-card-foreground">
                    {directionSymbol[cell.direction]}
                  </span>
                )}
                {isRocket && (
                  <Rocket
                    aria-label="Rocket moving on route"
                    className="absolute h-[42%] w-[42%] text-arcade drop-shadow-[0_0_8px_rgba(255,255,255,0.45)] sm:h-[50%] sm:w-[50%]"
                    strokeWidth={2.8}
                  />
                )}
              </button>
            );
          })
        )}
      </div>

      <div
        className="grid h-full"
        style={{ gridTemplateRows: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {railCells.map((row) => (
          <div key={row} className="flex min-h-0 items-center justify-center">
            {row === exitRow && (
              <MapPin
                aria-label="Destination location"
                className="h-5 w-5 text-success drop-shadow-[0_0_8px_rgba(34,197,94,0.45)] sm:h-9 sm:w-9"
                strokeWidth={2.6}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ControlButton({
  children,
  disabled,
  onClick,
  title,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <Button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={title}
      className="h-14 rounded-lg border-4 border-border bg-card px-4 font-game text-2xl text-card-foreground shadow-pop-sm hover:bg-primary hover:text-primary-foreground disabled:opacity-45"
    >
      {children}
    </Button>
  );
}

function ControlPanel({
  phase,
  selectedBlock,
  selectedBlockIsEditable,
  message,
  moves,
  attempts,
  levelTitle,
  onRotate,
  onChangeDirection,
  onConfirm,
  onRetry,
  onResetLevel,
}: Pick<
  Props,
  | "phase"
  | "selectedBlock"
  | "selectedBlockIsEditable"
  | "message"
  | "moves"
  | "attempts"
  | "levelTitle"
  | "onRotate"
  | "onChangeDirection"
  | "onConfirm"
  | "onRetry"
  | "onResetLevel"
>) {
  const canEdit = phase === "playing" && selectedBlock !== null;

  return (
    <div
      className={cn(
        "rounded-lg border-4 bg-card p-4 text-card-foreground shadow-pop-lg",
        phase === "failed"
          ? "border-danger-ink"
          : phase === "animating"
            ? "border-success-ink"
            : "border-border"
      )}
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p
            className={cn(
              "font-game text-3xl leading-none",
              phase === "failed"
                ? "text-danger"
                : phase === "animating"
                  ? "text-success"
                  : "text-card-foreground"
            )}
          >
            {message}
          </p>
          <p className="mt-2 font-inter text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {levelTitle} · moves {moves} · checks {attempts}
            {selectedBlock
              ? ` · block ${selectedBlock.row + 1},${selectedBlock.col + 1}${selectedBlockIsEditable ? "" : " decoy"}`
              : " · no block selected"}
          </p>
        </div>
        {phase === "failed" && (
          <Button
            type="button"
            onClick={onRetry}
            className="h-11 rounded-md border-2 border-border bg-card px-4 font-inter text-xs font-black uppercase tracking-wide text-card-foreground hover:bg-primary hover:text-primary-foreground"
          >
            Keep Editing
          </Button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ControlButton disabled={!canEdit} onClick={onRotate} title="Rotate selected block">
          <RefreshCw className="size-6" />
        </ControlButton>
        <ControlButton disabled={!canEdit} onClick={onChangeDirection} title="Change selected block arrows">
          <Shuffle className="size-6" />
        </ControlButton>
        <ControlButton disabled={phase !== "playing"} onClick={onConfirm} title="Validate path">
          <Check className="size-7" />
        </ControlButton>
        <ControlButton onClick={onResetLevel} title="Reset current level">
          <RotateCcw className="size-6" />
        </ControlButton>
      </div>
    </div>
  );
}

function ResultScreen({
  score,
  highestLevel,
  streak,
  onRestart,
}: Pick<Props, "score" | "highestLevel" | "streak" | "onRestart">) {
  return (
    <GameShell
      phaseLabel="Run complete"
      level={highestLevel}
      score={score}
      streak={streak}
      timeLeft={0}
    >
      <section className="mx-auto grid w-full max-w-3xl gap-4 rounded-lg border-4 border-border bg-card p-5 text-center text-card-foreground shadow-pop-xl sm:grid-cols-3">
        <div className="sm:col-span-3">
          <Trophy className="mx-auto size-10 fill-arcade text-arcade" />
          <h2 className="mt-3 font-game text-4xl leading-none text-card-foreground drop-shadow-pop-sm">
            Routes Complete
          </h2>
        </div>
        <StatPill label="Final Score" value={score} />
        <StatPill label="Best Level" value={highestLevel} />
        <StatPill label="Streak" value={streak} />
        <Button
          variant="pixel"
          size="lg"
          onClick={onRestart}
          className="h-12 rounded-lg border-4 font-game text-2xl sm:col-span-3"
        >
          <RotateCcw className="size-5" />
          Play Again
        </Button>
      </section>
    </GameShell>
  );
}

export default function PathFinderUI({
  phase,
  gridSize,
  level,
  score,
  streak,
  highestLevel,
  board,
  selectedBlock,
  selectedBlockIsEditable,
  entryRow,
  exitRow,
  levelTitle,
  message,
  attempts,
  moves,
  timeLeft,
  timeLimit,
  tracedPath,
  rocketStep,
  onSelectSize,
  onSelectCell,
  onRotate,
  onChangeDirection,
  onConfirm,
  onRetry,
  onResetLevel,
  onRestart,
}: Props) {
  if (phase === "results") {
    return (
      <ResultScreen
        score={score}
        highestLevel={highestLevel}
        streak={streak}
        onRestart={onRestart}
      />
    );
  }

  return (
    <GameShell
      phaseLabel="Select a 3x3 block, rotate or change arrows, then validate."
      level={level}
      score={score}
      streak={streak}
      timeLeft={timeLeft}
    >
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px_240px]">
          <div className="rounded-lg border-4 border-border bg-card p-3 text-card-foreground shadow-pop-md">
            <p className="font-inter text-[10px] font-black uppercase tracking-wide text-muted-foreground">
              Objective
            </p>
            <p className="mt-1 font-game text-2xl leading-none text-card-foreground sm:text-3xl">
              Launch to Location
            </p>
          </div>
          <SizeSelector gridSize={gridSize} onSelectSize={onSelectSize} />
          <TimerBar timeLeft={timeLeft} timeLimit={timeLimit} />
        </div>

        <div className="rounded-lg border-4 border-border bg-card p-4 shadow-pop-xl">
          <BoardView
            board={board}
            selectedBlock={selectedBlock}
            entryRow={entryRow}
            exitRow={exitRow}
            tracedPath={tracedPath}
            rocketStep={rocketStep}
            phase={phase}
            onSelectCell={onSelectCell}
          />
        </div>

        <ControlPanel
          phase={phase}
          selectedBlock={selectedBlock}
          selectedBlockIsEditable={selectedBlockIsEditable}
          message={message}
          moves={moves}
          attempts={attempts}
          levelTitle={levelTitle}
          onRotate={onRotate}
          onChangeDirection={onChangeDirection}
          onConfirm={onConfirm}
          onRetry={onRetry}
          onResetLevel={onResetLevel}
        />
      </section>
    </GameShell>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DeductiveChallengeUI from "./ui";
import { useGameSession } from "@/games/hooks/useGameSession";

export type DeductivePhase = "playing" | "correct" | "wrong" | "results";
export type DeductiveSymbol = "A" | "B" | "C" | "D" | "E" | "F";

export type DeductiveCell = {
  row: number;
  col: number;
};

export type DeductivePuzzle = {
  id: number;
  grid: DeductiveSymbol[][];
  targetCell: DeductiveCell;
  emptyCells: DeductiveCell[];
  answer: DeductiveSymbol;
  options: DeductiveSymbol[];
  size: number;
};

type GameState = {
  phase: DeductivePhase;
  level: number;
  lives: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  streak: number;
  bestStreak: number;
  highestLevel: number;
  puzzle: DeductivePuzzle | null;
  selected: DeductiveSymbol | null;
  timeLeft: number;
  timeLimit: number;
};

const MAX_LIVES = 3;
const BASE_TIME = 20;
const SYMBOLS: DeductiveSymbol[] = ["A", "B", "C", "D", "E", "F"];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]) {
  const output = [...items];

  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }

  return output;
}

function sameCell(left: DeductiveCell, right: DeductiveCell) {
  return left.row === right.row && left.col === right.col;
}

function getBoardSize(level: number) {
  if (level >= 9) return 5;
  if (level >= 4) return 4;
  return 3;
}

function getTimeLimit(level: number) {
  return Math.max(9, BASE_TIME - Math.floor((level - 1) / 3) * 2);
}

function createLatinGrid(symbols: DeductiveSymbol[]) {
  const size = symbols.length;
  const rowOrder = shuffle(Array.from({ length: size }, (_, index) => index));
  const colOrder = shuffle(Array.from({ length: size }, (_, index) => index));
  const symbolOrder = shuffle(symbols);

  return rowOrder.map((sourceRow) =>
    colOrder.map((sourceCol) => symbolOrder[(sourceRow + sourceCol) % size])
  );
}

function hasNoRowOrColumnRepeats(grid: DeductiveSymbol[][]) {
  const size = grid.length;

  for (let index = 0; index < size; index += 1) {
    const rowSymbols = new Set(grid[index]);
    const colSymbols = new Set(grid.map((row) => row[index]));

    if (rowSymbols.size !== size || colSymbols.size !== size) return false;
  }

  return true;
}

function createCells(size: number) {
  return Array.from({ length: size * size }, (_, index) => ({
    row: Math.floor(index / size),
    col: index % size,
  }));
}

function pickOne(cells: DeductiveCell[]) {
  if (cells.length === 0) return null;
  return cells[randomInt(0, cells.length - 1)];
}

function containsCell(cells: DeductiveCell[], target: DeductiveCell) {
  return cells.some((cell) => sameCell(cell, target));
}

function dedupeCells(cells: DeductiveCell[]) {
  return cells.filter(
    (cell, index) => cells.findIndex((item) => sameCell(item, cell)) === index
  );
}

function countTargetCandidates({
  grid,
  symbols,
  targetCell,
  emptyCells,
}: {
  grid: DeductiveSymbol[][];
  symbols: DeductiveSymbol[];
  targetCell: DeductiveCell;
  emptyCells: DeductiveCell[];
}) {
  const hidden = (row: number, col: number) => containsCell(emptyCells, { row, col });
  const visibleRowSymbols = new Set(
    grid[targetCell.row].filter((_, col) => !hidden(targetCell.row, col))
  );
  const visibleColSymbols = new Set(
    grid.map((row) => row[targetCell.col]).filter((_, rowIndex) => !hidden(rowIndex, targetCell.col))
  );

  return symbols.filter(
    (symbol) => !visibleRowSymbols.has(symbol) && !visibleColSymbols.has(symbol)
  );
}

function getHiddenCellPlan(level: number, size: number, targetCell: DeductiveCell) {
  const cells = createCells(size).filter((cell) => !sameCell(cell, targetCell));
  const sameRow = cells.filter((cell) => cell.row === targetCell.row);
  const sameCol = cells.filter((cell) => cell.col === targetCell.col);
  const offAxis = cells.filter(
    (cell) => cell.row !== targetCell.row && cell.col !== targetCell.col
  );
  const planned: DeductiveCell[] = [targetCell];

  if (level >= 4) {
    const rowBlank = pickOne(sameRow);
    if (rowBlank) planned.push(rowBlank);
  }

  if (level >= 9) {
    const colBlank = pickOne(sameCol);
    if (colBlank) planned.push(colBlank);
  }

  const offAxisCount = level < 4 ? 1 : level < 7 ? 2 : level < 11 ? 3 : 4;

  return dedupeCells([...planned, ...shuffle(offAxis).slice(0, offAxisCount)]);
}

function createPuzzleCandidate(level: number): DeductivePuzzle | null {
  const size = getBoardSize(level);
  const symbols = SYMBOLS.slice(0, size);
  const grid = createLatinGrid(symbols);
  const targetCell = {
    row: randomInt(0, size - 1),
    col: randomInt(0, size - 1),
  };
  const emptyCells = getHiddenCellPlan(level, size, targetCell);
  const answer = grid[targetCell.row][targetCell.col];
  const options = shuffle(symbols);
  const candidates = countTargetCandidates({ grid, symbols, targetCell, emptyCells });

  if (!hasNoRowOrColumnRepeats(grid)) return null;
  if (candidates.length !== 1 || candidates[0] !== answer) return null;

  return {
    id: Date.now() + randomInt(1, 9999),
    grid,
    targetCell,
    emptyCells,
    answer,
    options,
    size,
  };
}

export function createPuzzle(level: number): DeductivePuzzle {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const puzzle = createPuzzleCandidate(level);

    if (puzzle) return puzzle;
  }

  const easierLevel = Math.max(1, level - 3);
  const fallback = createPuzzleCandidate(easierLevel);

  if (fallback) return fallback;

  return createPuzzle(1);
}

// Games auto-start on mount — no separate "start" phase or button. The
// initial state below is deliberately identical to what startLevel(1, ...)
// would produce for a fresh run.
function initialState(): GameState {
  const timeLimit = getTimeLimit(1);

  return {
    phase: "playing",
    level: 1,
    lives: MAX_LIVES,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    streak: 0,
    bestStreak: 0,
    highestLevel: 1,
    puzzle: createPuzzle(1),
    selected: null,
    timeLeft: timeLimit,
    timeLimit,
  };
}

function startLevel(level: number, source: GameState): GameState {
  const timeLimit = getTimeLimit(level);

  return {
    ...source,
    phase: "playing",
    level,
    highestLevel: Math.max(source.highestLevel, level),
    puzzle: createPuzzle(level),
    selected: null,
    timeLeft: timeLimit,
    timeLimit,
  };
}

export default function DeductiveChallengeGame() {
  const [state, setState] = useState<GameState>(initialState);

  // Persists the finished run to the leaderboard exactly once.
  // Shared with every other game — see src/games/hooks/useGameSession.ts.
  useGameSession({ gameSlug: "gap-challenge", score: state.score, finished: state.phase === "results" });
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleGrid = useMemo(() => state.puzzle?.grid ?? [], [state.puzzle]);

  const queueNext = useCallback((nextState: GameState, lives: number) => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    transitionRef.current = setTimeout(() => {
      setState((latest) => {
        if (lives <= 0) return { ...latest, phase: "results" };
        return startLevel(latest.level + 1, latest);
      });
    }, 900);

    return nextState;
  }, []);

  useEffect(() => {
    if (state.phase !== "playing") return;
    if (state.timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setState((current) => {
        if (current.phase !== "playing") return current;

        if (current.timeLeft <= 1) {
          const lives = current.lives - 1;
          return queueNext(
            {
              ...current,
              phase: "wrong",
              lives,
              wrongCount: current.wrongCount + 1,
              streak: 0,
              timeLeft: 0,
            },
            lives
          );
        }

        return { ...current, timeLeft: current.timeLeft - 1 };
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [queueNext, state.phase, state.timeLeft]);

  useEffect(() => {
    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, []);

  const handleSelect = useCallback(
    (symbol: DeductiveSymbol) => {
      setState((current) => {
        if (current.phase !== "playing" || !current.puzzle) return current;

        const isCorrect = current.puzzle.answer === symbol;
        const lives = isCorrect ? current.lives : current.lives - 1;
        const streak = isCorrect ? current.streak + 1 : 0;
        const scoreGain = isCorrect ? 14 + Math.max(0, current.level - 1) * 2 + streak * 2 : 0;

        return queueNext(
          {
            ...current,
            phase: isCorrect ? "correct" : "wrong",
            lives,
            selected: symbol,
            score: current.score + scoreGain,
            correctCount: current.correctCount + (isCorrect ? 1 : 0),
            wrongCount: current.wrongCount + (isCorrect ? 0 : 1),
            streak,
            bestStreak: Math.max(current.bestStreak, streak),
          },
          lives
        );
      });
    },
    [queueNext]
  );

  const handleReset = useCallback(() => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setState(initialState());
  }, []);

  return (
    <DeductiveChallengeUI
      phase={state.phase}
      level={state.level}
      lives={state.lives}
      score={state.score}
      correctCount={state.correctCount}
      wrongCount={state.wrongCount}
      streak={state.streak}
      bestStreak={state.bestStreak}
      highestLevel={state.highestLevel}
      puzzle={state.puzzle}
      grid={visibleGrid}
      selected={state.selected}
      timeLeft={state.timeLeft}
      timeLimit={state.timeLimit}
      onSelect={handleSelect}
      onReset={handleReset}
    />
  );
}

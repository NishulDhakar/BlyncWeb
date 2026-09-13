"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PathFinderUI from "./ui";
import { useGameSession } from "@/games/hooks/useGameSession";

export type PathDirection = "up" | "down" | "left" | "right";
export type PathPhase = "playing" | "animating" | "failed" | "results";
export type PathGridSize = 3 | 6 | 9;

export type PathCell =
  | { type: "empty" }
  | { type: "path"; direction: PathDirection };

export type Board = PathCell[][];

export type CellPosition = {
  row: number;
  col: number;
};

export type SelectedBlock = {
  row: number;
  col: number;
};

type Puzzle = {
  board: Board;
  entryRow: number;
  exitRow: number;
  editableBlocks: Set<string>;
  timeLimit: number;
  title: string;
  seed: number;
};

type BlockScramble = {
  block: SelectedBlock;
  rotations: number;
  directionShifts: number;
};

type ValidationResult = {
  ok: boolean;
  reason: string;
  visited: CellPosition[];
};

type GameState = {
  phase: PathPhase;
  gridSize: PathGridSize;
  level: number;
  score: number;
  streak: number;
  highestLevel: number;
  board: Board;
  selectedBlock: SelectedBlock | null;
  entryRow: number;
  exitRow: number;
  editableBlocks: Set<string>;
  message: string;
  attempts: number;
  moves: number;
  timeLeft: number;
  timeLimit: number;
  levelTitle: string;
  puzzleSeed: number;
  tracedPath: CellPosition[];
  rocketStep: number;
};

const BLOCK_SIZE = 3;
const DEFAULT_GRID_SIZE: PathGridSize = 6;
const SOLVE_BONUS = 80;
const STREAK_BONUS = 10;

const DELTAS: Record<PathDirection, CellPosition> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

const ROTATE_DIRECTION: Record<PathDirection, PathDirection> = {
  up: "right",
  right: "down",
  down: "left",
  left: "up",
};

function makeSeed() {
  return Date.now() + Math.floor(Math.random() * 1_000_000);
}

function createRng(seed: number) {
  let value = seed % 2_147_483_647;
  if (value <= 0) value += 2_147_483_646;

  return () => {
    value = (value * 16_807) % 2_147_483_647;
    return (value - 1) / 2_147_483_646;
  };
}

function randomInt(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pickOne<T>(rng: () => number, items: T[]) {
  return items[randomInt(rng, 0, items.length - 1)];
}

function directionBetween(from: CellPosition, to: CellPosition): PathDirection {
  if (to.row < from.row) return "up";
  if (to.row > from.row) return "down";
  if (to.col < from.col) return "left";
  return "right";
}

function emptyBoard(size: number): Board {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ type: "empty" }) as PathCell)
  );
}

function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

function cellKey(cell: CellPosition) {
  return `${cell.row}-${cell.col}`;
}

function blockKey(block: SelectedBlock) {
  return `${block.row}-${block.col}`;
}

function getBlockCount(size: number) {
  return size / BLOCK_SIZE;
}

function getBlock(board: Board, block: SelectedBlock): Board {
  const startRow = block.row * BLOCK_SIZE;
  const startCol = block.col * BLOCK_SIZE;

  return Array.from({ length: BLOCK_SIZE }, (_, row) =>
    Array.from({ length: BLOCK_SIZE }, (_, col) => {
      const source = board[startRow + row]?.[startCol + col];
      return source ? { ...source } : ({ type: "empty" } as PathCell);
    })
  );
}

function setBlock(board: Board, block: SelectedBlock, patch: Board): Board {
  const next = cloneBoard(board);
  const startRow = block.row * BLOCK_SIZE;
  const startCol = block.col * BLOCK_SIZE;

  patch.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      next[startRow + rowIndex][startCol + colIndex] = { ...cell };
    });
  });

  return next;
}

function rotateCell(cell: PathCell): PathCell {
  if (cell.type === "empty") return cell;
  return { type: "path", direction: ROTATE_DIRECTION[cell.direction] };
}

function rotateBlockCells(block: Board): Board {
  return Array.from({ length: BLOCK_SIZE }, (_, row) =>
    Array.from({ length: BLOCK_SIZE }, (_, col) => rotateCell(block[BLOCK_SIZE - 1 - col][row]))
  );
}

function rotateBlock(board: Board, block: SelectedBlock): Board {
  return setBlock(board, block, rotateBlockCells(getBlock(board, block)));
}

function shiftBlockDirections(board: Board, block: SelectedBlock): Board {
  const shifted = getBlock(board, block).map((row) => row.map(rotateCell));
  return setBlock(board, block, shifted);
}

function getTimeLimit(size: PathGridSize) {
  if (size === 3) return 90;
  if (size === 6) return 150;
  return 240;
}

function makeRoute(size: PathGridSize, rng: () => number) {
  const entryRow = randomInt(rng, 0, size - 1);
  const route: CellPosition[] = [{ row: entryRow, col: 0 }];
  const visited = new Set([cellKey(route[0])]);
  let row = entryRow;

  for (let col = 0; col < size - 1; col += 1) {
    const verticalSteps = size === 3 ? randomInt(rng, 0, 1) : randomInt(rng, 0, 3);

    for (let step = 0; step < verticalSteps; step += 1) {
      const candidates = [
        { row: row - 1, col },
        { row: row + 1, col },
      ].filter((cell) => cell.row >= 0 && cell.row < size && !visited.has(cellKey(cell)));

      if (candidates.length === 0 || rng() < 0.25) break;

      const next = pickOne(rng, candidates);
      route.push(next);
      visited.add(cellKey(next));
      row = next.row;
    }

    const next = { row, col: col + 1 };
    route.push(next);
    visited.add(cellKey(next));
  }

  if (size > 3) {
    const finalCol = size - 1;
    const finalSteps = randomInt(rng, 0, 2);

    for (let step = 0; step < finalSteps; step += 1) {
      const candidates = [
        { row: row - 1, col: finalCol },
        { row: row + 1, col: finalCol },
      ].filter((cell) => cell.row >= 0 && cell.row < size && !visited.has(cellKey(cell)));

      if (candidates.length === 0 || rng() < 0.35) break;

      const next = pickOne(rng, candidates);
      route.push(next);
      visited.add(cellKey(next));
      row = next.row;
    }
  }

  return route;
}

function makeRouteBoard(size: PathGridSize, route: CellPosition[]) {
  const board = emptyBoard(size);
  const routeKeys = new Set<string>();

  route.forEach((cell, index) => {
    const next = route[index + 1];
    routeKeys.add(cellKey(cell));
    board[cell.row][cell.col] = {
      type: "path",
      direction: next ? directionBetween(cell, next) : "right",
    };
  });

  return { board, routeKeys };
}

function addDecoys(board: Board, routeKeys: Set<string>, rng: () => number) {
  const size = board.length as PathGridSize;
  const decoyBoard = cloneBoard(board);
  const directions: PathDirection[] = ["up", "right", "down", "left"];
  const routeCells = [...routeKeys].map((key) => {
    const [row, col] = key.split("-").map(Number);
    return { row, col };
  });
  const baseChance = size === 3 ? 0.12 : size === 6 ? 0.2 : 0.26;

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const key = `${row}-${col}`;
      const nearRoute = routeCells.some(
        (routeCell) => Math.abs(routeCell.row - row) + Math.abs(routeCell.col - col) === 1
      );
      const decoyChance = nearRoute ? Math.max(baseChance, 0.34) : baseChance;

      if (!routeKeys.has(key) && rng() < decoyChance) {
        decoyBoard[row][col] = {
          type: "path",
          direction: pickOne(rng, directions),
        };
      }
    }
  }

  return decoyBoard;
}

function collectEditableBlocks(board: Board) {
  const blocks = new Set<string>();

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell.type === "path") {
        blocks.add(blockKey({
          row: Math.floor(rowIndex / BLOCK_SIZE),
          col: Math.floor(colIndex / BLOCK_SIZE),
        }));
      }
    });
  });

  return blocks;
}

function isInside(row: number, col: number, size: number) {
  return row >= 0 && col >= 0 && row < size && col < size;
}

function validateBoard(board: Board, entryRow: number, exitRow: number): ValidationResult {
  const size = board.length;
  let row = entryRow;
  let col = 0;
  const visited = new Set<string>();
  const tracedPath: CellPosition[] = [];

  for (let steps = 0; steps <= size * size; steps += 1) {
    const cell = board[row]?.[col];

    if (!cell || cell.type === "empty") {
      return { ok: false, reason: "Path broken", visited: tracedPath };
    }

    const key = `${row}-${col}`;
    if (visited.has(key)) {
      return { ok: false, reason: "Loop detected", visited: tracedPath };
    }

    visited.add(key);
    tracedPath.push({ row, col });

    const delta = DELTAS[cell.direction];
    const nextRow = row + delta.row;
    const nextCol = col + delta.col;

    if (!isInside(nextRow, nextCol, size)) {
      const solved = row === exitRow && col === size - 1 && cell.direction === "right";
      return {
        ok: solved,
        reason: solved ? "Route solved" : "Wrong exit",
        visited: tracedPath,
      };
    }

    row = nextRow;
    col = nextCol;
  }

  return { ok: false, reason: "Loop detected", visited: tracedPath };
}

function boardsMatch(left: Board, right: Board) {
  return left.every((row, rowIndex) =>
    row.every((cell, colIndex) => {
      const other = right[rowIndex][colIndex];
      return cell.type === other.type &&
        (cell.type === "empty" || (other.type === "path" && cell.direction === other.direction));
    })
  );
}

function applyBlockMoves(
  source: Board,
  block: SelectedBlock,
  rotations: number,
  directionShifts: number
) {
  let board = source;

  for (let index = 0; index < rotations; index += 1) {
    board = rotateBlock(board, block);
  }

  for (let index = 0; index < directionShifts; index += 1) {
    board = shiftBlockDirections(board, block);
  }

  return board;
}

function scrambleBoard(solved: Board, rng: () => number) {
  let board = cloneBoard(solved);
  const blockCount = getBlockCount(board.length);
  const moves: BlockScramble[] = [];

  for (let blockRow = 0; blockRow < blockCount; blockRow += 1) {
    for (let blockCol = 0; blockCol < blockCount; blockCol += 1) {
      const block = { row: blockRow, col: blockCol };
      const hasPath = getBlock(board, block).flat().some((cell) => cell.type === "path");
      if (!hasPath) continue;

      const rotations = randomInt(rng, 0, 3);
      let directionShifts = randomInt(rng, 0, 3);

      if (rotations === 0 && directionShifts === 0) {
        directionShifts = 1;
      }

      board = applyBlockMoves(board, block, rotations, directionShifts);
      moves.push({ block, rotations, directionShifts });
    }
  }

  return { board, moves };
}

function recoverScrambledBoard(scrambled: Board, moves: BlockScramble[]) {
  return moves.reduceRight((board, move) => {
    const inverseRotations = (4 - move.rotations) % 4;
    const inverseDirectionShifts = (4 - move.directionShifts) % 4;
    return applyBlockMoves(board, move.block, inverseRotations, inverseDirectionShifts);
  }, cloneBoard(scrambled));
}

function generatePuzzle(size: PathGridSize, round: number, seed = makeSeed()): Puzzle {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const puzzleSeed = seed + attempt * 9_973;
    const rng = createRng(puzzleSeed);
    const route = makeRoute(size, rng);
    const { board: routeBoard, routeKeys } = makeRouteBoard(size, route);
    const solved = addDecoys(routeBoard, routeKeys, rng);
    const entryRow = route[0].row;
    const exitRow = route[route.length - 1].row;

    if (!validateBoard(solved, entryRow, exitRow).ok) continue;

    const scrambled = scrambleBoard(solved, rng);
    const recovered = recoverScrambledBoard(scrambled.board, scrambled.moves);

    // A puzzle is published only when the exact visible controls can restore it.
    if (!boardsMatch(recovered, solved)) continue;
    if (!validateBoard(recovered, entryRow, exitRow).ok) continue;
    if (validateBoard(scrambled.board, entryRow, exitRow).ok) continue;

    return {
      board: scrambled.board,
      entryRow,
      exitRow,
      editableBlocks: collectEditableBlocks(solved),
      timeLimit: getTimeLimit(size),
      title: `Round ${round} (${size}x${size})`,
      seed: puzzleSeed,
    };
  }

  const fallbackSeed = seed + 800_001;
  const entryRow = Math.floor(size / 2);
  const route = Array.from({ length: size }, (_, col) => ({ row: entryRow, col }));
  const { board: solved } = makeRouteBoard(size, route);
  const fallbackRng = createRng(fallbackSeed);
  const scrambled = scrambleBoard(solved, fallbackRng);
  const recovered = recoverScrambledBoard(scrambled.board, scrambled.moves);

  return {
    board: boardsMatch(recovered, solved) ? scrambled.board : shiftBlockDirections(solved, { row: Math.floor(entryRow / 3), col: 0 }),
    entryRow,
    exitRow: entryRow,
    editableBlocks: collectEditableBlocks(solved),
    timeLimit: getTimeLimit(size),
    title: `Round ${round} (${size}x${size})`,
    seed: fallbackSeed,
  };
}

function applyPuzzle(source: GameState, puzzle: Puzzle, gridSize: PathGridSize, round: number): GameState {
  return {
    ...source,
    phase: "playing",
    gridSize,
    level: round,
    highestLevel: Math.max(source.highestLevel, round),
    board: puzzle.board,
    selectedBlock: null,
    entryRow: puzzle.entryRow,
    exitRow: puzzle.exitRow,
    editableBlocks: puzzle.editableBlocks,
    message: "Select a 3x3 block to begin.",
    attempts: 0,
    moves: 0,
    timeLeft: puzzle.timeLimit,
    timeLimit: puzzle.timeLimit,
    levelTitle: puzzle.title,
    puzzleSeed: puzzle.seed,
    tracedPath: [],
    rocketStep: -1,
  };
}

// Games auto-start on mount — no separate "start" phase or button. This
// module is dynamically imported with ssr: false (see GameMount.tsx), so
// there is no server-rendered markup to hydrate against and a randomly
// seeded puzzle here is safe from the first render.
function initialState(): GameState {
  const puzzle = generatePuzzle(DEFAULT_GRID_SIZE, 1);

  return {
    phase: "playing",
    gridSize: DEFAULT_GRID_SIZE,
    level: 1,
    score: 0,
    streak: 0,
    highestLevel: 1,
    board: puzzle.board,
    selectedBlock: null,
    entryRow: puzzle.entryRow,
    exitRow: puzzle.exitRow,
    editableBlocks: puzzle.editableBlocks,
    message: "Select a 3x3 block to begin.",
    attempts: 0,
    moves: 0,
    timeLeft: puzzle.timeLimit,
    timeLimit: puzzle.timeLimit,
    levelTitle: puzzle.title,
    puzzleSeed: puzzle.seed,
    tracedPath: [],
    rocketStep: -1,
  };
}

export default function PathFinderGame() {
  const [state, setState] = useState<GameState>(initialState);

  // Persists the finished run to the leaderboard exactly once.
  // Shared with every other game — see src/games/hooks/useGameSession.ts.
  useGameSession({ gameSlug: "path-finder", score: state.score, finished: state.phase === "results" });
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedBlockIsEditable = useMemo(() => {
    if (!state.selectedBlock) return false;
    return state.editableBlocks.has(blockKey(state.selectedBlock));
  }, [state.editableBlocks, state.selectedBlock]);

  const startPuzzle = useCallback((
    gridSize: PathGridSize,
    round: number,
    source: GameState,
    seed = makeSeed()
  ) => {
    return applyPuzzle(source, generatePuzzle(gridSize, round, seed), gridSize, round);
  }, []);

  useEffect(() => {
    if (state.phase !== "playing") return;

    const timer = setTimeout(() => {
      setState((current) => {
        if (current.phase !== "playing") return current;

        if (current.timeLeft <= 1) {
          return {
            ...current,
            phase: "failed",
            streak: 0,
            message: "Time up",
            timeLeft: 0,
            tracedPath: [],
            rocketStep: -1,
          };
        }

        return {
          ...current,
          timeLeft: current.timeLeft - 1,
        };
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [state.phase, state.timeLeft]);

  useEffect(() => {
    if (state.phase !== "animating" || state.tracedPath.length === 0) return;

    if (state.rocketStep >= state.tracedPath.length - 1) {
      const nextRound = state.level + 1;

      if (transitionRef.current) clearTimeout(transitionRef.current);
      transitionRef.current = setTimeout(() => {
        setState((latest) => startPuzzle(latest.gridSize, nextRound, latest));
      }, 450);
      return;
    }

    const animation = setTimeout(() => {
      setState((current) => ({
        ...current,
        rocketStep: current.phase === "animating" ? current.rocketStep + 1 : current.rocketStep,
      }));
    }, 130);

    return () => clearTimeout(animation);
  }, [startPuzzle, state.gridSize, state.level, state.phase, state.rocketStep, state.tracedPath.length]);

  useEffect(() => {
    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, []);

  const handleSelectSize = useCallback((gridSize: PathGridSize) => {
    if (transitionRef.current) clearTimeout(transitionRef.current);

    const base = initialState();
    setState(startPuzzle(gridSize, 1, { ...base, gridSize }));
  }, [startPuzzle]);

  const handleSelectCell = useCallback((row: number, col: number) => {
    setState((current) => {
      if (current.phase !== "playing") return current;

      const selectedBlock = {
        row: Math.floor(row / BLOCK_SIZE),
        col: Math.floor(col / BLOCK_SIZE),
      };

      return {
        ...current,
        selectedBlock,
        message: "Rotate the block or change its arrow directions.",
      };
    });
  }, []);

  const handleRotate = useCallback(() => {
    setState((current) => {
      if (current.phase !== "playing" || !current.selectedBlock) return current;

      return {
        ...current,
        board: rotateBlock(current.board, current.selectedBlock),
        moves: current.moves + 1,
        tracedPath: [],
        rocketStep: -1,
        message: "Block rotated.",
      };
    });
  }, []);

  const handleChangeDirection = useCallback(() => {
    setState((current) => {
      if (current.phase !== "playing" || !current.selectedBlock) return current;

      return {
        ...current,
        board: shiftBlockDirections(current.board, current.selectedBlock),
        moves: current.moves + 1,
        tracedPath: [],
        rocketStep: -1,
        message: "Arrow directions changed.",
      };
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setState((current) => {
      if (current.phase !== "playing") return current;

      const result = validateBoard(current.board, current.entryRow, current.exitRow);
      const attempts = current.attempts + 1;

      if (!result.ok) {
        return {
          ...current,
          phase: "failed",
          attempts,
          streak: 0,
          score: Math.max(0, current.score - 5),
          message: result.reason,
          tracedPath: result.visited,
          rocketStep: -1,
        };
      }

      const streak = current.streak + 1;
      const timeBonus = Math.ceil(current.timeLeft / 3);
      const movePenalty = Math.min(25, current.moves);

      return {
        ...current,
        phase: "animating",
        attempts,
        score: current.score + SOLVE_BONUS + timeBonus + streak * STREAK_BONUS - movePenalty,
        streak,
        highestLevel: Math.max(current.highestLevel, current.level + 1),
        message: "Route solved. Launching rocket...",
        tracedPath: result.visited,
        rocketStep: 0,
      };
    });
  }, []);

  const handleRetry = useCallback(() => {
    setState((current) => {
      if (current.message === "Time up") {
        return {
          ...current,
          phase: "playing",
          timeLeft: Math.ceil(current.timeLimit / 2),
          message: "Extra time added. Keep editing this puzzle.",
          rocketStep: -1,
        };
      }

      return {
        ...current,
        phase: "playing",
        message: "Keep editing the grid and validate again.",
        rocketStep: -1,
      };
    });
  }, []);

  const handleResetLevel = useCallback(() => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setState((current) => startPuzzle(current.gridSize, current.level, current));
  }, [startPuzzle]);

  const handleRestart = useCallback(() => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setState(initialState());
  }, []);

  return (
    <PathFinderUI
      phase={state.phase}
      gridSize={state.gridSize}
      level={state.level}
      score={state.score}
      streak={state.streak}
      highestLevel={state.highestLevel}
      board={state.board}
      selectedBlock={state.selectedBlock}
      selectedBlockIsEditable={selectedBlockIsEditable}
      entryRow={state.entryRow}
      exitRow={state.exitRow}
      levelTitle={state.levelTitle}
      message={state.message}
      attempts={state.attempts}
      moves={state.moves}
      timeLeft={state.timeLeft}
      timeLimit={state.timeLimit}
      tracedPath={state.tracedPath}
      rocketStep={state.rocketStep}
      onSelectSize={handleSelectSize}
      onSelectCell={handleSelectCell}
      onRotate={handleRotate}
      onChangeDirection={handleChangeDirection}
      onConfirm={handleConfirm}
      onRetry={handleRetry}
      onResetLevel={handleResetLevel}
      onRestart={handleRestart}
    />
  );
}

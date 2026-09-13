"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import KeyDoorUI from "./ui";
import { useGameSession } from "@/games/hooks/useGameSession";

export type Direction = "up" | "down" | "left" | "right";
export type KeyDoorPhase = "playing" | "locked" | "level-complete" | "results";
export type GameMode = "practice" | "assessment";

export type Cell = {
  row: number;
  col: number;
};

export type EdgeState = "open" | "locked";

export type DirectedEdge = {
  from: Cell;
  to: Cell;
  state: EdgeState;
};

export type LevelDefinition = {
  size: number;
  start: Cell;
  keys: Cell[];
  exit: Cell;
  edges: DirectedEdge[];
  solution: Cell[];
};

export type KeyGoal = 1 | 2;

type GameState = {
  phase: KeyDoorPhase;
  mode: GameMode;
  level: number;
  score: number;
  streak: number;
  highestLevel: number;
  position: Cell;
  hasKey: boolean;
  keyGoal: KeyGoal;
  collectedKeys: string[];
  message: string;
  failedCell: Cell | null;
  attemptedCell: Cell | null;
  showSolution: boolean;
  elapsedSeconds: number;
};

const MAX_LEVEL = 5;
const LEVEL_BONUS = 40;
const KEY_BONUS = 15;
const STEP_PENALTY = 1;
const LOCK_DELAY_MS = 650;
const COMPLETE_DELAY_MS = 900;

const DIRS: Record<Direction, Cell> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

const LEVELS: LevelDefinition[] = [
  makeLevel(3, { row: 1, col: 1 }, [{ row: 0, col: 1 }, { row: 1, col: 0 }], { row: 2, col: 0 }, [
    [1, 1], [0, 1], [0, 0], [1, 0], [2, 0],
  ], [
    [[1, 1], [1, 2]], [[1, 2], [2, 2]], [[2, 2], [2, 1]],
  ]),
  makeLevel(3, { row: 1, col: 1 }, [{ row: 0, col: 2 }, { row: 0, col: 0 }], { row: 2, col: 0 }, [
    [1, 1], [1, 2], [0, 2], [0, 1], [0, 0], [1, 0], [2, 0],
  ], [
    [[1, 1], [0, 1]], [[1, 2], [2, 2]], [[0, 1], [1, 1]], [[1, 0], [1, 1]],
  ]),
  makeLevel(4, { row: 2, col: 1 }, [{ row: 0, col: 2 }, { row: 2, col: 2 }], { row: 3, col: 0 }, [
    [2, 1], [1, 1], [1, 2], [0, 2], [0, 3], [1, 3], [2, 3], [2, 2], [3, 2], [3, 1], [3, 0],
  ], [
    [[2, 1], [2, 0]], [[1, 1], [0, 1]], [[1, 2], [2, 2]], [[0, 3], [0, 2]], [[2, 2], [2, 1]], [[3, 1], [2, 1]],
  ]),
  makeLevel(4, { row: 2, col: 1 }, [{ row: 0, col: 0 }, { row: 1, col: 3 }], { row: 3, col: 3 }, [
    [2, 1], [2, 0], [1, 0], [0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [1, 2], [1, 3], [2, 3], [3, 3],
  ], [
    [[2, 1], [3, 1]], [[2, 0], [2, 1]], [[1, 1], [1, 2]], [[2, 2], [2, 1]], [[1, 3], [0, 3]], [[2, 3], [2, 2]],
  ]),
  makeLevel(5, { row: 2, col: 2 }, [{ row: 0, col: 4 }, { row: 2, col: 0 }], { row: 4, col: 0 }, [
    [2, 2], [2, 3], [1, 3], [1, 4], [0, 4], [0, 3], [0, 2], [1, 2], [2, 2],
    [3, 2], [3, 1], [2, 1], [2, 0], [3, 0], [4, 0],
  ], [
    [[2, 2], [1, 2]], [[2, 3], [2, 4]], [[1, 3], [0, 3]], [[0, 3], [0, 4]], [[3, 2], [4, 2]],
    [[3, 1], [3, 2]], [[2, 1], [1, 1]], [[2, 0], [1, 0]], [[3, 0], [3, 1]], [[4, 1], [4, 0]],
  ]),
];

function makeCell(row: number, col: number): Cell {
  return { row, col };
}

function makeLevel(
  size: number,
  start: Cell,
  keys: Cell[],
  exit: Cell,
  route: number[][],
  traps: number[][][]
): LevelDefinition {
  const edges: DirectedEdge[] = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      for (const delta of Object.values(DIRS)) {
        const to = makeCell(row + delta.row, col + delta.col);
        if (isInside(to, size)) {
          edges.push({ from: makeCell(row, col), to, state: "locked" });
        }
      }
    }
  }

  route.forEach((point, index) => {
    const next = route[index + 1];
    if (!next) return;
    openEdge(edges, makeCell(point[0], point[1]), makeCell(next[0], next[1]));
  });

  traps.forEach(([from, to]) => openEdge(edges, makeCell(from[0], from[1]), makeCell(to[0], to[1])));

  const level = {
    size,
    start,
    keys,
    exit,
    edges,
    solution: route.map(([row, col]) => makeCell(row, col)),
  };

  if (!hasValidSolution(level)) {
    throw new Error("Key & Door level does not contain START -> KEYS -> EXIT");
  }

  return level;
}

function openEdge(edges: DirectedEdge[], from: Cell, to: Cell) {
  const edge = edges.find((item) => sameCell(item.from, from) && sameCell(item.to, to));
  if (edge) edge.state = "open";
}

function sameCell(a: Cell, b: Cell) {
  return a.row === b.row && a.col === b.col;
}

function isInside(cell: Cell, size: number) {
  return cell.row >= 0 && cell.col >= 0 && cell.row < size && cell.col < size;
}

function edgeKey(from: Cell, to: Cell) {
  return `${from.row},${from.col}->${to.row},${to.col}`;
}

function cellKey(cell: Cell) {
  return `${cell.row},${cell.col}`;
}

function getNextCell(cell: Cell, direction: Direction) {
  const delta = DIRS[direction];
  return makeCell(cell.row + delta.row, cell.col + delta.col);
}

function hasValidSolution(level: LevelDefinition) {
  const checkpoints = [level.start, ...level.keys, level.exit];
  return checkpoints.every((checkpoint, index) => {
    const next = checkpoints[index + 1];
    return !next || canReach(level, checkpoint, next);
  });
}

function canReach(level: LevelDefinition, from: Cell, target: Cell) {
  const queue = [from];
  const seen = new Set([`${from.row},${from.col}`]);

  while (queue.length) {
    const cell = queue.shift();
    if (!cell) continue;
    if (sameCell(cell, target)) return true;

    level.edges
      .filter((edge) => edge.state === "open" && sameCell(edge.from, cell))
      .forEach((edge) => {
        const key = `${edge.to.row},${edge.to.col}`;
        if (!seen.has(key)) {
          seen.add(key);
          queue.push(edge.to);
        }
      });
  }

  return false;
}

function getMode() {
  if (typeof window === "undefined") return "practice";
  return new URLSearchParams(window.location.search).get("mode") === "assessment"
    ? "assessment"
    : "practice";
}

// Games auto-start on mount — no separate "start" phase or button. The
// initial state below is deliberately identical to what startLevel(1, ...)
// would produce for a fresh run.
function initialState(mode: GameMode = "practice", keyGoal: KeyGoal = 1): GameState {
  const level = LEVELS[0];

  return {
    phase: "playing",
    mode,
    level: 1,
    score: 0,
    streak: 0,
    highestLevel: 1,
    position: level.start,
    hasKey: false,
    keyGoal,
    collectedKeys: [],
    message: keyGoal === 1 ? "Find the key, then reach the exit." : "Find both keys, then reach the exit.",
    failedCell: null,
    attemptedCell: null,
    showSolution: false,
    elapsedSeconds: 0,
  };
}

export default function KeyDoorGame() {
  const [state, setState] = useState<GameState>(() => initialState(getMode()));

  // Persists the finished run to the leaderboard exactly once.
  // Shared with every other game — see src/games/hooks/useGameSession.ts.
  useGameSession({ gameSlug: "key-and-door", score: state.score, finished: state.phase === "results" });
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentLevel = LEVELS[state.level - 1] ?? LEVELS[0];

  const openEdges = useMemo(() => {
    return new Set(currentLevel.edges.filter((edge) => edge.state === "open").map((edge) => edgeKey(edge.from, edge.to)));
  }, [currentLevel]);

  const activeKeys = currentLevel.keys.slice(0, state.keyGoal);
  const keysLeft = activeKeys.filter((key) => !state.collectedKeys.includes(cellKey(key))).length;

  useEffect(() => {
    if (state.phase !== "playing") return;
    const timer = setInterval(() => {
      setState((current) => ({
        ...current,
        elapsedSeconds: current.phase === "playing" ? current.elapsedSeconds + 1 : current.elapsedSeconds,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [state.phase]);

  useEffect(() => {
    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, []);

  const startLevel = useCallback((levelNumber: number, source: GameState) => {
    const level = LEVELS[levelNumber - 1] ?? LEVELS[0];

    return {
      ...source,
      phase: "playing" as const,
      level: levelNumber,
      highestLevel: Math.max(source.highestLevel, levelNumber),
      position: level.start,
      hasKey: false,
      collectedKeys: [],
      message: source.keyGoal === 1 ? "Find the key, then reach the exit." : "Find both keys, then reach the exit.",
      failedCell: null,
      attemptedCell: null,
      showSolution: false,
    };
  }, []);

  const handleMove = useCallback((direction: Direction) => {
    setState((current) => {
      if (current.phase !== "playing") return current;

      const level = LEVELS[current.level - 1];
      const attemptedCell = getNextCell(current.position, direction);
      const canMove = isInside(attemptedCell, level.size) && level.edges.some((edge) =>
        edge.state === "open" && sameCell(edge.from, current.position) && sameCell(edge.to, attemptedCell)
      );

      if (!canMove) {
        if (transitionRef.current) clearTimeout(transitionRef.current);
        transitionRef.current = setTimeout(() => {
          setState((latest) => startLevel(latest.level, latest));
        }, LOCK_DELAY_MS);

        return {
          ...current,
          phase: "locked",
          streak: 0,
          score: Math.max(0, current.score - 8),
          hasKey: false,
          collectedKeys: [],
          message: "Door locked in this direction!",
          failedCell: current.position,
          attemptedCell: isInside(attemptedCell, level.size) ? attemptedCell : current.position,
        };
      }

      const activeLevelKeys = level.keys.slice(0, current.keyGoal);
      const attemptedKey = activeLevelKeys.find((key) => sameCell(attemptedCell, key));
      const attemptedKeyId = attemptedKey ? cellKey(attemptedKey) : null;
      const collectedKey = attemptedKeyId !== null && !current.collectedKeys.includes(attemptedKeyId);
      const collectedKeys = collectedKey ? [...current.collectedKeys, attemptedKeyId] : current.collectedKeys;
      const keysLeft = activeLevelKeys.length - collectedKeys.length;
      const reachedExit = sameCell(attemptedCell, level.exit);
      const hasKey = keysLeft === 0;

      if (reachedExit && !hasKey) {
        return {
          ...current,
          position: attemptedCell,
          score: Math.max(0, current.score - STEP_PENALTY),
          message: keysLeft === 1 ? "The door is locked. Find 1 more key." : `The door is locked. Find ${keysLeft} more keys.`,
        };
      }

      if (reachedExit && hasKey) {
        const nextLevel = current.level + 1;
        if (transitionRef.current) clearTimeout(transitionRef.current);
        transitionRef.current = setTimeout(() => {
          setState((latest) => {
            if (nextLevel > MAX_LEVEL) {
              return { ...latest, phase: "results" };
            }
            return startLevel(nextLevel, latest);
          });
        }, COMPLETE_DELAY_MS);

        const streak = current.streak + 1;

        return {
          ...current,
          phase: "level-complete",
          position: attemptedCell,
          hasKey,
          collectedKeys,
          score: current.score + LEVEL_BONUS + current.level * 10,
          streak,
          highestLevel: Math.max(current.highestLevel, nextLevel),
          message: nextLevel > MAX_LEVEL ? "All locks cleared!" : "Level complete!",
        };
      }

      return {
        ...current,
        position: attemptedCell,
        hasKey,
        collectedKeys,
        score: Math.max(0, current.score + (collectedKey ? KEY_BONUS : 0) - STEP_PENALTY),
        message: collectedKey
          ? keysLeft === 0
            ? "All keys collected! Head to the door."
            : `${keysLeft} key left.`
          : "Keep going.",
      };
    });
  }, [startLevel]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const directionByKey: Partial<Record<string, Direction>> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const direction = directionByKey[event.key];
      if (!direction) return;
      event.preventDefault();
      handleMove(direction);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleMove]);

  const handleReset = useCallback(() => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setState((current) => initialState(getMode(), current.keyGoal));
  }, []);

  const handleKeyGoalChange = useCallback((keyGoal: KeyGoal) => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setState((current) => startLevel(1, { ...initialState(getMode(), keyGoal), highestLevel: current.highestLevel }));
  }, [startLevel]);

  const handleToggleSolution = useCallback(() => {
    setState((current) => {
      if (current.mode === "assessment") return current;
      return { ...current, showSolution: !current.showSolution };
    });
  }, []);

  return (
    <KeyDoorUI
      phase={state.phase}
      mode={state.mode}
      level={state.level}
      score={state.score}
      streak={state.streak}
      highestLevel={state.highestLevel}
      elapsedSeconds={state.elapsedSeconds}
      levelData={currentLevel}
      activeKeys={activeKeys}
      position={state.position}
      hasKey={state.hasKey}
      keyGoal={state.keyGoal}
      keysLeft={keysLeft}
      collectedKeys={state.collectedKeys}
      message={state.message}
      failedCell={state.failedCell}
      attemptedCell={state.attemptedCell}
      showSolution={state.showSolution}
      openEdges={openEdges}
      onMove={handleMove}
      onReset={handleReset}
      onKeyGoalChange={handleKeyGoalChange}
      onToggleSolution={handleToggleSolution}
    />
  );
}

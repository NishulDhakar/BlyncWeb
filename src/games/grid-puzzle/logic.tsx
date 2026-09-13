"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GridChallangeUi from "./ui";
import { useGameSession } from "@/games/hooks/useGameSession";

export type GridPhase = "blinking" | "symmetry" | "recall" | "results";

export type GridDot = {
  id: number;
  x: number;
  y: number;
};

export type SymmetryChallenge = {
  gridA: boolean[][];
  gridB: boolean[][];
  isSymmetric: boolean;
  label: string;
};

type LevelConfig = {
  totalDots: number;
  dotsToRemember: number;
  gridSize: number;
  blinkDurationMs: number;
  symmetryTimeSec: number;
};

type GameState = {
  phase: GridPhase;
  level: number;
  lives: number;
  score: number;
  dots: GridDot[];
  memoryDotIds: number[];
  blinkDotId: number | null;
  currentDotIndex: number;
  dotsToRemember: number;
  symmetryChallenge: SymmetryChallenge | null;
  symmetryTimeLeft: number;
  symmetryTimeMax: number;
  symmetryAnswered: boolean;
  lastSymmetryCorrect: boolean | null;
  recallClicks: number[];
  recallShake: boolean;
  symCorrect: number;
  symWrong: number;
  streak: number;
  highestLevel: number;
};

const MAX_LIVES = 3;
const DOT_COLUMNS = 7;
const DOT_ROWS = 4;

function getLevelConfig(level: number): LevelConfig {
  const stage = Math.floor((level - 1) / 2);

  return {
    totalDots: Math.min(DOT_COLUMNS * DOT_ROWS, 10 + stage * 2),
    dotsToRemember: Math.min(8, 3 + stage),
    gridSize: Math.min(5, 3 + Math.floor((level - 1) / 4)),
    blinkDurationMs: Math.max(800, 2000 - (level - 1) * 120),
    symmetryTimeSec: Math.max(3, 5 - Math.floor((level - 1) / 4)),
  };
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function generateDots(totalDots: number): GridDot[] {
  const slots = Array.from({ length: DOT_COLUMNS * DOT_ROWS }, (_, id) => ({
    id,
    x: 10 + (id % DOT_COLUMNS) * (80 / (DOT_COLUMNS - 1)),
    y: 14 + Math.floor(id / DOT_COLUMNS) * (72 / (DOT_ROWS - 1)),
  }));

  return shuffle(slots).slice(0, totalDots).map((dot) => ({
    id: dot.id,
    x: dot.x + (Math.random() * 3 - 1.5),
    y: dot.y + (Math.random() * 3 - 1.5),
  })).sort((a, b) => a.id - b.id || a.x - b.x);
}

function mirrorGrid(grid: boolean[][]) {
  return grid.map((row) => [...row].reverse());
}

function generateSymmetryChallenge(size: number): SymmetryChallenge {
  const gridA = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.random() > 0.62)
  );
  const isSymmetric = Math.random() > 0.5;
  const gridB = mirrorGrid(gridA);

  if (!isSymmetric) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    gridB[row][col] = !gridB[row][col];
  }

  return {
    gridA,
    gridB,
    isSymmetric,
    label: "Compare the right pattern as a mirror of the left pattern.",
  };
}

function makeLevel(level: number) {
  const config = getLevelConfig(level);
  const dots = generateDots(config.totalDots);
  const memoryDotIds = shuffle(dots).slice(0, config.dotsToRemember).map((dot) => dot.id);

  return { config, dots, memoryDotIds };
}

// Games auto-start on mount — no separate "start" phase or button. The
// initial state below is deliberately identical to what startLevel(1, ...)
// would produce for a fresh run.
function initialState(): GameState {
  const { config, dots, memoryDotIds } = makeLevel(1);

  return {
    phase: "blinking",
    level: 1,
    lives: MAX_LIVES,
    score: 0,
    dots,
    memoryDotIds,
    blinkDotId: memoryDotIds[0] ?? null,
    currentDotIndex: 0,
    dotsToRemember: config.dotsToRemember,
    symmetryChallenge: null,
    symmetryTimeLeft: config.symmetryTimeSec,
    symmetryTimeMax: config.symmetryTimeSec,
    symmetryAnswered: false,
    lastSymmetryCorrect: null,
    recallClicks: [],
    recallShake: false,
    symCorrect: 0,
    symWrong: 0,
    streak: 0,
    highestLevel: 1,
  };
}

export default function GridGame() {
  const [state, setState] = useState<GameState>(initialState);

  // Persists the finished run to the leaderboard exactly once.
  // Shared with every other game — see src/games/hooks/useGameSession.ts.
  useGameSession({ gameSlug: "grid-puzzle", score: state.score, finished: state.phase === "results" });
  const levelAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recallResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (levelAdvanceRef.current) clearTimeout(levelAdvanceRef.current);
      if (recallResetRef.current) clearTimeout(recallResetRef.current);
    };
  }, []);

  useEffect(() => {
    if (state.phase !== "blinking") return;

    const config = getLevelConfig(state.level);
    const timer = setTimeout(() => {
      setState((current) => ({
        ...current,
        phase: "symmetry",
        symmetryChallenge: generateSymmetryChallenge(config.gridSize),
        symmetryTimeLeft: config.symmetryTimeSec,
        symmetryTimeMax: config.symmetryTimeSec,
        symmetryAnswered: false,
        lastSymmetryCorrect: null,
      }));
    }, config.blinkDurationMs);

    return () => clearTimeout(timer);
  }, [state.phase, state.level, state.currentDotIndex]);

  useEffect(() => {
    if (state.phase !== "symmetry" || state.symmetryAnswered) return;

    const timer = setTimeout(() => {
      setState((current) => {
        if (current.symmetryTimeLeft <= 0) {
          return {
            ...current,
            symmetryAnswered: true,
            lastSymmetryCorrect: null,
          };
        }

        return {
          ...current,
          symmetryTimeLeft: Math.max(0, current.symmetryTimeLeft - 1),
        };
      });
    }, state.symmetryTimeLeft <= 0 ? 0 : 1000);

    return () => clearTimeout(timer);
  }, [state.phase, state.symmetryAnswered, state.symmetryTimeLeft]);

  useEffect(() => {
    if (state.phase !== "symmetry" || !state.symmetryAnswered) return;

    const timer = setTimeout(() => {
      setState((current) => {
        const nextIndex = current.currentDotIndex + 1;

        if (nextIndex >= current.dotsToRemember) {
          return {
            ...current,
            phase: "recall",
            blinkDotId: null,
            currentDotIndex: nextIndex,
            recallClicks: [],
            recallShake: false,
          };
        }

        return {
          ...current,
          phase: "blinking",
          blinkDotId: current.memoryDotIds[nextIndex],
          currentDotIndex: nextIndex,
          symmetryChallenge: null,
          symmetryAnswered: false,
          lastSymmetryCorrect: null,
        };
      });
    }, state.lastSymmetryCorrect === null ? 250 : 650);

    return () => clearTimeout(timer);
  }, [state.phase, state.symmetryAnswered, state.lastSymmetryCorrect]);

  const startLevel = useCallback((level: number, baseState?: GameState) => {
    const { config, dots, memoryDotIds } = makeLevel(level);
    const source = baseState ?? initialState();

    return {
      ...source,
      phase: "blinking" as const,
      level,
      highestLevel: Math.max(source.highestLevel, level),
      dots,
      memoryDotIds,
      blinkDotId: memoryDotIds[0] ?? null,
      currentDotIndex: 0,
      dotsToRemember: config.dotsToRemember,
      symmetryChallenge: null,
      symmetryTimeLeft: config.symmetryTimeSec,
      symmetryTimeMax: config.symmetryTimeSec,
      symmetryAnswered: false,
      lastSymmetryCorrect: null,
      recallClicks: [],
      recallShake: false,
    };
  }, []);

  const handleAnswer = useCallback((isSymmetric: boolean) => {
    setState((current) => {
      if (
        current.phase !== "symmetry" ||
        current.symmetryAnswered ||
        !current.symmetryChallenge
      ) {
        return current;
      }

      const correct = isSymmetric === current.symmetryChallenge.isSymmetric;

      return {
        ...current,
        symmetryAnswered: true,
        lastSymmetryCorrect: correct,
        score: Math.max(0, current.score + (correct ? 3 : -1)),
        streak: correct ? current.streak + 1 : 0,
        symCorrect: correct ? current.symCorrect + 1 : current.symCorrect,
        symWrong: correct ? current.symWrong : current.symWrong + 1,
      };
    });
  }, []);

  const handleDotClick = useCallback(
    (dotId: number) => {
      setState((current) => {
        if (current.phase !== "recall" || current.recallShake) return current;

        const expectedDotId = current.memoryDotIds[current.recallClicks.length];

        if (dotId === expectedDotId) {
          const recallClicks = [...current.recallClicks, dotId];
          const levelComplete = recallClicks.length === current.dotsToRemember;
          const score = current.score + 10 + (levelComplete ? current.dotsToRemember * 5 : 0);

          if (levelComplete) {
            if (levelAdvanceRef.current) clearTimeout(levelAdvanceRef.current);
            levelAdvanceRef.current = setTimeout(() => {
              setState((latest) => startLevel(latest.level + 1, latest));
            }, 800);
          }

          return {
            ...current,
            recallClicks,
            score,
          };
        }

        const lives = current.lives - 1;

        if (recallResetRef.current) clearTimeout(recallResetRef.current);
        recallResetRef.current = setTimeout(() => {
          setState((latest) => ({
            ...latest,
            recallShake: false,
            recallClicks: lives > 0 ? [] : latest.recallClicks,
            phase: lives > 0 ? latest.phase : "results",
          }));
        }, 520);

        return {
          ...current,
          lives,
          score: Math.max(0, current.score - 5),
          streak: 0,
          recallShake: true,
        };
      });
    },
    [startLevel]
  );

  const handleReset = useCallback(() => {
    if (levelAdvanceRef.current) clearTimeout(levelAdvanceRef.current);
    if (recallResetRef.current) clearTimeout(recallResetRef.current);
    setState(initialState());
  }, []);

  return (
    <GridChallangeUi
      phase={state.phase}
      level={state.level}
      lives={state.lives}
      score={state.score}
      dots={state.dots}
      memoryDotIds={state.memoryDotIds}
      blinkDotId={state.blinkDotId}
      currentDotIndex={state.currentDotIndex}
      dotsToRemember={state.dotsToRemember}
      symmetryChallenge={state.symmetryChallenge}
      symmetryTimeLeft={state.symmetryTimeLeft}
      symmetryTimeMax={state.symmetryTimeMax}
      symmetryAnswered={state.symmetryAnswered}
      lastSymmetryCorrect={state.lastSymmetryCorrect}
      recallClicks={state.recallClicks}
      recallShake={state.recallShake}
      symCorrect={state.symCorrect}
      symWrong={state.symWrong}
      streak={state.streak}
      highestLevel={state.highestLevel}
      onAnswer={handleAnswer}
      onDotClick={handleDotClick}
      onReset={handleReset}
    />
  );
}

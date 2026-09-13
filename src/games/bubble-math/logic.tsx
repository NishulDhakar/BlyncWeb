"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BubbleMathUI from "./ui";
import { useGameSession } from "@/games/hooks/useGameSession";

export type BubbleOrder = "asc" | "desc";
export type BubblePhase = "playing" | "round-success" | "round-failed" | "results";

export type MathBubble = {
  id: number;
  expression: string;
  value: number;
  x: number;
  y: number;
  color: "gold" | "green" | "rose" | "blue" | "violet";
};

type LevelConfig = {
  bubbleCount: number;
  timeLimit: number;
  mode: "simple" | "multiply" | "decimal" | "hard";
};

type GameState = {
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
  timeLeft: number;
  timeLimit: number;
  failedReason: string;
};

const MAX_LIVES = 3;
const COLORS: MathBubble["color"][] = ["gold", "green", "rose", "blue", "violet"];
const POSITIONS = [
  { x: 22, y: 30 },
  { x: 50, y: 22 },
  { x: 77, y: 36 },
  { x: 34, y: 70 },
  { x: 66, y: 72 },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roundTo(value: number, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function formatValue(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function getLevelConfig(level: number): LevelConfig {
  if (level <= 2) {
    return { bubbleCount: 3, timeLimit: 18, mode: "simple" };
  }

  if (level <= 4) {
    return { bubbleCount: 3, timeLimit: 16, mode: "multiply" };
  }

  if (level <= 6) {
    return { bubbleCount: 4, timeLimit: 14, mode: "decimal" };
  }

  return {
    bubbleCount: Math.min(5, 4 + Math.floor((level - 7) / 3)),
    timeLimit: Math.max(7, 13 - Math.floor((level - 7) / 2)),
    mode: "hard",
  };
}

function makeExpression(level: number, mode: LevelConfig["mode"]) {
  if (mode === "simple") {
    const a = randomInt(2, 12 + level * 2);
    const b = randomInt(1, 9 + level);
    const add = Math.random() > 0.45;
    return {
      expression: add ? `${a} + ${b}` : `${a} - ${b}`,
      value: add ? a + b : a - b,
    };
  }

  if (mode === "multiply") {
    const operation = ["+", "-", "x", "÷"][randomInt(0, 3)];

    if (operation === "x") {
      const a = randomInt(3, 12);
      const b = randomInt(2, 9);
      return { expression: `${a} x ${b}`, value: a * b };
    }

    if (operation === "÷") {
      const b = randomInt(2, 9);
      const value = randomInt(2, 12);
      return { expression: `${b * value} ÷ ${b}`, value };
    }

    const a = randomInt(10, 40);
    const b = randomInt(4, 22);
    return {
      expression: operation === "+" ? `${a} + ${b}` : `${a} - ${b}`,
      value: operation === "+" ? a + b : a - b,
    };
  }

  if (mode === "decimal") {
    const operation = ["+", "-", "x", "÷"][randomInt(0, 3)];

    if (operation === "x") {
      const a = roundTo(randomInt(12, 45) / 10);
      const b = randomInt(2, 8);
      return { expression: `${formatValue(a)} x ${b}`, value: roundTo(a * b) };
    }

    if (operation === "÷") {
      const b = randomInt(2, 5);
      const value = roundTo(randomInt(12, 80) / 10);
      return { expression: `${formatValue(roundTo(value * b))} ÷ ${b}`, value };
    }

    const a = roundTo(randomInt(20, 120) / 10);
    const b = roundTo(randomInt(5, 65) / 10);
    return {
      expression: operation === "+" ? `${formatValue(a)} + ${formatValue(b)}` : `${formatValue(a)} - ${formatValue(b)}`,
      value: operation === "+" ? roundTo(a + b) : roundTo(a - b),
    };
  }

  const operation = ["+", "-", "x", "÷"][randomInt(0, 3)];
  const signA = Math.random() > 0.35 ? 1 : -1;
  const signB = Math.random() > 0.35 ? 1 : -1;

  if (operation === "x") {
    const a = roundTo((randomInt(15, 90) / 10) * signA);
    const b = randomInt(2, 9) * signB;
    return { expression: `${formatValue(a)} x ${b}`, value: roundTo(a * b) };
  }

  if (operation === "÷") {
    const b = randomInt(2, 8);
    const value = roundTo((randomInt(10, 120) / 10) * signA);
    return { expression: `${formatValue(roundTo(value * b))} ÷ ${b}`, value };
  }

  const a = roundTo((randomInt(10, 160) / 10) * signA);
  const b = roundTo((randomInt(5, 120) / 10) * signB);
  return {
    expression: operation === "+" ? `${formatValue(a)} + ${formatValue(b)}` : `${formatValue(a)} - ${formatValue(b)}`,
    value: operation === "+" ? roundTo(a + b) : roundTo(a - b),
  };
}

function generateRound(level: number) {
  const config = getLevelConfig(level);
  const order: BubbleOrder = Math.random() > 0.5 ? "asc" : "desc";
  const seenValues = new Set<number>();
  const bubbles: MathBubble[] = [];

  while (bubbles.length < config.bubbleCount) {
    const item = makeExpression(level, config.mode);

    if (seenValues.has(item.value)) continue;
    seenValues.add(item.value);

    const position = POSITIONS[bubbles.length];
    bubbles.push({
      id: level * 100 + bubbles.length,
      expression: item.expression,
      value: item.value,
      x: position.x + randomInt(-4, 4),
      y: position.y + randomInt(-4, 4),
      color: COLORS[bubbles.length],
    });
  }

  return {
    order,
    bubbles: bubbles.sort(() => Math.random() - 0.5),
    timeLeft: config.timeLimit,
    timeLimit: config.timeLimit,
  };
}

// Games auto-start on mount — no separate "start" phase or button. The
// initial state generates round 1 directly, identical to what
// startRound(1, ...) would produce for a fresh run.
function initialState(): GameState {
  return {
    phase: "playing",
    level: 1,
    lives: MAX_LIVES,
    score: 0,
    streak: 0,
    bestStreak: 0,
    highestLevel: 1,
    ...generateRound(1),
    selectedIds: [],
    failedReason: "",
  };
}

export default function BubbleMathGame() {
  const [state, setState] = useState<GameState>(initialState);

  // Persists the finished run to the leaderboard exactly once.
  // Shared with every other game — see src/games/hooks/useGameSession.ts.
  useGameSession({ gameSlug: "bubble-math", score: state.score, finished: state.phase === "results" });
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const expectedIds = useMemo(() => {
    return [...state.bubbles]
      .sort((a, b) => state.order === "asc" ? a.value - b.value : b.value - a.value)
      .map((bubble) => bubble.id);
  }, [state.bubbles, state.order]);

  const startRound = useCallback((level: number, source: GameState) => {
    const round = generateRound(level);

    return {
      ...source,
      ...round,
      phase: "playing" as const,
      level,
      highestLevel: Math.max(source.highestLevel, level),
      selectedIds: [],
      failedReason: "",
    };
  }, []);

  const failRound = useCallback((reason: string) => {
    setState((current) => {
      if (current.phase !== "playing") return current;

      const lives = current.lives - 1;

      if (transitionRef.current) clearTimeout(transitionRef.current);
      transitionRef.current = setTimeout(() => {
        setState((latest) => {
          if (lives <= 0) return { ...latest, phase: "results" };
          return startRound(latest.level, { ...latest, lives });
        });
      }, 900);

      return {
        ...current,
        lives,
        streak: 0,
        phase: "round-failed",
        failedReason: reason,
      };
    });
  }, [startRound]);

  useEffect(() => {
    if (state.phase !== "playing") return;

    if (state.timeLeft <= 0) {
      failRound("Time up");
      return;
    }

    const timer = setTimeout(() => {
      setState((current) => ({
        ...current,
        timeLeft: current.phase === "playing" ? Math.max(0, current.timeLeft - 1) : current.timeLeft,
      }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [failRound, state.phase, state.timeLeft]);

  useEffect(() => {
    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, []);

  const handleBubbleClick = useCallback((bubbleId: number) => {
    setState((current) => {
      if (current.phase !== "playing" || current.selectedIds.includes(bubbleId)) return current;

      const expectedOrder = [...current.bubbles]
        .sort((a, b) => current.order === "asc" ? a.value - b.value : b.value - a.value)
        .map((bubble) => bubble.id);
      const expectedId = expectedOrder[current.selectedIds.length];

      if (bubbleId !== expectedId) {
        if (transitionRef.current) clearTimeout(transitionRef.current);
        const lives = current.lives - 1;

        transitionRef.current = setTimeout(() => {
          setState((latest) => {
            if (lives <= 0) return { ...latest, phase: "results" };
            return startRound(latest.level, { ...latest, lives });
          });
        }, 900);

        return {
          ...current,
          lives,
          streak: 0,
          phase: "round-failed",
          failedReason: "Wrong bubble",
        };
      }

      const selectedIds = [...current.selectedIds, bubbleId];
      const roundComplete = selectedIds.length === current.bubbles.length;

      if (roundComplete) {
        if (transitionRef.current) clearTimeout(transitionRef.current);
        transitionRef.current = setTimeout(() => {
          setState((latest) => startRound(latest.level, latest));
        }, 850);
      }

      const streak = roundComplete ? current.streak + 1 : current.streak;

      return {
        ...current,
        selectedIds,
        phase: roundComplete ? "round-success" : current.phase,
        score: roundComplete ? current.score + 10 : current.score,
        level: roundComplete ? current.level + 1 : current.level,
        streak,
        bestStreak: Math.max(current.bestStreak, streak),
        highestLevel: roundComplete ? Math.max(current.highestLevel, current.level + 1) : current.highestLevel,
      };
    });
  }, [startRound]);

  const handleReset = useCallback(() => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setState(initialState());
  }, []);

  return (
    <BubbleMathUI
      phase={state.phase}
      level={state.level}
      lives={state.lives}
      score={state.score}
      streak={state.streak}
      bestStreak={state.bestStreak}
      highestLevel={state.highestLevel}
      order={state.order}
      bubbles={state.bubbles}
      selectedIds={state.selectedIds}
      expectedIds={expectedIds}
      timeLeft={state.timeLeft}
      timeLimit={state.timeLimit}
      failedReason={state.failedReason}
      onBubbleClick={handleBubbleClick}
      onReset={handleReset}
    />
  );
}

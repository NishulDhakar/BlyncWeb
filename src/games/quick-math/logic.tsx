"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QuickMathUI from "./ui";
import { useGameSession } from "@/games/hooks/useGameSession";

export type QuickMathPhase = "playing" | "correct" | "wrong" | "results";
export type QuickMathOperator = "+" | "-" | "x";
export type QuickMathToken = string | "_";

export type QuickMathProblem = {
  id: number;
  tokens: QuickMathToken[];
  target: number;
  blanks: number;
  answerDigits: number[];
  operator: QuickMathOperator;
};

type GameState = {
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
};

const MAX_LIVES = 3;
const BASE_TIME = 30;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function numberToTokens(value: number) {
  return String(value).split("");
}

function pickBlankIndexes(length: number, count: number) {
  const indexes = Array.from({ length }, (_, index) => index);

  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]];
  }

  return indexes.slice(0, count).sort((a, b) => a - b);
}

/**
 * Operator unlock schedule:
 *   Level 1-2  → only +
 *   Level 3-5  → + and -  (rotate to avoid repetition)
 *   Level 6+   → +, -, x  (all three)
 *
 * Number ranges:
 *   Level 1   → 1-5  (guaranteed single-digit result)
 *   Level 2   → 1-9  (single-digit operands)
 *   Level 3-4 → 2-15
 *   Level 5-6 → 5-30
 *   Level 7-9 → 10-60
 *   Level 10+ → 20-99
 */
function makeEquation(level: number) {
  // Determine operator pool — add variety only as levels grow
  let operatorPool: QuickMathOperator[];
  if (level <= 2) {
    operatorPool = ["+"];
  } else if (level <= 5) {
    operatorPool = ["+", "-"];
  } else {
    // Equal weight for all three so none dominates
    operatorPool = ["+", "-", "x"];
  }
  const operator = operatorPool[randomInt(0, operatorPool.length - 1)];

  // Number ceiling by level
  const ceiling =
    level === 1 ? 5
    : level === 2 ? 9
    : level <= 4 ? 15
    : level <= 6 ? 30
    : level <= 9 ? 60
    : 99;

  const floor = level <= 2 ? 1 : level <= 4 ? 2 : level <= 6 ? 5 : 10;

  if (operator === "+") {
    const a = randomInt(floor, ceiling);
    const b = randomInt(floor, ceiling);
    return { left: a, right: b, operator, target: a + b };
  }

  if (operator === "-") {
    // Ensure positive result and operands within ceiling
    const b = randomInt(floor, ceiling);
    const result = randomInt(1, ceiling);
    return { left: result + b, right: b, operator, target: result };
  }

  // Multiplication: keep operands small to avoid huge products
  const mulMax = level <= 7 ? 6 : level <= 10 ? 9 : 12;
  const a = randomInt(2, mulMax);
  const b = randomInt(2, mulMax);
  return { left: a, right: b, operator, target: a * b };
}

function createProblemCandidate(level: number): QuickMathProblem {
  const equation = makeEquation(level);
  const leftTokens = numberToTokens(equation.left);
  const rightTokens = numberToTokens(equation.right);
  const digitPositions = [
    ...leftTokens.map((_, index) => ({ side: "left" as const, index })),
    ...rightTokens.map((_, index) => ({ side: "right" as const, index })),
  ];
  // 1 blank for levels 1-3, 2 blanks for 4-7, 3 blanks for 8+
  const blankCount = Math.min(level <= 3 ? 1 : level <= 7 ? 2 : 3, digitPositions.length);
  const blankIndexes = pickBlankIndexes(digitPositions.length, blankCount);
  const answerDigits: number[] = [];

  blankIndexes.forEach((positionIndex) => {
    const position = digitPositions[positionIndex];
    const source = position.side === "left" ? leftTokens : rightTokens;
    answerDigits.push(Number(source[position.index]));
    source[position.index] = "_";
  });

  return {
    id: Date.now() + randomInt(1, 9999),
    tokens: [...leftTokens, equation.operator, ...rightTokens],
    target: equation.target,
    blanks: blankCount,
    answerDigits,
    operator: equation.operator,
  };
}

function generateProblem(level: number): QuickMathProblem {
  // Allow repeated digits — valid equations like _ - 5 + _ = 4 are fine
  return createProblemCandidate(level);
}

function getTimeLimit(level: number) {
  // Starts at 30s, drops by 1s every level, floors at 10s
  return Math.max(10, BASE_TIME - (level - 1));
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
    problem: generateProblem(1),
    userDigits: [],
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
    problem: generateProblem(level),
    userDigits: [],
    timeLeft: timeLimit,
    timeLimit,
  };
}

export default function QuickMathGame() {
  const [state, setState] = useState<GameState>(initialState);

  // Persists the finished run to the leaderboard exactly once.
  // Shared with every other game — see src/games/hooks/useGameSession.ts.
  useGameSession({ gameSlug: "quick-math", score: state.score, finished: state.phase === "results" });
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleDigitClick = useCallback((digit: number) => {
    setState((current) => {
      if (current.phase !== "playing" || !current.problem) return current;
      // Allow any digit — same digit can fill multiple blank slots
      if (current.userDigits.length >= current.problem.blanks) return current;

      return { ...current, userDigits: [...current.userDigits, digit] };
    });
  }, []);

  const handleDelete = useCallback(() => {
    setState((current) => {
      if (current.phase !== "playing") return current;
      return { ...current, userDigits: current.userDigits.slice(0, -1) };
    });
  }, []);

  const handleSubmit = useCallback(() => {
    setState((current) => {
      if (current.phase !== "playing" || !current.problem) return current;
      if (current.userDigits.length !== current.problem.blanks) return current;

      const isCorrect = current.problem.answerDigits.every(
        (digit, index) => digit === current.userDigits[index]
      );
      const lives = isCorrect ? current.lives : current.lives - 1;
      const streak = isCorrect ? current.streak + 1 : 0;
      const scoreGain = isCorrect ? 10 + Math.max(0, current.level - 1) * 2 + streak * 2 : 0;

      return queueNext(
        {
          ...current,
          phase: isCorrect ? "correct" : "wrong",
          lives,
          score: current.score + scoreGain,
          correctCount: current.correctCount + (isCorrect ? 1 : 0),
          wrongCount: current.wrongCount + (isCorrect ? 0 : 1),
          streak,
          bestStreak: Math.max(current.bestStreak, streak),
        },
        lives
      );
    });
  }, [queueNext]);

  const handleReset = useCallback(() => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setState(initialState());
  }, []);

  return (
    <QuickMathUI
      phase={state.phase}
      level={state.level}
      lives={state.lives}
      score={state.score}
      correctCount={state.correctCount}
      wrongCount={state.wrongCount}
      streak={state.streak}
      bestStreak={state.bestStreak}
      highestLevel={state.highestLevel}
      problem={state.problem}
      userDigits={state.userDigits}
      timeLeft={state.timeLeft}
      timeLimit={state.timeLimit}
      onDigitClick={handleDigitClick}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
      onReset={handleReset}
    />
  );
}

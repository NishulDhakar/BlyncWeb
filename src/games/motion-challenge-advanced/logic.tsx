"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MotionChallengeUI from "./ui";
import { useGameSession } from "@/games/hooks/useGameSession";

export type MotionGameStatus = "playing" | "results";
export type MotionEntityType = "ball" | "block" | "rock";
export type MotionAxis = "both" | "horizontal" | "vertical";
export type MotionColor = "red" | "green" | "blue" | "amber" | "violet" | "stone";

export type MotionEntity = {
  id: string;
  type: MotionEntityType;
  x: number;
  y: number;
  w: number;
  h: number;
  axis: MotionAxis;
  color: MotionColor;
};

export type MotionLevel = {
  id: number;
  name: string;
  rows: number;
  cols: number;
  par: number;
  hole: { x: number; y: number };
  entities: MotionEntity[];
};

export type MoveDirection = "up" | "down" | "left" | "right";
export type ValidMoves = Record<MoveDirection, boolean>;

type MotionState = {
  level: number;
  correct: number;
  wrong: number;
  moves: number;
  score: number;
  entities: MotionEntity[];
  selectedId: string | null;
  isLevelWon: boolean;
  sessionTime: number;
  gameStatus: MotionGameStatus;
};

const SESSION_TIME = 240;
const LEVEL_COMPLETE_DELAY = 850;

const MOTION_LEVELS: MotionLevel[] = [
  {
    id: 1,
    name: "Training Board",
    rows: 6,
    cols: 6,
    par: 4,
    hole: { x: 5, y: 5 },
    entities: [
      { id: "ball", type: "ball", x: 0, y: 5, w: 1, h: 1, axis: "both", color: "red" },
      { id: "g1", type: "block", x: 1, y: 4, w: 1, h: 2, axis: "vertical", color: "green" },
      { id: "b1", type: "block", x: 4, y: 4, w: 1, h: 2, axis: "vertical", color: "blue" },
      { id: "a1", type: "block", x: 2, y: 3, w: 3, h: 1, axis: "horizontal", color: "amber" },
      { id: "r1", type: "rock", x: 0, y: 0, w: 1, h: 1, axis: "both", color: "stone" },
      { id: "r2", type: "rock", x: 0, y: 1, w: 1, h: 1, axis: "both", color: "stone" },
    ],
  },
  {
    id: 2,
    name: "Side Gate",
    rows: 6,
    cols: 6,
    par: 6,
    hole: { x: 5, y: 0 },
    entities: [
      { id: "ball", type: "ball", x: 0, y: 2, w: 1, h: 1, axis: "both", color: "red" },
      { id: "v1", type: "block", x: 2, y: 0, w: 1, h: 3, axis: "vertical", color: "green" },
      { id: "h1", type: "block", x: 3, y: 1, w: 2, h: 1, axis: "horizontal", color: "amber" },
      { id: "v2", type: "block", x: 4, y: 3, w: 1, h: 2, axis: "vertical", color: "blue" },
      { id: "r1", type: "rock", x: 1, y: 4, w: 1, h: 1, axis: "both", color: "stone" },
      { id: "r2", type: "rock", x: 3, y: 5, w: 1, h: 1, axis: "both", color: "stone" },
    ],
  },
  {
    id: 3,
    name: "Center Lock",
    rows: 6,
    cols: 6,
    par: 7,
    hole: { x: 0, y: 0 },
    entities: [
      { id: "ball", type: "ball", x: 5, y: 5, w: 1, h: 1, axis: "both", color: "red" },
      { id: "h1", type: "block", x: 1, y: 2, w: 3, h: 1, axis: "horizontal", color: "amber" },
      { id: "v1", type: "block", x: 4, y: 1, w: 1, h: 3, axis: "vertical", color: "violet" },
      { id: "v2", type: "block", x: 2, y: 3, w: 1, h: 2, axis: "vertical", color: "green" },
      { id: "r1", type: "rock", x: 3, y: 0, w: 1, h: 1, axis: "both", color: "stone" },
      { id: "r2", type: "rock", x: 5, y: 2, w: 1, h: 1, axis: "both", color: "stone" },
    ],
  },
  {
    id: 4,
    name: "Long Wall",
    rows: 6,
    cols: 6,
    par: 8,
    hole: { x: 5, y: 3 },
    entities: [
      { id: "ball", type: "ball", x: 0, y: 0, w: 1, h: 1, axis: "both", color: "red" },
      { id: "h1", type: "block", x: 1, y: 1, w: 4, h: 1, axis: "horizontal", color: "amber" },
      { id: "v1", type: "block", x: 2, y: 2, w: 1, h: 3, axis: "vertical", color: "green" },
      { id: "h2", type: "block", x: 3, y: 4, w: 2, h: 1, axis: "horizontal", color: "blue" },
      { id: "r1", type: "rock", x: 0, y: 3, w: 1, h: 1, axis: "both", color: "stone" },
      { id: "r2", type: "rock", x: 4, y: 2, w: 1, h: 1, axis: "both", color: "stone" },
    ],
  },
  {
    id: 5,
    name: "Double Slide",
    rows: 7,
    cols: 7,
    par: 9,
    hole: { x: 6, y: 6 },
    entities: [
      { id: "ball", type: "ball", x: 1, y: 6, w: 1, h: 1, axis: "both", color: "red" },
      { id: "v1", type: "block", x: 2, y: 3, w: 1, h: 3, axis: "vertical", color: "green" },
      { id: "h1", type: "block", x: 3, y: 2, w: 3, h: 1, axis: "horizontal", color: "amber" },
      { id: "v2", type: "block", x: 5, y: 3, w: 1, h: 2, axis: "vertical", color: "blue" },
      { id: "h2", type: "block", x: 0, y: 1, w: 2, h: 1, axis: "horizontal", color: "violet" },
      { id: "r1", type: "rock", x: 0, y: 5, w: 1, h: 1, axis: "both", color: "stone" },
      { id: "r2", type: "rock", x: 4, y: 0, w: 1, h: 1, axis: "both", color: "stone" },
    ],
  },
  {
    id: 6,
    name: "Narrow Exit",
    rows: 7,
    cols: 7,
    par: 10,
    hole: { x: 0, y: 6 },
    entities: [
      { id: "ball", type: "ball", x: 6, y: 0, w: 1, h: 1, axis: "both", color: "red" },
      { id: "h1", type: "block", x: 1, y: 1, w: 3, h: 1, axis: "horizontal", color: "amber" },
      { id: "v1", type: "block", x: 4, y: 1, w: 1, h: 3, axis: "vertical", color: "blue" },
      { id: "h2", type: "block", x: 2, y: 4, w: 4, h: 1, axis: "horizontal", color: "green" },
      { id: "v2", type: "block", x: 1, y: 3, w: 1, h: 2, axis: "vertical", color: "violet" },
      { id: "r1", type: "rock", x: 5, y: 5, w: 1, h: 1, axis: "both", color: "stone" },
      { id: "r2", type: "rock", x: 2, y: 6, w: 1, h: 1, axis: "both", color: "stone" },
    ],
  },
  {
    id: 7,
    name: "Split Corridor",
    rows: 7,
    cols: 7,
    par: 11,
    hole: { x: 3, y: 0 },
    entities: [
      { id: "ball", type: "ball", x: 3, y: 6, w: 1, h: 1, axis: "both", color: "red" },
      { id: "h1", type: "block", x: 1, y: 1, w: 2, h: 1, axis: "horizontal", color: "amber" },
      { id: "h2", type: "block", x: 4, y: 1, w: 2, h: 1, axis: "horizontal", color: "blue" },
      { id: "v1", type: "block", x: 2, y: 2, w: 1, h: 3, axis: "vertical", color: "green" },
      { id: "v2", type: "block", x: 4, y: 2, w: 1, h: 3, axis: "vertical", color: "violet" },
      { id: "r1", type: "rock", x: 0, y: 3, w: 1, h: 1, axis: "both", color: "stone" },
      { id: "r2", type: "rock", x: 6, y: 3, w: 1, h: 1, axis: "both", color: "stone" },
    ],
  },
  {
    id: 8,
    name: "Final Board",
    rows: 7,
    cols: 7,
    par: 12,
    hole: { x: 6, y: 2 },
    entities: [
      { id: "ball", type: "ball", x: 0, y: 4, w: 1, h: 1, axis: "both", color: "red" },
      { id: "h1", type: "block", x: 1, y: 2, w: 3, h: 1, axis: "horizontal", color: "amber" },
      { id: "h2", type: "block", x: 3, y: 5, w: 3, h: 1, axis: "horizontal", color: "green" },
      { id: "v1", type: "block", x: 4, y: 1, w: 1, h: 3, axis: "vertical", color: "blue" },
      { id: "v2", type: "block", x: 2, y: 3, w: 1, h: 3, axis: "vertical", color: "violet" },
      { id: "r1", type: "rock", x: 0, y: 1, w: 1, h: 1, axis: "both", color: "stone" },
      { id: "r2", type: "rock", x: 5, y: 4, w: 1, h: 1, axis: "both", color: "stone" },
    ],
  },
  {
    id: 9,
    name: "Labyrinth",
    rows: 8,
    cols: 8,
    par: 14,
    hole: { x: 7, y: 7 },
    entities: [
      { id: "ball", type: "ball", x: 0, y: 0, w: 1, h: 1, axis: "both", color: "red" },
      { id: "h1", type: "block", x: 1, y: 0, w: 3, h: 1, axis: "horizontal", color: "amber" },
      { id: "v1", type: "block", x: 4, y: 0, w: 1, h: 4, axis: "vertical", color: "green" },
      { id: "h2", type: "block", x: 1, y: 3, w: 3, h: 1, axis: "horizontal", color: "blue" },
      { id: "v2", type: "block", x: 1, y: 4, w: 1, h: 3, axis: "vertical", color: "violet" },
      { id: "h3", type: "block", x: 2, y: 6, w: 4, h: 1, axis: "horizontal", color: "amber" },
      { id: "v3", type: "block", x: 6, y: 3, w: 1, h: 4, axis: "vertical", color: "green" },
      { id: "h4", type: "block", x: 4, y: 5, w: 2, h: 1, axis: "horizontal", color: "blue" },
      { id: "r1", type: "rock", x: 0, y: 2, w: 1, h: 1, axis: "both", color: "stone" },
      { id: "r2", type: "rock", x: 3, y: 4, w: 1, h: 1, axis: "both", color: "stone" },
      { id: "r3", type: "rock", x: 5, y: 1, w: 1, h: 1, axis: "both", color: "stone" },
    ],
  },
  {
    id: 10,
    name: "The Gauntlet",
    rows: 8,
    cols: 8,
    par: 16,
    hole: { x: 0, y: 7 },
    entities: [
      { id: "ball", type: "ball", x: 7, y: 0, w: 1, h: 1, axis: "both", color: "red" },
      { id: "v1", type: "block", x: 6, y: 0, w: 1, h: 3, axis: "vertical", color: "violet" },
      { id: "h1", type: "block", x: 2, y: 2, w: 4, h: 1, axis: "horizontal", color: "amber" },
      { id: "v2", type: "block", x: 5, y: 3, w: 1, h: 3, axis: "vertical", color: "blue" },
      { id: "h2", type: "block", x: 1, y: 4, w: 4, h: 1, axis: "horizontal", color: "green" },
      { id: "v3", type: "block", x: 3, y: 5, w: 1, h: 2, axis: "vertical", color: "amber" },
      { id: "h3", type: "block", x: 1, y: 6, w: 2, h: 1, axis: "horizontal", color: "violet" },
      { id: "v4", type: "block", x: 0, y: 3, w: 1, h: 3, axis: "vertical", color: "green" },
      { id: "h4", type: "block", x: 4, y: 1, w: 2, h: 1, axis: "horizontal", color: "blue" },
      { id: "r1", type: "rock", x: 1, y: 0, w: 1, h: 1, axis: "both", color: "stone" },
      { id: "r2", type: "rock", x: 6, y: 5, w: 1, h: 1, axis: "both", color: "stone" },
      { id: "r3", type: "rock", x: 2, y: 7, w: 1, h: 1, axis: "both", color: "stone" },
      { id: "r4", type: "rock", x: 7, y: 3, w: 1, h: 1, axis: "both", color: "stone" },
    ],
  },
];

export const TOTAL_LEVELS = MOTION_LEVELS.length;

function cloneEntities(entities: MotionEntity[]) {
  return entities.map((entity) => ({ ...entity }));
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function rectsOverlap(a: MotionEntity, b: MotionEntity) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function nextEntity(entity: MotionEntity, direction: MoveDirection): MotionEntity {
  if (direction === "up") return { ...entity, y: entity.y - 1 };
  if (direction === "down") return { ...entity, y: entity.y + 1 };
  if (direction === "left") return { ...entity, x: entity.x - 1 };
  return { ...entity, x: entity.x + 1 };
}

function canUseDirection(entity: MotionEntity, direction: MoveDirection) {
  if (entity.type === "rock") return false;
  if (entity.axis === "both") return true;
  if (entity.axis === "horizontal") return direction === "left" || direction === "right";
  return direction === "up" || direction === "down";
}

export function canMoveEntity(level: MotionLevel, entities: MotionEntity[], id: string, direction: MoveDirection) {
  const entity = entities.find((item) => item.id === id);
  if (!entity || !canUseDirection(entity, direction)) return false;

  const moved = nextEntity(entity, direction);
  const isBallOnHole =
    entity.type === "ball" && moved.x === level.hole.x && moved.y === level.hole.y;

  if (moved.x < 0 || moved.y < 0 || moved.x + moved.w > level.cols || moved.y + moved.h > level.rows) {
    return false;
  }

  return entities.every((other) => {
    if (other.id === id) return true;
    if (isBallOnHole && other.type !== "rock") return true;
    return !rectsOverlap(moved, other);
  });
}

export function getValidMoves(level: MotionLevel, entities: MotionEntity[], id: string): ValidMoves {
  return {
    up: canMoveEntity(level, entities, id, "up"),
    down: canMoveEntity(level, entities, id, "down"),
    left: canMoveEntity(level, entities, id, "left"),
    right: canMoveEntity(level, entities, id, "right"),
  };
}

function isLevelSolved(level: MotionLevel, entities: MotionEntity[]) {
  const ball = entities.find((entity) => entity.type === "ball");
  return ball?.x === level.hole.x && ball.y === level.hole.y;
}

function getLevel(index: number) {
  return MOTION_LEVELS[index % TOTAL_LEVELS];
}

function makeInitialState(): MotionState {
  const level = getLevel(0);

  return {
    level: 1,
    correct: 0,
    wrong: 0,
    moves: 0,
    score: 0,
    entities: cloneEntities(level.entities),
    selectedId: "ball",
    isLevelWon: false,
    sessionTime: SESSION_TIME,
    // Games auto-start on mount — no separate "start" phase or button.
    gameStatus: "playing",
  };
}

export default function MotionChallengeGame() {
  const [state, setState] = useState<MotionState>(makeInitialState);

  // Persists the finished run to the leaderboard exactly once.
  // Shared with every other game — see src/games/hooks/useGameSession.ts.
  useGameSession({ gameSlug: "motion-challenge-advanced", score: state.score, finished: state.gameStatus === "results" });
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const level = useMemo(() => getLevel(state.level - 1), [state.level]);
  const timer = useMemo(() => formatTime(state.sessionTime), [state.sessionTime]);

  const loadLevel = useCallback((levelNumber: number, source: MotionState): MotionState => {
    const nextLevel = getLevel(levelNumber - 1);

    return {
      ...source,
      level: levelNumber,
      moves: 0,
      entities: cloneEntities(nextLevel.entities),
      selectedId: "ball",
      isLevelWon: false,
    };
  }, []);

  useEffect(() => {
    if (state.gameStatus !== "playing") return;

    const timeout = setTimeout(() => {
      setState((current) => {
        if (current.gameStatus !== "playing") return current;
        if (current.sessionTime <= 1) return { ...current, sessionTime: 0, gameStatus: "results" };
        return { ...current, sessionTime: current.sessionTime - 1 };
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [state.gameStatus, state.sessionTime]);

  useEffect(() => {
    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, []);

  const selectEntity = useCallback((id: string | null) => {
    setState((current) => {
      if (current.gameStatus !== "playing" || current.isLevelWon) return current;
      return { ...current, selectedId: current.selectedId === id ? null : id };
    });
  }, []);

  const moveEntity = useCallback(
    (id: string, direction: MoveDirection) => {
      setState((current) => {
        if (current.gameStatus !== "playing" || current.isLevelWon) return current;
        const currentLevel = getLevel(current.level - 1);
        if (!canMoveEntity(currentLevel, current.entities, id, direction)) return current;

        const entities = current.entities.map((entity) =>
          entity.id === id ? nextEntity(entity, direction) : entity
        );
        const moves = current.moves + 1;

        if (isLevelSolved(currentLevel, entities)) {
          if (transitionRef.current) clearTimeout(transitionRef.current);
          transitionRef.current = setTimeout(() => {
            setState((latest) => {
              if (latest.level >= TOTAL_LEVELS) {
                return { ...latest, gameStatus: "results" };
              }
              return loadLevel(latest.level + 1, latest);
            });
          }, LEVEL_COMPLETE_DELAY);

          const parBonus = Math.max(0, currentLevel.par - moves + 1);

          return {
            ...current,
            entities,
            moves,
            correct: current.correct + 1,
            score: current.score + 10 + parBonus,
            selectedId: null,
            isLevelWon: true,
          };
        }

        return { ...current, entities, moves, selectedId: id };
      });
    },
    [loadLevel]
  );

  const resetLevel = useCallback(() => {
    setState((current) => {
      if (current.gameStatus !== "playing") return current;
      const currentLevel = getLevel(current.level - 1);
      return {
        ...current,
        moves: 0,
        entities: cloneEntities(currentLevel.entities),
        selectedId: "ball",
        isLevelWon: false,
      };
    });
  }, []);

  const skipLevel = useCallback(() => {
    setState((current) => {
      if (current.gameStatus !== "playing" || current.isLevelWon) return current;
      if (current.level >= TOTAL_LEVELS) return { ...current, gameStatus: "results" };
      return loadLevel(current.level + 1, { ...current, wrong: current.wrong + 1 });
    });
  }, [loadLevel]);

  const goNextLevel = useCallback(() => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setState((current) => {
      if (current.gameStatus !== "playing" || !current.isLevelWon) return current;
      if (current.level >= TOTAL_LEVELS) return { ...current, gameStatus: "results" };
      return loadLevel(current.level + 1, current);
    });
  }, [loadLevel]);

  const resetGame = useCallback(() => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setState(makeInitialState());
  }, []);

  return (
    <MotionChallengeUI
      levelNumber={state.level}
      totalLevels={TOTAL_LEVELS}
      level={level}
      timer={timer}
      entities={state.entities}
      selectedId={state.selectedId}
      moves={state.moves}
      score={state.score}
      correct={state.correct}
      wrong={state.wrong}
      gameStatus={state.gameStatus}
      isLevelWon={state.isLevelWon}
      onSelect={selectEntity}
      onMove={moveEntity}
      onResetLevel={resetLevel}
      onSkipLevel={skipLevel}
      onNextLevel={goNextLevel}
      onResetGame={resetGame}
    />
  );
}

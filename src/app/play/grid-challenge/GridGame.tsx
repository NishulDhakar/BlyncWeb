'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Container from '@/components/common/Container';
import GamePage from '@/components/common/GamePage';
import GridChallengeUI, { type GridPhase } from '@/components/games/GridChallengeUI';
import {
  generateDots,
  generateSymmetryChallenge,
  getLevelConfig,
  type GridDot,
  type SymmetryChallenge,
} from '@/features/grid-challenge/gameLogic';
import { saveScore } from '@/features/scoring/actions';

const MAX_LIVES = 3;

interface GameState {
  phase: GridPhase;
  level: number;
  lives: number;
  score: number;
  // Dot field
  dots: GridDot[];
  memoryDotIds: number[];
  blinkDotId: number | null;
  currentDotIndex: number;
  dotsToRemember: number;
  // Symmetry
  symmetryChallenge: SymmetryChallenge | null;
  symmetryTimeLeft: number;
  symmetryTimeMax: number;
  symmetryAnswered: boolean;
  lastSymmetryCorrect: boolean | null;
  // Recall
  recallClicks: number[];
  recallShake: boolean;
  // Stats
  symCorrect: number;
  symWrong: number;
  streak: number;
}

function makeLevelDots(level: number) {
  const cfg = getLevelConfig(level);
  const dots = generateDots(cfg.totalDots);
  const shuffled = [...dots].sort(() => Math.random() - 0.5);
  const memoryDotIds = shuffled.slice(0, cfg.dotsToRemember).map((d) => d.id);
  return { dots, memoryDotIds, cfg };
}

function initialState(): GameState {
  return {
    phase: 'start',
    level: 1,
    lives: MAX_LIVES,
    score: 0,
    dots: [],
    memoryDotIds: [],
    blinkDotId: null,
    currentDotIndex: 0,
    dotsToRemember: 3,
    symmetryChallenge: null,
    symmetryTimeLeft: 6,
    symmetryTimeMax: 6,
    symmetryAnswered: false,
    lastSymmetryCorrect: null,
    recallClicks: [],
    recallShake: false,
    symCorrect: 0,
    symWrong: 0,
    streak: 0,
  };
}

export default function GridGame() {
  const [state, setState] = useState<GameState>(initialState);
  const scoreSavedRef = useRef(false);

  // ── Save score when game ends ──────────────────────────────────────────────
  useEffect(() => {
    if (state.phase === 'results' && !scoreSavedRef.current) {
      scoreSavedRef.current = true;
      saveScore('grid-challenge', state.score);
    }
  }, [state.phase, state.score]);

  // ── Blinking → Symmetry transition ────────────────────────────────────────
  useEffect(() => {
    if (state.phase !== 'blinking') return;
    const cfg = getLevelConfig(state.level);
    const timeMax = Math.round(cfg.symmetryDisplayMs / 1000);

    const t = setTimeout(() => {
      setState((s) => ({
        ...s,
        phase: 'symmetry',
        symmetryChallenge: generateSymmetryChallenge(cfg.gridSize),
        symmetryTimeLeft: timeMax,
        symmetryTimeMax: timeMax,
        symmetryAnswered: false,
        lastSymmetryCorrect: null,
      }));
    }, cfg.blinkDurationMs);

    return () => clearTimeout(t);
  }, [state.phase, state.level, state.currentDotIndex]);

  // ── Symmetry countdown ─────────────────────────────────────────────────────
  useEffect(() => {
    if (state.phase !== 'symmetry' || state.symmetryAnswered) return;
    if (state.symmetryTimeLeft <= 0) {
      // Timed out — skip symmetry, no score change, advance
      setState((s) => ({ ...s, symmetryAnswered: true, lastSymmetryCorrect: null }));
      return;
    }
    const t = setTimeout(
      () => setState((s) => ({ ...s, symmetryTimeLeft: s.symmetryTimeLeft - 1 })),
      1000
    );
    return () => clearTimeout(t);
  }, [state.phase, state.symmetryAnswered, state.symmetryTimeLeft]);

  // ── Symmetry answered → advance to next dot or recall ─────────────────────
  useEffect(() => {
    if (state.phase !== 'symmetry' || !state.symmetryAnswered) return;

    // Show feedback for 600ms (or 0ms for timeout), then advance
    const delay = state.lastSymmetryCorrect !== null ? 650 : 0;
    const t = setTimeout(() => {
      setState((s) => {
        const nextIndex = s.currentDotIndex + 1;
        const cfg = getLevelConfig(s.level);
        const timeMax = Math.round(cfg.symmetryDisplayMs / 1000);

        if (nextIndex >= s.dotsToRemember) {
          // All dots shown — move to recall
          return { ...s, phase: 'recall', currentDotIndex: nextIndex };
        }

        // Show next blinking dot
        return {
          ...s,
          phase: 'blinking',
          currentDotIndex: nextIndex,
          blinkDotId: s.memoryDotIds[nextIndex],
          symmetryAnswered: false,
          lastSymmetryCorrect: null,
          symmetryTimeLeft: timeMax,
        };
      });
    }, delay);

    return () => clearTimeout(t);
  }, [state.phase, state.symmetryAnswered, state.lastSymmetryCorrect]);

  // ── Start game ─────────────────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    scoreSavedRef.current = false;
    const { dots, memoryDotIds, cfg } = makeLevelDots(1);
    const timeMax = Math.round(cfg.symmetryDisplayMs / 1000);
    setState({
      ...initialState(),
      phase: 'blinking',
      level: 1,
      lives: MAX_LIVES,
      dots,
      memoryDotIds,
      blinkDotId: memoryDotIds[0],
      currentDotIndex: 0,
      dotsToRemember: cfg.dotsToRemember,
      symmetryTimeLeft: timeMax,
      symmetryTimeMax: timeMax,
    });
  }, []);

  // ── Symmetry answer ────────────────────────────────────────────────────────
  const handleAnswer = useCallback(
    (isSymmetric: boolean) => {
      setState((s) => {
        if (s.symmetryAnswered || s.phase !== 'symmetry' || !s.symmetryChallenge) return s;
        const correct = isSymmetric === s.symmetryChallenge.isSymmetric;
        return {
          ...s,
          symmetryAnswered: true,
          lastSymmetryCorrect: correct,
          score: s.score + (correct ? 3 : -1),
          streak: correct ? s.streak + 1 : 0,
          symCorrect: correct ? s.symCorrect + 1 : s.symCorrect,
          symWrong: correct ? s.symWrong : s.symWrong + 1,
        };
      });
    },
    []
  );

  // ── Dot recall click ───────────────────────────────────────────────────────
  const handleDotClick = useCallback((dotId: number) => {
    setState((s) => {
      if (s.phase !== 'recall') return s;
      const expected = s.memoryDotIds[s.recallClicks.length];

      if (dotId === expected) {
        const newClicks = [...s.recallClicks, dotId];
        const levelComplete = newClicks.length === s.dotsToRemember;
        const scoreGain = levelComplete ? 10 * s.dotsToRemember : 10;

        if (levelComplete) {
          // Schedule level advance after brief celebration
          setTimeout(() => {
            setState((prev) => {
              const newLevel = prev.level + 1;
              const { dots, memoryDotIds, cfg } = makeLevelDots(newLevel);
              const timeMax = Math.round(cfg.symmetryDisplayMs / 1000);
              return {
                ...prev,
                phase: 'blinking',
                level: newLevel,
                dots,
                memoryDotIds,
                blinkDotId: memoryDotIds[0],
                currentDotIndex: 0,
                dotsToRemember: cfg.dotsToRemember,
                symmetryTimeLeft: timeMax,
                symmetryTimeMax: timeMax,
                symmetryAnswered: false,
                lastSymmetryCorrect: null,
                recallClicks: [],
                recallShake: false,
              };
            });
          }, 700);
        }

        return { ...s, recallClicks: newClicks, score: s.score + scoreGain };
      }

      // Wrong dot
      const newLives = s.lives - 1;
      if (newLives <= 0) {
        // Game over after shake animation
        setTimeout(() => setState((prev) => ({ ...prev, recallShake: false, phase: 'results' })), 500);
        return { ...s, recallShake: true, lives: 0, score: Math.max(0, s.score - 5), streak: 0 };
      }

      // Lose a life, reset recall attempt
      setTimeout(() => setState((prev) => ({ ...prev, recallShake: false, recallClicks: [] })), 500);
      return { ...s, recallShake: true, lives: newLives, score: Math.max(0, s.score - 5), streak: 0 };
    });
  }, []);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    scoreSavedRef.current = false;
    setState(initialState());
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  const timerLabel =
    state.phase === 'blinking'
      ? `Memorize • Dot ${state.currentDotIndex + 1}/${state.dotsToRemember}`
      : state.phase === 'symmetry'
      ? 'Symmetry Challenge'
      : state.phase === 'recall'
      ? 'Recall Sequence'
      : '—';

  return (
    <Container>
      <GamePage
        title="Grid Challenge"
        level={state.phase === 'start' || state.phase === 'results' ? 1 : state.level}
        timer={timerLabel}
      >
        <GridChallengeUI
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
          onStart={handleStart}
          onAnswer={handleAnswer}
          onDotClick={handleDotClick}
          onReset={handleReset}
        />
      </GamePage>
    </Container>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Heart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import ResultCard from '@/components/common/Result';
import { useRouter } from 'next/navigation';
import type { GridDot, SymmetryChallenge } from '@/features/grid-challenge/gameLogic';
import { useGridSounds } from '@/features/grid-challenge/useGridSounds';

export type GridPhase = 'start' | 'blinking' | 'symmetry' | 'recall' | 'results';

interface Props {
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
  // Callbacks
  onStart: () => void;
  onAnswer: (isSymmetric: boolean) => void;
  onDotClick: (dotId: number) => void;
  onReset: () => void;
}

// ── Dot Field ────────────────────────────────────────────────────────────────
function DotField({
  dots,
  memoryDotIds,
  blinkDotId,
  recallClicks,
  phase,
  onDotClick,
  shake,
}: {
  dots: GridDot[];
  memoryDotIds: number[];
  blinkDotId: number | null;
  recallClicks: number[];
  phase: GridPhase;
  onDotClick: (id: number) => void;
  shake: boolean;
}) {
  const recallSet = new Set(recallClicks);
  const isRecall = phase === 'recall';

  return (
    <motion.div
      animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
      transition={{ duration: 0.35 }}
      className="relative w-full rounded-2xl border border-border/40 bg-muted/20 overflow-hidden"
      style={{ paddingTop: '38%' }}
    >
      {dots.map((dot) => {
        const isBlinking = dot.id === blinkDotId;
        const recallIndex = recallClicks.indexOf(dot.id);
        const isClicked = recallSet.has(dot.id);
        const isClickable = isRecall && !isClicked;

        return (
          <motion.button
            key={dot.id}
            onClick={() => isClickable && onDotClick(dot.id)}
            disabled={!isClickable}
            className={cn(
              'absolute rounded-full transition-colors duration-200',
              isBlinking
                ? 'bg-amber-400 shadow-[0_0_20px_6px_rgba(251,191,36,0.6)] cursor-default'
                : isClicked
                ? 'bg-emerald-400 cursor-default'
                : isClickable
                ? 'bg-foreground/35 hover:bg-foreground/55 cursor-pointer'
                : 'bg-foreground/25 cursor-default'
            )}
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: '3.2%',
              aspectRatio: '1',
              transform: 'translate(-50%, -50%)',
            }}
            animate={
              isBlinking
                ? { scale: [1, 1.35, 1, 1.35, 1], opacity: [1, 0.7, 1, 0.7, 1] }
                : isClicked
                ? { scale: [0.8, 1.2, 1] }
                : { scale: 1 }
            }
            transition={
              isBlinking
                ? { duration: 0.9, repeat: Infinity }
                : { duration: 0.3 }
            }
          >
            {/* Show sequence number on clicked dots during recall */}
            {isClicked && (
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white">
                {recallIndex + 1}
              </span>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

// ── Grid Pattern ─────────────────────────────────────────────────────────────
function GridPattern({ grid, label }: { grid: boolean[][]; label: string }) {
  const size = grid.length;
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-xl border border-border/40 bg-muted/30 p-2 overflow-hidden"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, gap: '3px' }}
      >
        {grid.map((row, r) =>
          row.map((filled, c) => (
            <div
              key={`${r}-${c}`}
              className={cn(
                'rounded-sm transition-colors',
                filled ? 'bg-foreground/75' : 'bg-muted/10'
              )}
              style={{ width: 24, height: 24 }}
            />
          ))
        )}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

// ── Main UI ───────────────────────────────────────────────────────────────────
export default function GridChallengeUI({
  phase,
  level,
  lives,
  score,
  dots,
  memoryDotIds,
  blinkDotId,
  currentDotIndex,
  dotsToRemember,
  symmetryChallenge,
  symmetryTimeLeft,
  symmetryTimeMax,
  symmetryAnswered,
  lastSymmetryCorrect,
  recallClicks,
  recallShake,
  symCorrect,
  symWrong,
  streak,
  onStart,
  onAnswer,
  onDotClick,
  onReset,
}: Props) {
  const router = useRouter();
  const { play } = useGridSounds();
  const symTotal = symCorrect + symWrong;
  const symAccuracy = symTotal > 0 ? Math.round((symCorrect / symTotal) * 100) : 0;

  // ── Sound effects ────────────────────────────────────────────────────────────
  const prevPhase = useRef<GridPhase>('start');
  const prevBlinkId = useRef<number | null>(null);
  const prevRecallLen = useRef(0);
  const prevShake = useRef(false);
  const prevSymAnswered = useRef(false);

  useEffect(() => {
    if (phase !== prevPhase.current) {
      if (phase === 'symmetry') play('symmetryShow');
      if (phase === 'recall') play('recallStart');
      if (phase === 'results') play('gameOver');
      prevPhase.current = phase;
    }
  }, [phase, play]);

  useEffect(() => {
    if (blinkDotId !== null && blinkDotId !== prevBlinkId.current) {
      play('blink');
      prevBlinkId.current = blinkDotId;
    }
  }, [blinkDotId, play]);

  useEffect(() => {
    if (phase === 'symmetry' && symmetryAnswered && !prevSymAnswered.current) {
      if (lastSymmetryCorrect === true) play('correct');
      if (lastSymmetryCorrect === false) play('wrong');
    }
    prevSymAnswered.current = symmetryAnswered;
  }, [phase, symmetryAnswered, lastSymmetryCorrect, play]);

  useEffect(() => {
    if (phase === 'recall' && recallClicks.length > prevRecallLen.current) {
      if (recallClicks.length === dotsToRemember) {
        play('levelComplete');
      } else {
        play('click');
      }
    }
    prevRecallLen.current = recallClicks.length;
  }, [phase, recallClicks.length, dotsToRemember, play]);

  useEffect(() => {
    if (recallShake && !prevShake.current) play('wrongRecall');
    prevShake.current = recallShake;
  }, [recallShake, play]);

  // ── Start screen ────────────────────────────────────────────────────────────
  if (phase === 'start') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mx-auto text-center space-y-8 py-8"
      >
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Memory + Symmetry
          </div>
          <h1 className="text-3xl font-bold">Grid Challenge</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            Watch which dot blinks, answer the symmetry puzzle, then recall all
            dots in the exact sequence.
          </p>
        </div>

        {/* How to play */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          {[
            { step: '1', label: 'Blink', desc: 'Remember the glowing dot position' },
            { step: '2', label: 'Symmetry', desc: 'Decide if two grids are symmetric' },
            { step: '3', label: 'Recall', desc: 'Click remembered dots in order' },
          ].map(({ step, label, desc }) => (
            <div
              key={step}
              className="rounded-xl border border-border/40 bg-muted/20 p-3 space-y-1"
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold flex items-center justify-center mx-auto">
                {step}
              </div>
              <p className="font-semibold text-foreground">{label}</p>
              <p className="text-muted-foreground leading-tight">{desc}</p>
            </div>
          ))}
        </div>

        {/* Scoring */}
        <div className="flex justify-center gap-6 text-xs text-muted-foreground">
          <span className="text-emerald-400">+10 memory dot</span>
          <span className="text-rose-400">−5 wrong recall</span>
          <span className="text-violet-400">+3 symmetry</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="px-10 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-colors"
        >
          Start Game
        </motion.button>
      </motion.div>
    );
  }

  // ── Results screen ───────────────────────────────────────────────────────────
  if (phase === 'results') {
    return (
      <div className="w-full max-w-lg mx-auto">
        <ResultCard
          correct={symCorrect}
          wrong={symWrong}
          score={score}
          resetGame={onReset}
          onCheckRank={() => router.push('/leaderboard')}
        />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/40 bg-muted/20 p-4 text-center">
            <p className="text-2xl font-bold text-violet-400">{symAccuracy}%</p>
            <p className="text-xs text-muted-foreground mt-1">Symmetry accuracy</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-muted/20 p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{level}</p>
            <p className="text-xs text-muted-foreground mt-1">Highest level</p>
          </div>
        </div>
      </div>
    );
  }

  // ── HUD (shared across blinking / symmetry / recall) ─────────────────────
  const hud = (
    <div className="flex items-center justify-between mb-4 px-1">
      <div className="flex items-center gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Heart
            key={i}
            className={cn(
              'w-4 h-4 transition-colors',
              i < lives ? 'text-rose-400 fill-rose-400' : 'text-muted-foreground/30'
            )}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 text-sm">
        {streak >= 2 && (
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Zap className="w-3.5 h-3.5" /> ×{streak}
          </span>
        )}
        <span className="font-mono font-bold tabular-nums">{score} pts</span>
      </div>
    </div>
  );

  // ── Blinking phase ───────────────────────────────────────────────────────────
  if (phase === 'blinking') {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4">
        {hud}
        <div className="flex items-center justify-between px-1 mb-2">
          <p className="text-sm font-semibold text-amber-400 animate-pulse">
            Remember this dot!
          </p>
          <span className="text-xs text-muted-foreground font-mono">
            Dot {currentDotIndex + 1} of {dotsToRemember}
          </span>
        </div>
        <DotField
          dots={dots}
          memoryDotIds={memoryDotIds}
          blinkDotId={blinkDotId}
          recallClicks={[]}
          phase={phase}
          onDotClick={() => {}}
          shake={false}
        />
        <p className="text-center text-xs text-muted-foreground">
          Watch the glowing dot — you'll need to click it in order later
        </p>
      </div>
    );
  }

  // ── Symmetry phase ───────────────────────────────────────────────────────────
  if (phase === 'symmetry' && symmetryChallenge) {
    const progress = symmetryTimeLeft / symmetryTimeMax;
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4">
        {hud}

        {/* Timer bar */}
        <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full transition-colors',
              progress > 0.5 ? 'bg-emerald-500' : progress > 0.25 ? 'bg-amber-500' : 'bg-rose-500'
            )}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.9, ease: 'linear' }}
          />
        </div>

        {/* Is it symmetric? + label */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground">
            Dot {currentDotIndex + 1} of {dotsToRemember}
          </span>
          <span className="text-sm font-bold">Is it Symmetric..?</span>
          <span className={cn(
            'text-xs font-mono tabular-nums',
            symmetryTimeLeft <= 2 ? 'text-rose-400 animate-pulse' : 'text-muted-foreground'
          )}>
            {symmetryTimeLeft}s
          </span>
        </div>

        {/* Grids */}
        <div className="rounded-2xl border border-border/40 bg-muted/15 p-4 md:p-6">
          <p className="text-center text-sm font-medium text-muted-foreground mb-5">
            {symmetryChallenge.label}
          </p>
          <div className="flex items-center justify-center gap-6 md:gap-10">
            <GridPattern grid={symmetryChallenge.gridA} label="Pattern A" />
            <div className="text-muted-foreground/40 font-bold text-lg">vs</div>
            <GridPattern grid={symmetryChallenge.gridB} label="Pattern B" />
          </div>
        </div>

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Symmetric', value: true, color: 'emerald' },
            { label: 'Not Symmetric', value: false, color: 'rose' },
          ].map(({ label, value, color }) => (
            <motion.button
              key={label}
              whileHover={!symmetryAnswered ? { scale: 1.02 } : {}}
              whileTap={!symmetryAnswered ? { scale: 0.97 } : {}}
              onClick={() => !symmetryAnswered && onAnswer(value)}
              disabled={symmetryAnswered}
              className={cn(
                'py-3.5 rounded-2xl font-bold text-sm border transition-all duration-200',
                symmetryAnswered
                  ? 'bg-muted/20 border-border/20 text-foreground/30 cursor-default'
                  : color === 'emerald'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 cursor-pointer'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-400 hover:bg-rose-500/25 cursor-pointer'
              )}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {/* Inline feedback after answer */}
        <AnimatePresence>
          {symmetryAnswered && lastSymmetryCorrect !== null && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                'flex items-center justify-center gap-2 text-sm font-semibold',
                lastSymmetryCorrect ? 'text-emerald-400' : 'text-rose-400'
              )}
            >
              {lastSymmetryCorrect ? (
                <><CheckCircle2 className="w-4 h-4" /> Correct! +3</>
              ) : (
                <><XCircle className="w-4 h-4" /> Wrong. −1</>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Recall phase ─────────────────────────────────────────────────────────────
  if (phase === 'recall') {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4">
        {hud}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-bold">Click the dots in correct sequence</p>
          <span className="text-xs font-mono text-muted-foreground">
            {recallClicks.length} / {dotsToRemember}
          </span>
        </div>

        {/* Sequence indicator */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: dotsToRemember }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-7 h-7 rounded-full border-2 text-xs font-bold flex items-center justify-center transition-colors',
                i < recallClicks.length
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                  : i === recallClicks.length
                  ? 'border-amber-500/60 bg-amber-500/10 text-amber-400 animate-pulse'
                  : 'border-border/30 text-muted-foreground/30'
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <DotField
          dots={dots}
          memoryDotIds={memoryDotIds}
          blinkDotId={null}
          recallClicks={recallClicks}
          phase={phase}
          onDotClick={onDotClick}
          shake={recallShake}
        />
        <p className="text-center text-xs text-muted-foreground">
          Click each remembered dot in the order it blinked
        </p>
      </div>
    );
  }

  return null;
}

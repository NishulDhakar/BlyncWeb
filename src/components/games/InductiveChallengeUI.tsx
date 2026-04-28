"use client";

import React from 'react';
import { Timer, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FigureData, LinesFigure, CellGridFigure, ShapeRowFigure, InductivePuzzle } from '@/features/inductive-challenge/gameLogic';
import ResultCard from '../common/Result';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────
// SVG Figure Renderers
// ─────────────────────────────────────────────

const W = 72;
const H = 72;

function LinesFigureDisplay({ fig }: { fig: LinesFigure }) {
  const gap = H / (fig.count + 1);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block">
      {Array.from({ length: fig.count }, (_, i) => {
        const y = Math.round(gap * (i + 1));
        const isBroken = fig.brokenIndex === i;
        if (isBroken) {
          return (
            <g key={i}>
              <line x1={5} y1={y} x2={W / 2 - 5} y2={y} stroke="#374151" strokeWidth={1.8} strokeLinecap="round" />
              <line x1={W / 2 + 5} y1={y} x2={W - 5} y2={y} stroke="#374151" strokeWidth={1.8} strokeLinecap="round" />
            </g>
          );
        }
        return (
          <line key={i} x1={5} y1={y} x2={W - 5} y2={y} stroke="#374151" strokeWidth={1.8} strokeLinecap="round" />
        );
      })}
    </svg>
  );
}

function CellGridDisplay({ fig }: { fig: CellGridFigure }) {
  const cellW = (W - 8) / fig.cols;
  const cellH = (H - 8) / fig.rows;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block">
      {fig.filled.map((filled, idx) => {
        const row = Math.floor(idx / fig.cols);
        const col = idx % fig.cols;
        const x = 4 + col * cellW;
        const y = 4 + row * cellH;
        return (
          <rect
            key={idx}
            x={x + 2}
            y={y + 2}
            width={cellW - 4}
            height={cellH - 4}
            rx={2}
            fill={filled ? '#1e293b' : 'none'}
            stroke="#94a3b8"
            strokeWidth={1.2}
          />
        );
      })}
    </svg>
  );
}

function ShapeSymbol({
  form,
  filled,
  cx,
  cy,
  r,
}: {
  form: ShapeRowFigure['shapes'][number]['form'];
  filled: boolean;
  cx: number;
  cy: number;
  r: number;
}) {
  const fill = filled ? '#1e293b' : 'none';
  const stroke = '#374151';
  const sw = 1.5;

  switch (form) {
    case 'circle':
      return <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={sw} />;
    case 'square':
      return <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} rx={1} fill={fill} stroke={stroke} strokeWidth={sw} />;
    case 'triangle': {
      const pts = `${cx},${cy - r} ${cx + r},${cy + r} ${cx - r},${cy + r}`;
      return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />;
    }
    case 'diamond': {
      const pts = `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
      return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />;
    }
    case 'plus':
      return (
        <g fill={fill} stroke={stroke} strokeWidth={sw}>
          <rect x={cx - r * 0.35} y={cy - r} width={r * 0.7} height={r * 2} rx={1} />
          <rect x={cx - r} y={cy - r * 0.35} width={r * 2} height={r * 0.7} rx={1} />
        </g>
      );
  }
}

function ShapeRowDisplay({ fig }: { fig: ShapeRowFigure }) {
  const n = fig.shapes.length;
  const r = Math.min(10, (W - 12) / (n * 2));
  const spacing = (W - 8) / n;
  const cy = H / 2;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block">
      {fig.shapes.map((s, i) => {
        const cx = 4 + spacing * i + spacing / 2;
        return (
          <ShapeSymbol key={i} form={s.form} filled={s.filled} cx={cx} cy={cy} r={r} />
        );
      })}
    </svg>
  );
}

function FigureDisplay({ fig }: { fig: FigureData }) {
  if (fig.type === 'lines') return <LinesFigureDisplay fig={fig} />;
  if (fig.type === 'cellgrid') return <CellGridDisplay fig={fig} />;
  return <ShapeRowDisplay fig={fig} />;
}

// ─────────────────────────────────────────────
// Main UI
// ─────────────────────────────────────────────

interface Props {
  puzzle: InductivePuzzle | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  selected: number | null;
  handleSelect: (index: number) => void;
  timeLeft: number;
  gameStatus: 'playing' | 'results';
  correct: number;
  wrong: number;
  resetGame: () => void;
  level: number;
}

export default function InductiveChallengeUI({
  puzzle,
  isAnswered,
  isCorrect,
  selected,
  handleSelect,
  timeLeft,
  gameStatus,
  correct,
  wrong,
  resetGame,
  level,
}: Props) {
  if (gameStatus === 'results') {
    return <ResultCard correct={correct} wrong={wrong} resetGame={resetGame} />;
  }

  if (!puzzle) {
    return (
      <div className="flex items-center justify-center h-60 text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  return (
    <>
      {/* ── Centered Feedback Modal ── */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={cn(
                "w-64 h-64 rounded-3xl flex flex-col items-center justify-center gap-4 backdrop-blur-sm border-2",
                isCorrect
                  ? "bg-emerald-500/20 border-emerald-500/60"
                  : "bg-rose-500/20 border-rose-500/60"
              )}
            >
              {isCorrect ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.6, repeat: 2 }}
                  >
                    <CheckCircle2 className="w-20 h-20 text-emerald-400" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-emerald-400">Correct!</p>
                    <p className="text-sm text-emerald-300 mt-1">Excellent work</p>
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.4, repeat: 2 }}
                  >
                    <XCircle className="w-20 h-20 text-rose-400" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-rose-400">Wrong</p>
                    <p className="text-sm text-rose-300 mt-1">Keep trying!</p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={puzzle.oddIndex}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="space-y-4"
      >
        {/* ── Stats bar ── */}
        <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3 text-sm font-medium">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> {correct}
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <XCircle className="w-4 h-4" /> {wrong}
          </span>
          <span className="text-xs text-muted-foreground border border-border/40 rounded-full px-2 py-0.5">
            {puzzle.difficulty}
          </span>
        </div>
        <div className={cn(
          'flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-mono font-semibold transition-colors duration-300',
          timeLeft <= 8
            ? 'border-rose-500/50 text-rose-400 bg-rose-500/10 animate-pulse'
            : 'border-border/50 text-muted-foreground'
        )}>
          <Timer className="w-3.5 h-3.5" />
          {timeLeft}s
        </div>
      </div>

        {/* ── Main card ── */}
        <div className={cn(
          'rounded-2xl border bg-card transition-colors duration-300',
          isAnswered
            ? isCorrect ? 'border-emerald-500/40' : 'border-rose-500/40'
            : 'border-border/50'
        )}>
          <div className="p-5 sm:p-6 space-y-5">
          {/* Prompt */}
          {!isAnswered && (
            <p className="text-center text-sm font-medium text-muted-foreground">
              Which figure doesn&apos;t follow the rule?
            </p>
          )}

          {/* Figures */}
          <div className="flex flex-wrap justify-center gap-3">
            {puzzle.figures.map((fig, idx) => {
              const isSelected = selected === idx;
              const isOdd = puzzle.oddIndex === idx;
              const showCorrect = isAnswered && isOdd;
              const showWrong = isAnswered && isSelected && !isOdd;

              return (
                <motion.div
                  key={idx}
                  whileHover={!isAnswered ? { scale: 1.04 } : {}}
                  whileTap={!isAnswered ? { scale: 0.97 } : {}}
                  onClick={() => !isAnswered && handleSelect(idx)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-xl border-2 p-2 transition-all duration-200 select-none',
                    showCorrect ? 'border-emerald-500 bg-emerald-500/10 cursor-default' :
                    showWrong   ? 'border-rose-500 bg-rose-500/10 cursor-default' :
                    !isAnswered && isSelected ? 'border-primary bg-primary/10 cursor-pointer' :
                    isAnswered  ? 'border-border/20 bg-muted/20 opacity-40 cursor-default' :
                                  'border-border/40 bg-muted/30 hover:border-border cursor-pointer'
                  )}
                  style={{ width: 96 }}
                >
                  <div className={cn(
                    'text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center',
                    showCorrect ? 'bg-emerald-500 text-white' :
                    showWrong   ? 'bg-rose-500 text-white' :
                                  'bg-muted text-muted-foreground'
                  )}>
                    {idx + 1}
                  </div>
                  <div className="rounded-lg overflow-hidden bg-white border border-gray-100">
                    <FigureDisplay fig={fig} />
                  </div>
                  {showCorrect && <span className="text-[10px] font-semibold text-emerald-400">Odd one</span>}
                  {showWrong   && <span className="text-[10px] font-semibold text-rose-400">Wrong</span>}
                </motion.div>
              );
            })}
          </div>

          {/* Rule reveal */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center"
              >
                <p className="text-sm text-amber-300">
                  <span className="font-semibold">Rule: </span>{puzzle.rule}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hint */}
      {!isAnswered && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <p className="text-amber-300 text-xs">
              Look for a difference in count, fill, or line pattern
            </p>
          </div>
        </div>
      )}
    </motion.div>
  </>
);
}

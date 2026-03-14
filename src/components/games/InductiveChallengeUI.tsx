"use client";

import React from 'react';
import { Clock, Lightbulb } from 'lucide-react';
import { FigureData, LinesFigure, CellGridFigure, ShapeRowFigure, InductivePuzzle } from '@/features/inductive-challenge/gameLogic';
import ResultCard from '../common/Result';

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
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="flex justify-between items-center bg-white/5 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10 shadow-sm">
        <div className="flex items-center gap-4 text-sm text-foreground/70">
          <span>
            Difficulty <strong className="text-foreground">{puzzle.difficulty}</strong>
          </span>
          <span className="text-emerald-400 font-semibold">✓ {correct}</span>
          <span className="text-rose-400 font-semibold">✗ {wrong}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className={`font-mono text-sm font-semibold ${timeLeft <= 8 ? 'text-rose-400' : 'text-foreground/70'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
        {/* Heading */}
        <div className="px-6 pt-6 pb-4 border-b border-white/10 text-center">
          <h2 className="text-lg font-bold text-foreground">
            {isAnswered
              ? isCorrect
                ? '✓ Correct! Well done.'
                : `✗ Wrong — the odd one was Image ${(puzzle.oddIndex + 1)}`
              : "Which figure doesn't follow the rule?"}
          </h2>
          {!isAnswered && (
            <p className="text-sm text-muted-foreground mt-1">Click the image that is the odd one out</p>
          )}
        </div>

        {/* Figures grid */}
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {puzzle.figures.map((fig, idx) => {
              const isSelected = selected === idx;
              const isOdd = puzzle.oddIndex === idx;
              const showCorrect = isAnswered && isOdd;
              const showWrong = isAnswered && isSelected && !isOdd;

              let borderClass =
                'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 cursor-pointer';
              if (!isAnswered && isSelected) {
                borderClass = 'border-blue-500 bg-blue-500/10 shadow-md cursor-pointer';
              } else if (showCorrect) {
                borderClass = 'border-emerald-500 bg-emerald-500/10 shadow-md cursor-default';
              } else if (showWrong) {
                borderClass = 'border-rose-500 bg-rose-500/10 shadow-md cursor-default';
              } else if (isAnswered) {
                borderClass = 'border-white/10 bg-white/5 opacity-50 cursor-default';
              }

              return (
                <div
                  key={idx}
                  onClick={() => !isAnswered && handleSelect(idx)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-2 transition-all duration-200 select-none ${borderClass}`}
                  style={{ width: 96 }}
                >
                  {/* Figure number badge */}
                  <div
                    className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center
                      ${showCorrect ? 'bg-emerald-500 text-white' : showWrong ? 'bg-rose-500 text-white' : 'bg-white/10 text-foreground/60'}`}
                  >
                    {idx + 1}
                  </div>
                  {/* SVG figure */}
                  <div className="rounded-lg overflow-hidden bg-white border border-gray-100 shadow-inner">
                    <FigureDisplay fig={fig} />
                  </div>
                  {/* Feedback label */}
                  {showCorrect && (
                    <span className="text-[10px] font-semibold text-emerald-400">Odd one out</span>
                  )}
                  {showWrong && (
                    <span className="text-[10px] font-semibold text-rose-400">Wrong</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Rule reveal after answer */}
          {isAnswered && (
            <div className="mt-5 text-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <p className="text-sm text-amber-300">
                <span className="font-semibold">Rule: </span>{puzzle.rule}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hint */}
      {!isAnswered && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/30">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-amber-300 text-xs">
              <span className="font-medium">Hint:</span> Look for a difference in count, fill, or line pattern
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

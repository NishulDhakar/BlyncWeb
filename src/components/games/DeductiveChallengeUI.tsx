'use client';

import React from "react";
import { Puzzle, Symbol as GameSymbol } from "@/types/game";
import ResultCard from "../common/Result";
import { useRouter } from "next/navigation";

interface DeductiveChallengeUIProps {
  puzzle: Puzzle | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  selected: GameSymbol | null;
  handleSelect: (symbol: GameSymbol) => void;
  timeLeft: number;
  gameStatus: 'playing' | 'results';
  correct: number;
  wrong: number;
  resetGame: () => void;
  level: number;
}

const DeductiveChallengeUI: React.FC<DeductiveChallengeUIProps> = ({
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
}) => {
  const router = useRouter();

  // Helper to check if a cell is the target
  const isTargetCell = (r: number, c: number) => puzzle && puzzle.targetCell.row === r && puzzle.targetCell.col === c;
  // Helper to check if a cell is an empty distractor
  const isDistractorCell = (r: number, c: number) => puzzle && puzzle.emptyCells.some((cell: { row: number, col: number }) => cell.row === r && cell.col === c) && !isTargetCell(r, c);

  return (
  <>
    {gameStatus === "results" ? (
      <ResultCard
        correct={correct}
        wrong={wrong}
        resetGame={resetGame}
        onCheckRank={() => router.push("/leaderboard")}
      />
    ) : (
      <div className="relative max-w-xl mx-auto
        rounded-3xl bg-white/75 backdrop-blur-xl
        border border-white/40
        shadow-[0_20px_60px_rgba(0,0,0,0.12)]
        p-6 md:p-8">

        {/* Feedback */}
        {isAnswered && (
          <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center
            rounded-3xl backdrop-blur-sm
            ${isCorrect ? "bg-emerald-50/80" : "bg-rose-50/80"}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3
              ${isCorrect ? "bg-emerald-100" : "bg-rose-100"}`}>
              <span className={`text-3xl font-bold
                ${isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                {isCorrect ? "✓" : "✗"}
              </span>
            </div>
            <h3 className="text-xl font-bold">
              {isCorrect ? "Correct" : "Wrong"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isCorrect ? "Good deduction!" : "Try the next one"}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold">Find the Missing Symbol</h3>
          <p className="text-sm text-muted-foreground">
            Analyze the pattern and choose the correct option
          </p>
        </div>

        {/* Puzzle Grid */}
        {puzzle && (
          <div className="flex justify-center mb-8">
            <div
              className="grid gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200"
              style={{ gridTemplateColumns: `repeat(${puzzle.grid.length}, 1fr)` }}
            >
              {puzzle.grid.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  if (isTargetCell(rIdx, cIdx)) {
                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className="w-12 h-12 md:w-14 md:h-14
                          flex items-center justify-center
                          rounded-xl border-2 border-primary
                          bg-primary/10 text-primary
                          text-2xl font-bold">
                        ?
                      </div>
                    );
                  }
                  if (isDistractorCell(rIdx, cIdx)) {
                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className="w-12 h-12 md:w-14 md:h-14
                          rounded-xl bg-slate-200/60"
                      />
                    );
                  }
                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className="w-12 h-12 md:w-14 md:h-14
                        flex items-center justify-center
                        rounded-xl bg-white border border-slate-200
                        text-xl font-semibold">
                      {cell}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Options */}
        {puzzle && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {puzzle.options.map((option, idx) => {
              const isSelected = selected === option;
              return (
                <button
                  key={`${option}-${idx}`}
                  onClick={() => handleSelect(option)}
                  disabled={isAnswered}
                  className={`h-14 md:h-16 rounded-xl text-xl font-bold
                    transition-all
                    ${isAnswered && isSelected
                      ? isCorrect
                        ? "bg-emerald-500 text-white"
                        : "bg-rose-500 text-white"
                      : "bg-white border border-slate-300 hover:border-primary hover:bg-primary/5"}
                    ${isAnswered ? "cursor-not-allowed" : ""}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {/* Timer */}
        <div className="flex justify-center">
          <div className={`px-5 py-2 rounded-full text-sm font-mono font-semibold
            border
            ${timeLeft <= 5
              ? "border-red-400 text-red-600 animate-pulse"
              : "border-slate-300 text-slate-700"}`}>
            ⏱ {timeLeft}s
          </div>
        </div>
      </div>
    )}
  </>
);

};

export default DeductiveChallengeUI;

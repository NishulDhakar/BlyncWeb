'use client';

import React from "react";
import { Puzzle, Symbol as GameSymbol } from "@/types/game";
import ResultCard from "../common/Result";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const isTargetCell = (r: number, c: number) =>
    puzzle && puzzle.targetCell.row === r && puzzle.targetCell.col === c;
  const isDistractorCell = (r: number, c: number) =>
    puzzle &&
    puzzle.emptyCells.some((cell: { row: number; col: number }) => cell.row === r && cell.col === c) &&
    !isTargetCell(r, c);

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
            key={puzzle?.targetCell.row}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="w-full max-w-lg mx-auto"
          >
            {/* ── Stats bar ── */}
            <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> {correct}
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <XCircle className="w-4 h-4" /> {wrong}
              </span>
            </div>
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-mono font-semibold transition-colors duration-300",
              timeLeft <= 5
                ? "border-rose-500/50 text-rose-400 bg-rose-500/10 animate-pulse"
                : "border-border/50 text-muted-foreground"
            )}>
              <Timer className="w-3.5 h-3.5" />
              {timeLeft}s
            </div>
          </div>

            {/* ── Main card ── */}
            <div className={cn(
              "rounded-2xl border bg-card transition-colors duration-300",
              isAnswered
                ? isCorrect ? "border-emerald-500/40" : "border-rose-500/40"
                : "border-border/50"
            )}>
              <div className="p-6 md:p-8 space-y-6">
              {/* Prompt */}
              <div className="text-center">
                <h3 className="text-base font-semibold text-foreground">Find the Missing Symbol</h3>
                <p className="text-sm text-muted-foreground mt-1">Analyze the pattern and choose the correct option</p>
              </div>

              {/* Puzzle grid */}
              {puzzle && (
                <div className="flex justify-center">
                  <div
                    className="grid gap-2 p-4 rounded-xl bg-muted/30 border border-border/40"
                    style={{ gridTemplateColumns: `repeat(${puzzle.grid.length}, 1fr)` }}
                  >
                    {puzzle.grid.map((row, rIdx) =>
                      row.map((cell, cIdx) => {
                        if (isTargetCell(rIdx, cIdx)) {
                          return (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              className="w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-lg border-2 border-primary bg-primary/10 text-primary text-xl font-bold"
                            >
                              ?
                            </div>
                          );
                        }
                        if (isDistractorCell(rIdx, cIdx)) {
                          return (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              className="w-11 h-11 md:w-13 md:h-13 rounded-lg bg-muted/50"
                            />
                          );
                        }
                        return (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className="w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-lg bg-muted/40 border border-border/40 text-lg font-semibold"
                          >
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
                <div className="grid grid-cols-2 gap-3">
                  {puzzle.options.map((option, idx) => {
                    const isSelected = selected === option;
                    const showResult = isAnswered && isSelected;

                    return (
                      <motion.button
                        key={`${option}-${idx}`}
                        whileHover={!isAnswered ? { scale: 1.02 } : {}}
                        whileTap={!isAnswered ? { scale: 0.97 } : {}}
                        onClick={() => handleSelect(option)}
                        disabled={isAnswered}
                        className={cn(
                          "h-14 rounded-xl text-xl font-bold border transition-all duration-200",
                          showResult
                            ? isCorrect
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                              : "bg-rose-500/15 border-rose-500 text-rose-400"
                            : isAnswered
                              ? "bg-muted/30 border-border/30 text-foreground/30 cursor-default"
                              : "bg-muted/40 border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                        )}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
              )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default DeductiveChallengeUI;

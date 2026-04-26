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
            {/* Feedback strip */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-t-2xl text-sm font-semibold border-b",
                    isCorrect
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  )}
                >
                  {isCorrect
                    ? <><CheckCircle2 className="w-4 h-4" /> Good deduction!</>
                    : <><XCircle className="w-4 h-4" /> Try the next one.</>
                  }
                </motion.div>
              )}
            </AnimatePresence>

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
      )}
    </>
  );
};

export default DeductiveChallengeUI;

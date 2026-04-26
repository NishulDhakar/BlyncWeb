"use client";

import React from "react";
import { DigitProblem } from "@/features/digit-challenge/gameLogic";
import ResultCard from "../common/Result";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Timer, Delete } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  problem: DigitProblem | null;
  userDigits: number[];
  timeLeft: number;
  sessionTime: number;
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctCount: number;
  wrongCount: number;
  gameStatus: "playing" | "results";
  handleDigitClick: (d: number) => void;
  handleDelete: () => void;
  handleSubmit: () => void;
  resetGame: () => void;
}

export default function DigitChallengeUI({
  problem,
  userDigits,
  timeLeft,
  isAnswered,
  isCorrect,
  correctCount,
  wrongCount,
  gameStatus,
  handleDigitClick,
  handleDelete,
  handleSubmit,
  resetGame,
}: Props) {
  const router = useRouter();

  if (!problem) return null;

  if (gameStatus === "results") {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <ResultCard
          correct={correctCount}
          wrong={wrongCount}
          resetGame={resetGame}
          onCheckRank={() => router.push("/leaderboard")}
        />
      </div>
    );
  }

  const used = new Set(userDigits);

  return (
    <div className="flex justify-center px-4 py-8">
      <motion.div
        key={problem.target}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
        className="w-full max-w-sm"
      >
        {/* ── Stats bar ── */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-3 text-sm font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> {correctCount}
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <XCircle className="w-4 h-4" /> {wrongCount}
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
                  ? <><CheckCircle2 className="w-4 h-4" /> Correct! Nice reasoning.</>
                  : <><XCircle className="w-4 h-4" /> You'll get the next one.</>
                }
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-6 space-y-6">
            {/* Equation with blanks */}
            <div className="text-center space-y-1.5">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {problem.tokens.map((t, i) => {
                  if (t === "_") {
                    const blankIndex =
                      problem.tokens.slice(0, i + 1).filter((x) => x === "_").length - 1;
                    const val = userDigits[blankIndex];
                    return (
                      <div
                        key={i}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-bold border-2 transition-colors",
                          val !== undefined
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/60 bg-muted/40 text-muted-foreground"
                        )}
                      >
                        {val ?? ""}
                      </div>
                    );
                  }
                  return (
                    <span key={i} className="text-xl font-semibold text-foreground/80">
                      {t}
                    </span>
                  );
                })}
                <span className="text-xl font-semibold text-foreground/60">=</span>
                <span className="text-xl font-bold text-primary">{problem.target}</span>
              </div>
              <p className="text-xs text-muted-foreground">Use each digit only once</p>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                const disabled = used.has(n) || isAnswered;
                return (
                  <motion.button
                    key={n}
                    whileHover={!disabled ? { scale: 1.04 } : {}}
                    whileTap={!disabled ? { scale: 0.96 } : {}}
                    disabled={disabled}
                    onClick={() => handleDigitClick(n)}
                    className={cn(
                      "h-13 rounded-xl font-mono text-lg font-bold border transition-all duration-150",
                      disabled
                        ? "bg-muted/20 border-border/20 text-foreground/20 cursor-not-allowed"
                        : "bg-muted/40 border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                    )}
                  >
                    {n}
                  </motion.button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2.5">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleDelete}
                disabled={isAnswered || userDigits.length === 0}
                className={cn(
                  "h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold border transition-all",
                  isAnswered || userDigits.length === 0
                    ? "bg-muted/20 border-border/20 text-foreground/30 cursor-not-allowed"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                )}
              >
                <Delete className="w-4 h-4" /> Delete
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={isAnswered || userDigits.length !== problem.blanks}
                className={cn(
                  "h-11 rounded-xl text-sm font-semibold border transition-all",
                  isAnswered || userDigits.length !== problem.blanks
                    ? "bg-muted/20 border-border/20 text-foreground/30 cursor-not-allowed"
                    : "bg-primary text-primary-foreground border-primary hover:bg-primary/90 cursor-pointer"
                )}
              >
                Submit
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import { DigitProblem } from "@/features/digit-challenge/gameLogic";
import ResultCard from "../common/Result";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Timer, Delete } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameSounds } from "@/lib/useGameSounds";

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
  const { play } = useGameSounds();
  const prevAnswered = useRef(false);
  const prevStatus = useRef(gameStatus);
  const prevTime = useRef(timeLeft);

  useEffect(() => {
    if (isAnswered && !prevAnswered.current) play(isCorrect ? 'correct' : 'wrong');
    prevAnswered.current = isAnswered;
  }, [isAnswered, isCorrect, play]);

  useEffect(() => {
    if (gameStatus === 'results' && prevStatus.current !== 'results') play('gameOver');
    prevStatus.current = gameStatus;
  }, [gameStatus, play]);

  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0 && timeLeft < prevTime.current) play('tick');
    prevTime.current = timeLeft;
  }, [timeLeft, play]);

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
                    onClick={() => { play('keypress'); handleDigitClick(n); }}
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
                onClick={() => { play('keypress'); handleDelete(); }}
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
                onClick={() => { play('submit'); handleSubmit(); }}
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
      </>
    </div>
  );
}

'use client';

import React, { useEffect } from "react";
import { SwitchPuzzle } from "@/features/switch-challenge/gameLogic";
import ResultCard from "../common/Result";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  puzzle: SwitchPuzzle | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  selected: string | null;
  handleSelect: (op: string) => void;
  timeLeft: number;
  gameStatus: "playing" | "results";
  correct: number;
  resetGame: () => void;
  wrong: number;
}

const SwitchChallengeUI: React.FC<Props> = ({
  puzzle,
  isAnswered,
  isCorrect,
  selected,
  handleSelect,
  timeLeft,
  gameStatus,
  correct,
  resetGame,
  wrong,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (isAnswered && isCorrect) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.55 }, colors: ["#34d399", "#10b981"] });
    }
  }, [isAnswered, isCorrect]);

  if (!puzzle) return null;

  return (
    <div className="px-4 py-8 min-h-[600px] flex items-center justify-center">
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
            key={puzzle.input.join("")}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="w-full max-w-lg"
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

              {/* Timer */}
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
                ? isCorrect
                  ? "border-emerald-500/40"
                  : "border-rose-500/40"
                : "border-border/50"
            )}>

            <div className="p-6 md:p-8 space-y-7">
              {/* ── Input / Output chips ── */}
              <div className="flex flex-wrap justify-center gap-3">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Input
                  </span>
                  <div className="px-5 py-2.5 rounded-xl bg-muted/50 border border-border/50">
                    <span className="font-mono font-bold text-lg tracking-widest text-foreground">
                      {puzzle.input.join(" ")}
                    </span>
                  </div>
                </div>

                {puzzle.layers === 2 && (
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Operator 1
                    </span>
                    <div className="px-5 py-2.5 rounded-xl bg-muted/50 border border-border/50">
                      <span className="font-mono font-bold text-lg tracking-widest text-foreground">
                        {puzzle.operators[0].join(" ")}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Output
                  </span>
                  <div className="px-5 py-2.5 rounded-xl bg-muted/50 border border-border/50">
                    <span className="font-mono font-bold text-lg tracking-widest text-foreground">
                      {puzzle.output.join(" ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Question */}
              <p className="text-center text-sm font-medium text-muted-foreground">
                Which operator produces this output?
              </p>

              {/* ── Answer options ── */}
              <div className="grid grid-cols-2 gap-3">
                {puzzle.options.map((op) => {
                  const isSelected = selected === op;
                  const showResult = isAnswered && isSelected;

                  return (
                    <motion.button
                      key={op}
                      whileHover={!isAnswered ? { scale: 1.02 } : {}}
                      whileTap={!isAnswered ? { scale: 0.97 } : {}}
                      onClick={() => handleSelect(op)}
                      disabled={isAnswered}
                      className={cn(
                        "h-14 md:h-16 rounded-xl font-mono text-xl font-bold border transition-all duration-200",
                        showResult
                          ? isCorrect
                            ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                            : "bg-rose-500/15 border-rose-500 text-rose-400"
                          : isAnswered
                            ? "bg-muted/30 border-border/30 text-foreground/30 cursor-default"
                            : "bg-muted/40 border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                      )}
                    >
                      {op}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
            </motion.div>
        </>
      )}
    </div>
  );
};

export default SwitchChallengeUI;

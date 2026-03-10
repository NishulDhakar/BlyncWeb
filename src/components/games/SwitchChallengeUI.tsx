'use client';

import React, { useEffect } from "react";
import { SwitchPuzzle } from "@/features/switch-challenge/gameLogic";
import ResultCard from "../common/Result";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Timer, CheckCircle, XCircle } from "lucide-react";

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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34d399', '#10b981', '#059669']
      });
    }
  }, [isAnswered, isCorrect]);

  if (!puzzle) return null;

  const options: string[] = puzzle.options;

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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-12 border border-white/20 relative overflow-hidden ring-1 ring-black/5"
        >
          {/* Background Decorative Blobs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

          {/* Feedback Overlay */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-md rounded-3xl transition-colors duration-300 ${isCorrect ? 'bg-emerald-50/90' : 'bg-rose-50/90'
                  }`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className={`mb-6 p-6 rounded-full shadow-lg ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}
                >
                  {isCorrect ? <CheckCircle size={64} /> : <XCircle size={64} />}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <h2 className={`text-4xl font-extrabold mb-2 ${isCorrect ? 'text-emerald-800' : 'text-rose-800'
                    }`}>
                    {isCorrect ? 'Excellent!' : 'Incorrect'}
                  </h2>
                  <p className={`text-lg font-medium ${isCorrect ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                    {isCorrect ? 'Keep up the momentum!' : 'Don’t worry, try the next one.'}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Puzzle Info */}
          <div className="text-center mb-10 space-y-4 relative z-10">
            <div className="flex justify-center flex-wrap gap-4 text-lg">
              <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <span className="text-slate-400 font-medium text-xs uppercase tracking-wider block mb-1">Input</span>
                <span className="font-mono font-bold text-slate-800 text-xl">{puzzle.input.join(" ")}</span>
              </div>

              {puzzle.layers === 2 && (
                <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <span className="text-slate-400 font-medium text-xs uppercase tracking-wider block mb-1">First Operator</span>
                  <span className="font-mono font-bold text-slate-800 text-xl">{puzzle.operators[0].join(" ")}</span>
                </div>
              )}

              <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <span className="text-slate-400 font-medium text-xs uppercase tracking-wider block mb-1">Output</span>
                <span className="font-mono font-bold text-slate-800 text-xl">{puzzle.output.join(" ")}</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-700 mt-6">
              Which operator produces this output?
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 relative z-10">
            {options.map((op, idx) => {
              const isSelected = selected === op;
              const showResult = isAnswered && isSelected;

              return (
                <motion.button
                  whileHover={!isAnswered ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  key={op}
                  onClick={() => handleSelect(op)}
                  disabled={isAnswered}
                  className={`
                    relative h-16 md:h-20 rounded-2xl text-xl md:text-2xl font-bold shadow-sm transition-all duration-300
                    border-[1.5px] overflow-hidden group
                    ${showResult
                      ? isCorrect
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-emerald-100" // Correct state styling handled by overlay mostly, but keep meaningful base
                        : "bg-rose-50 border-rose-400 text-rose-700 shadow-rose-100"
                      : "bg-white border-slate-200 text-slate-600 hover:border-primary/50 hover:shadow-lg hover:text-primary"
                    }
                    ${isAnswered ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  <span className="relative z-10">{op}</span>
                  {!isAnswered && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Timer */}
          <div className="flex justify-center relative z-10">
            <div className={`
              flex items-center space-x-3 px-6 py-3 rounded-full border-2 transition-colors duration-300 shadow-sm
              ${timeLeft <= 5
                ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-600'
              }
            `}>
              <Timer className={`w-5 h-5 ${timeLeft <= 5 ? 'animate-bounce' : ''}`} />
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-70 leading-none mb-0.5">Time Left</span>
                <span className="font-mono text-xl font-bold leading-none">{timeLeft}s</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SwitchChallengeUI;

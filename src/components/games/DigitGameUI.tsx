"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DigitProblem } from "@/features/digit-challenge/gameLogic";
import ResultCard from "../common/Result";
import { useRouter } from "next/navigation";

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

  // Results screen
  if (gameStatus === "results") {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <ResultCard correct={correctCount} wrong={wrongCount} resetGame={resetGame} onCheckRank={() => router.push("/leaderboard")} />
      </div>
    );
  }

  const used = new Set(userDigits);

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-md relative">

        {/* Feedback Overlay */}
        {isAnswered && (
          <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl
          backdrop-blur-md transition-all
          ${isCorrect ? "bg-emerald-50/80" : "bg-rose-50/80"}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4
            ${isCorrect ? "bg-emerald-100" : "bg-rose-100"}`}>
              <span className={`text-4xl font-bold ${isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                {isCorrect ? "✓" : "✗"}
              </span>
            </div>
            <h3 className="text-2xl font-bold">
              {isCorrect ? "Correct!" : "Wrong!"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isCorrect ? "Nice reasoning!" : "You’ll get the next one."}
            </p>
          </div>
        )}

        {/* Main Card */}
        <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl
        border border-white/40
        shadow-[0_20px_60px_rgba(0,0,0,0.12)]
        p-6 md:p-8">

          {/* Equation */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
              {problem.tokens.map((t, i) => {
                if (t === "_") {
                  const blankIndex =
                    problem.tokens.slice(0, i + 1).filter(x => x === "_").length - 1;
                  const val = userDigits[blankIndex];
                  return (
                    <div
                      key={i}
                      className="w-14 h-14 rounded-xl flex items-center justify-center
                      bg-white shadow-sm border border-slate-200 text-xl font-bold"
                    >
                      {val ?? ""}
                    </div>
                  );
                }
                return <span key={i}>{t}</span>;
              })}
              <span>=</span>
              <span className="font-bold text-primary">{problem.target}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Use each digit only once
            </p>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
              const disabled = used.has(n) || isAnswered;
              return (
                <Button
                  key={n}
                  disabled={disabled}
                  onClick={() => handleDigitClick(n)}
                  className={`h-14 rounded-xl text-lg font-semibold
                  ${disabled
                      ? "opacity-40"
                      : "hover:scale-[1.03] transition-transform"
                    }`}
                >
                  {n}
                </Button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleDelete}
              disabled={isAnswered}
              variant="destructive"
              className="w-full rounded-xl"
            >
              Delete
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isAnswered || userDigits.length !== problem.blanks}
              className="w-full h-12 rounded-xl text-base font-semibold"
            >
              Submit
            </Button>
          </div>

          {/* Footer Stats */}
          <div className="mt-6 flex justify-between text-xs text-muted-foreground">
            <span>Blanks: {problem.blanks}</span>
            <span>
              Time:{" "}
              <strong className={timeLeft <= 5 ? "text-red-600 animate-pulse" : ""}>
                {timeLeft}s
              </strong>
            </span>
          </div>

          <div className="mt-4 flex justify-between">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Correct</div>
              <div className="font-bold">{correctCount}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Wrong</div>
              <div className="font-bold">{wrongCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

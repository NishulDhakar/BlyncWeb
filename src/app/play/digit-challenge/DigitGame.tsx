"use client";

import { useEffect, useState } from "react";
import Container from "@/components/common/Container";
import GamePage from "@/components/common/GamePage";
import { generateDigitProblem, checkAnswer, DigitProblem } from "@/features/digit-challenge/gameLogic";
import DigitChallengeUI from "@/components/games/DigitGameUI";
import { saveScore } from "@/features/scoring/actions";
import Image from "next/image";

const TIME_PER_QUESTION = 30;
const SESSION_TIME = 180;
const MAX_WRONG = 3;

export default function DigitGame() {
  const [level, setLevel] = useState(1);
  const [problem, setProblem] = useState<DigitProblem | null>(null);
  const [userDigits, setUserDigits] = useState<number[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [sessionTime, setSessionTime] = useState(SESSION_TIME);
  const [gameStatus, setGameStatus] = useState<"playing" | "results">("playing");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isScoreSaved, setIsScoreSaved] = useState(false);

  useEffect(() => {
    if (gameStatus === "results" && !isScoreSaved) {
      saveScore("digit-challenge", correctCount);
      setIsScoreSaved(true);
    }
  }, [gameStatus, correctCount, isScoreSaved]);

  useEffect(() => {
    if (gameStatus !== "playing") return;
    const p = generateDigitProblem(level);
    setProblem(p);
    setUserDigits([]);
    setIsAnswered(false);
    setIsCorrect(null);
    setTimeLeft(TIME_PER_QUESTION);
  }, [level, gameStatus]);

  useEffect(() => {
    if (gameStatus !== "playing" || isAnswered) return;
    if (timeLeft <= 0) {
      markWrongAndNext();
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, isAnswered, gameStatus]);

  useEffect(() => {
    if (gameStatus !== "playing") return;
    if (sessionTime <= 0) {
      setGameStatus("results");
      return;
    }
    const t = setTimeout(() => setSessionTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sessionTime, gameStatus]);

  const markWrongAndNext = () => {
    setIsAnswered(true);
    setIsCorrect(false);
    setWrongCount((w) => {
      const nw = w + 1;
      if (nw >= MAX_WRONG) setGameStatus("results");
      return nw;
    });
    setTimeout(() => setLevel((l) => l + 1), 900);
  };

  const handleDigitClick = (d: number) => {
    if (!problem || isAnswered) return;
    if (userDigits.length >= problem.blanks) return;
    if (userDigits.includes(d)) return;
    setUserDigits((u) => [...u, d]);
  };

  const handleDelete = () => {
    if (isAnswered) return;
    setUserDigits((u) => u.slice(0, -1));
  };

  const handleSubmit = () => {
    if (!problem || isAnswered) return;
    if (userDigits.length !== problem.blanks) return;
    const { ok } = checkAnswer(problem, userDigits);
    setIsAnswered(true);
    setIsCorrect(ok);
    if (ok) {
      setCorrectCount((c) => c + 1);
    } else {
      setWrongCount((w) => {
        const nw = w + 1;
        if (nw >= MAX_WRONG) setGameStatus("results");
        return nw;
      });
    }
    setTimeout(() => {
      if (gameStatus === "playing") setLevel((l) => l + 1);
    }, 900);
  };

  const resetGame = () => {
    setLevel(1);
    setCorrectCount(0);
    setWrongCount(0);
    setSessionTime(SESSION_TIME);
    setGameStatus("playing");
    setIsAnswered(false);
    setIsCorrect(null);
    setUserDigits([]);
    setIsScoreSaved(false);
  };

  const formatTime = (t: number) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  return (
    <div>
      {/* <div className="fixed inset-0">
        <Image src="/game.jpg" alt="Background" fill priority className="object-cover" />
      </div> */}
      <div className="fixed inset-0 -z-0 bg-black/20" />
      <Container>
        <GamePage title="Digit Challenge" level={level} timer={formatTime(sessionTime)}>
          <DigitChallengeUI
            problem={problem}
            userDigits={userDigits}
            timeLeft={timeLeft}
            sessionTime={sessionTime}
            isAnswered={isAnswered}
            isCorrect={isCorrect}
            correctCount={correctCount}
            wrongCount={wrongCount}
            gameStatus={gameStatus}
            handleDigitClick={handleDigitClick}
            handleDelete={handleDelete}
            handleSubmit={handleSubmit}
            resetGame={resetGame}
          />
        </GamePage>
      </Container>
    </div>
  );
}

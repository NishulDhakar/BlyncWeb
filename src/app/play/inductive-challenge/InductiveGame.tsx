"use client";

import { useState, useEffect } from "react";
import { generatePuzzle, checkAnswer, InductivePuzzle } from "@/features/inductive-challenge/gameLogic";
import Container from "@/components/common/Container";
import GamePage from "@/components/common/GamePage";
import InductiveChallengeUI from "@/components/games/InductiveChallengeUI";
import { formatTime } from "@/lib/gameUtils";
import { saveScore } from "@/features/scoring/actions";

const TIME_PER_QUESTION = 30;
const SESSION_TIME = 180;

export default function InductiveGame() {
  const [level, setLevel] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [puzzle, setPuzzle] = useState<InductivePuzzle | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [sessionTime, setSessionTime] = useState(SESSION_TIME);
  const [gameStatus, setGameStatus] = useState<"playing" | "results">("playing");
  const [isScoreSaved, setIsScoreSaved] = useState(false);

  useEffect(() => {
    if (gameStatus === "results" && !isScoreSaved) {
      saveScore("inductive-challenge", correct);
      setIsScoreSaved(true);
    }
  }, [gameStatus, correct, isScoreSaved]);

  useEffect(() => {
    setPuzzle(generatePuzzle(level));
    setSelected(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setTimeLeft(TIME_PER_QUESTION);
  }, [level]);

  // Per-question countdown
  useEffect(() => {
    if (gameStatus !== "playing" || isAnswered) return;
    if (timeLeft <= 0) {
      setIsAnswered(true);
      setIsCorrect(false);
      setWrong((w) => w + 1);
      setTimeout(() => setLevel((l) => l + 1), 1800);
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, isAnswered, gameStatus]);

  // Session countdown
  useEffect(() => {
    if (gameStatus !== "playing") return;
    if (sessionTime <= 0) {
      setGameStatus("results");
      return;
    }
    const t = setTimeout(() => setSessionTime((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [sessionTime, gameStatus]);

  const handleSelect = (index: number) => {
    if (isAnswered || !puzzle) return;
    setSelected(index);
    const isRight = checkAnswer(puzzle, index);
    setIsCorrect(isRight);
    setIsAnswered(true);
    if (isRight) setCorrect((c) => c + 1);
    else setWrong((w) => w + 1);
    setTimeout(() => setLevel((l) => l + 1), 1800);
  };

  const resetGame = () => {
    setLevel(1);
    setCorrect(0);
    setWrong(0);
    setSessionTime(SESSION_TIME);
    setGameStatus("playing");
    setIsScoreSaved(false);
  };

  return (
    <Container>
      <GamePage title="Inductive Challenge" level={level} timer={formatTime(sessionTime)}>
        <InductiveChallengeUI
          puzzle={puzzle}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
          selected={selected}
          handleSelect={handleSelect}
          timeLeft={timeLeft}
          gameStatus={gameStatus}
          correct={correct}
          wrong={wrong}
          resetGame={resetGame}
          level={level}
        />
      </GamePage>
    </Container>
  );
}

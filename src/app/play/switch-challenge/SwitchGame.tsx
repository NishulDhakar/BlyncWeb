"use client";

import { useState, useEffect } from "react";
import { generateSwitchPuzzle, checkSwitchAnswer, SwitchPuzzle } from "@/features/switch-challenge/gameLogic";
import Container from "@/components/common/Container";
import GamePage from "@/components/common/GamePage";
import SwitchChallengeUI from "@/components/games/SwitchChallengeUI";
import { formatTime } from "@/lib/gameUtils";
import { saveScore } from "@/features/scoring/actions";

const TIME_PER_QUESTION = 20;
const SESSION_TIME = 180;

export default function SwitchGame() {
  const [level, setLevel] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [puzzle, setPuzzle] = useState<SwitchPuzzle | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [sessionTime, setSessionTime] = useState(SESSION_TIME);
  const [gameStatus, setGameStatus] = useState<"playing" | "results">("playing");
  const [isScoreSaved, setIsScoreSaved] = useState(false);

  useEffect(() => {
    if (gameStatus === "results" && !isScoreSaved) {
      saveScore("switch-challenge", correct);
      setIsScoreSaved(true);
    }
  }, [gameStatus, correct, isScoreSaved]);

  useEffect(() => {
    setPuzzle(generateSwitchPuzzle(level));
    setSelected(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setTimeLeft(TIME_PER_QUESTION);
  }, [level]);

  useEffect(() => {
    if (gameStatus !== "playing" || isAnswered) return;
    if (timeLeft <= 0) {
      setIsAnswered(true);
      setIsCorrect(false);
      setWrong((w) => w + 1);
      setTimeout(() => setLevel((l) => l + 1), 1200);
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
    const t = setTimeout(() => setSessionTime((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [sessionTime, gameStatus]);

  const handleSelect = (op: string) => {
    if (isAnswered || !puzzle) return;
    setSelected(op);
    const correctAns = checkSwitchAnswer(puzzle, op);
    setIsCorrect(correctAns);
    setIsAnswered(true);
    if (correctAns) setCorrect((c) => c + 1);
    else setWrong((w) => w + 1);
    setTimeout(() => setLevel((l) => l + 1), 1200);
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
      <GamePage title="Switch Operator Challenge" level={level} timer={formatTime(sessionTime)}>
        <SwitchChallengeUI
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
        />
      </GamePage>
    </Container>
  );
}

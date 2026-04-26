"use client";

import { useState, useEffect } from "react";
import Container from "@/components/common/Container";
import GamePage from "@/components/common/GamePage";
import MotionChallengeUI from "@/components/games/MotionChallenge/MotionChallengeUI";
import { formatTime } from "@/lib/gameUtils";
import { saveScore } from "@/features/scoring/actions";

const SESSION_TIME = 240;

export default function MotionGame() {
  const [gameKey, setGameKey] = useState(0);
  const [level, setLevel] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [sessionTime, setSessionTime] = useState(SESSION_TIME);
  const [gameStatus, setGameStatus] = useState<"playing" | "results">("playing");
  const [isScoreSaved, setIsScoreSaved] = useState(false);

  useEffect(() => {
    if (gameStatus === "results" && !isScoreSaved) {
      const finalScore = correct * 4 - wrong;
      saveScore("motion-challenge", Math.max(0, finalScore));
      setIsScoreSaved(true);
    }
  }, [gameStatus, correct, wrong, isScoreSaved]);

  useEffect(() => {
    if (gameStatus !== "playing") return;
    if (sessionTime <= 0) {
      setGameStatus("results");
      return;
    }
    const t = setTimeout(() => setSessionTime((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [sessionTime, gameStatus]);

  const handleLevelComplete = () => {
    if (gameStatus !== "playing") return;
    setCorrect((c) => c + 1);
    setLevel((l) => l + 1);
  };

  const handleSkipLevel = () => {
    if (gameStatus !== "playing") return;
    setWrong((w) => w + 1);
    setLevel((l) => l + 1);
  };

  const resetGame = () => {
    setGameKey((k) => k + 1);
    setLevel(1);
    setCorrect(0);
    setWrong(0);
    setSessionTime(SESSION_TIME);
    setGameStatus("playing");
    setIsScoreSaved(false);
  };

  return (
    <Container>
      <GamePage title="Motion Challenge" level={level} timer={formatTime(sessionTime)}>
        <MotionChallengeUI
          key={gameKey}
          levelIndex={level - 1}
          onLevelComplete={handleLevelComplete}
          onSkipLevel={handleSkipLevel}
          gameStatus={gameStatus}
          correct={correct}
          wrong={wrong}
          resetGame={resetGame}
        />
      </GamePage>
    </Container>
  );
}

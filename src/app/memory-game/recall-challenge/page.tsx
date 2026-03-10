"use client";

import { useState, useEffect, useCallback } from "react";


import Container from "@/components/common/Container";
import MemoryChallengeFirstUI from "@/components/memory-games/RecallChallengeFirstUI";
import Image from "next/image";
import confetti from "canvas-confetti";
import { ColorItem, generateLevelColors, LEVELS, pickTargetColor } from "./gameLogic";

/* ------------------------------------------------------------------ */
/* Game States */
/* ------------------------------------------------------------------ */

type GameState = "idle" | "memorizing" | "selecting" | "result" | "game_over";

/* ------------------------------------------------------------------ */
/* Page */
/* ------------------------------------------------------------------ */

export default function MemoryChallengeFirstPage() {
    const [level, setLevel] = useState(1);
    const [gameState, setGameState] = useState<GameState>("idle");

    const [colors, setColors] = useState<ColorItem[]>([]);
    const [target, setTarget] = useState<ColorItem | null>(null);

    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [lives, setLives] = useState(3);

    const [memoTimeLeft, setMemoTimeLeft] = useState(0);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const currentConfig =
        LEVELS.find(l => l.level === level) ?? LEVELS[0];

    /* ------------------------------------------------------------------ */
    /* Start Level */
    /* ------------------------------------------------------------------ */

    const startLevel = useCallback((lvl: number) => {
        const config = LEVELS.find(l => l.level === lvl) ?? LEVELS[0];
        const levelColors = generateLevelColors(config.count);

        setColors(levelColors);
        setTarget(pickTargetColor(levelColors));
        setMemoTimeLeft(config.memoTime);
        setSelectedId(null);
        setIsCorrect(null);
        setGameState("memorizing");
    }, []);

    /* ------------------------------------------------------------------ */
    /* Auto Start + Restart */
    /* ------------------------------------------------------------------ */

    const startGame = useCallback(() => {
        setLevel(1);
        setScore(0);
        setStreak(0);
        setLives(3);
        startLevel(1);
    }, [startLevel]);

    const resetGame = () => {
        startGame();
    };

    useEffect(() => {
        if (colors.length === 0) {
            startGame();
        }
    }, [startGame, colors.length]);

    /* ------------------------------------------------------------------ */
    /* Memorization Timer */
    /* ------------------------------------------------------------------ */

    useEffect(() => {
        if (gameState !== "memorizing") return;

        if (memoTimeLeft <= 0) {
            // Only transition to selecting if we actually have colors loaded
            if (colors.length > 0) {
                setGameState("selecting");
            }
            return;
        }

        const timer = setTimeout(() => {
            setMemoTimeLeft(t => Math.max(0, t - 100));
        }, 100);

        return () => clearTimeout(timer);
    }, [memoTimeLeft, gameState, colors.length]);

    /* ------------------------------------------------------------------ */
    /* Handle Selection */
    /* ------------------------------------------------------------------ */

    const handleSelect = (id: number) => {
        if (gameState !== "selecting" || !target) return;

        const correct = id === target.id;

        setSelectedId(id);
        setIsCorrect(correct);
        setGameState("result");

        if (correct) {
            const bonus = currentConfig.bonus + streak * 20;
            setScore(s => s + bonus);
            setStreak(s => s + 1);

            confetti({
                particleCount: 40,
                spread: 35,
                origin: { y: 0.75 },
                colors: ["#10b981", "#34d399"]
            });
        } else {
            setStreak(0);
            setLives(prev => prev - 1);
        }

        setTimeout(() => {
            if (!correct && lives <= 1) {
                setGameState("game_over");
                return;
            }

            // If incorrect but still has lives, repeat current level or go next? 
            // Usually, games like this might give a new target for the same level or just continue. 
            // Let's stay on current difficulty (restart level) if lost a life.
            if (!correct) {
                startLevel(level);
                return;
            }

            if (level < LEVELS.length) {
                const nextLevel = level + 1;
                setLevel(nextLevel);
                startLevel(nextLevel);
            } else {
                setGameState("game_over");
            }
        }, 1200);
    };

    /* ------------------------------------------------------------------ */
    /* UI */
    /* ------------------------------------------------------------------ */

    return (
        <div className="min-h-screen relative flex items-center justify-center">
            {/* Background */}
            <div className="fixed inset-0 backdrop-blur-sm">
                <Image
                    src="/bgg.jpg"
                    alt="Background"
                    fill
                    priority
                    className="object-cover backdrop-blur-sm "
                />
                <div className="absolute inset-0 backdrop-blur-sm" />
            </div>
<Container>
    <MemoryChallengeFirstUI
        gameState={gameState}
        colors={colors}
        target={target}
        onSelect={handleSelect}
        score={score}
        streak={streak}
        gridCols={currentConfig.gridCols}
        selectedId={selectedId}
        isCorrect={isCorrect}
        resetGame={resetGame}
        startGame={startGame}
        lives={lives}
        timer={
            gameState === "memorizing"
                ? `${(memoTimeLeft / 1000).toFixed(1)}s`
                : "--"
        }
    />
</Container>

        </div>
    );
}

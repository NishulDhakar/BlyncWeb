'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MemoryChallengeUI from '@/components/memory-games/MemoryChallengeUI';
import Container from '@/components/common/Container';
import GamePage from '@/components/common/GamePage';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
    Heart, Star, Zap, Cloud, Moon, Sun,
    Music, Anchor, Bell, Snowflake, Ghost, Gamepad2
} from 'lucide-react';

// --- Constants & Config ---

const COLORS = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500',
    'bg-indigo-500', 'bg-rose-500', 'bg-cyan-500', 'bg-lime-500'
];

const ICONS = [
    Heart, Star, Zap, Cloud, Moon, Sun,
    Music, Anchor, Bell, Snowflake, Ghost, Gamepad2
];

const LEVELS = {
    1: { pairs: 6, gridCols: 3, time: 45, bonus: 100 },  // 3x4
    2: { pairs: 8, gridCols: 4, time: 60, bonus: 200 },  // 4x4
    3: { pairs: 10, gridCols: 5, time: 75, bonus: 300 }, // 4x5
    4: { pairs: 12, gridCols: 6, time: 90, bonus: 400 }, // 4x6
};

export interface CardType {
    id: string;
    colorClass: string;
    Icon: React.ElementType;
    isFlipped: boolean;
    isMatched: boolean;
    colorId: number;
}

const GAME_STATES = {
    IDLE: 'idle',
    PLAYING: 'playing',
    GAME_OVER: 'game_over',
};

// --- Helper Functions ---

const shuffleCards = (numPairs: number): CardType[] => {
    const selectedColors = COLORS.slice(0, numPairs);
    const selectedIcons = ICONS.slice(0, numPairs);
    const cards: CardType[] = [];

    selectedColors.forEach((color, index) => {
        // Create pair
        const Icon = selectedIcons[index];
        cards.push({ id: `card-${index}-a`, colorClass: color, Icon, isFlipped: false, isMatched: false, colorId: index });
        cards.push({ id: `card-${index}-b`, colorClass: color, Icon, isFlipped: false, isMatched: false, colorId: index });
    });

    // Fisher-Yates shuffle
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
};

export default function MemoryChallengePage() {
    // Game State
    const [gameState, setGameState] = useState<string>(GAME_STATES.IDLE);
    const [level, setLevel] = useState<number>(1);
    const [cards, setCards] = useState<CardType[]>([]);
    const [flippedCards, setFlippedCards] = useState<string[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<number>(0);

    // Stats
    const [score, setScore] = useState<number>(0);
    const [moves, setMoves] = useState<number>(0);
    const [streak, setStreak] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [highScore, setHighScore] = useState<number>(0);

    // --- Game Control ---

    const startGame = useCallback((lvl: number = 1) => {
        const config = LEVELS[lvl as keyof typeof LEVELS] || LEVELS[1];
        const newCards = shuffleCards(config.pairs);

        setCards(newCards);
        setGameState(GAME_STATES.PLAYING);
        setFlippedCards([]);
        setMatchedPairs(0);
        setMoves(0);
        setStreak(0);
        setTimeLeft(config.time);

        if (lvl === 1) setScore(0);
    }, []);

    const resetGame = () => {
        startGame(1);
        setLevel(1);
    };

    const nextLevel = () => {
        const nextLvl = level + 1;
        if (LEVELS[nextLvl as keyof typeof LEVELS]) {
            setLevel(nextLvl);
            startGame(nextLvl);
        } else {
            endGame(true);
        }
    };

    const endGame = useCallback((victory: boolean) => {
        setGameState(GAME_STATES.GAME_OVER);
        if (victory) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#8b5cf6', '#d946ef', '#06b6d4']
            });
        }
        if (score > highScore) setHighScore(score);
    }, [score, highScore]);

    // --- Logic : Timer ---

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === GAME_STATES.PLAYING && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endGame(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, endGame]);

    // --- Logic : Checking Matches ---

    const handleCardClick = (id: string) => {
        if (gameState !== GAME_STATES.PLAYING) return;

        const clickedCard = cards.find(c => c.id === id);
        if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

        if (flippedCards.length >= 2) return;

        // Flip
        const newCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
        setCards(newCards);

        const newFlipped = [...flippedCards, id];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            checkForMatch(newFlipped, newCards);
        }
    };

    const checkForMatch = (currentFlipped: string[], currentCards: CardType[]) => {
        const [id1, id2] = currentFlipped;
        const card1 = currentCards.find(c => c.id === id1);
        const card2 = currentCards.find(c => c.id === id2);

        if (card1 && card2 && card1.colorId === card2.colorId) {
            // Match
            setTimeout(() => {
                setCards(prevCards =>
                    prevCards.map(c =>
                        (c.id === id1 || c.id === id2)
                            ? { ...c, isMatched: true, isFlipped: true }
                            : c
                    )
                );
                setFlippedCards([]);
                setMatchedPairs(prev => {
                    const newTotal = prev + 1;
                    const config = LEVELS[level as keyof typeof LEVELS];

                    if (newTotal === config.pairs) {
                        setScore(s => s + config.bonus + (timeLeft * 10));
                        setTimeout(() => {
                            if (LEVELS[(level + 1) as keyof typeof LEVELS]) {
                                nextLevel();
                            } else {
                                endGame(true);
                            }
                        }, 1000);
                    }
                    return newTotal;
                });

                // Scoring
                const streakBonus = streak * 50;
                setScore(s => s + 100 + streakBonus);
                setStreak(s => s + 1);
            }, 500);
        } else {
            // No Match
            setTimeout(() => {
                setCards(prevCards =>
                    prevCards.map(c =>
                        (c.id === id1 || c.id === id2)
                            ? { ...c, isFlipped: false }
                            : c
                    )
                );
                setFlippedCards([]);
                setStreak(0);
            }, 1000);
        }
    };

    const formatTime = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
    const currentConfig = LEVELS[level as keyof typeof LEVELS] || LEVELS[1];

    return (
        <div className="min-h-screen w-full relative">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/game.jpg"
                    alt="Background"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 pt-24">
                <Container>
                    <GamePage
                        title="Color Match"
                        level={level}
                        timer={formatTime(timeLeft)}
                    >
                        <MemoryChallengeUI
                            cards={cards}
                            onCardClick={handleCardClick}
                            gameState={gameState}
                            gameStatus={gameState === GAME_STATES.PLAYING ? 'playing' : 'results'}
                            score={score}
                            streak={streak}
                            moves={moves}
                            matchedPairs={matchedPairs}
                            resetGame={resetGame}
                            gridCols={currentConfig.gridCols}
                            timeLeft={timeLeft}
                            startGame={() => startGame(1)}
                        />
                    </GamePage>
                </Container>
            </div>
        </div>
    );
}

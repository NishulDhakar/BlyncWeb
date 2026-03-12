'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import ResultCard from '../common/Result';
import { useRouter } from 'next/navigation';
import type { CardType } from '@/features/memory-challenge/types';

interface Props {
    cards: CardType[];
    onCardClick: (id: string) => void;
    gameState: string;
    gameStatus: 'playing' | 'results'; // Aligning with other games if needed, but here we use gameState string from page
    score: number;
    streak: number;
    moves: number;
    matchedPairs: number;
    resetGame: () => void;
    gridCols: number;
    timeLeft: number; // Added to pass to result if needed or for visuals (though GamePage handles main timer)
    startGame: () => void;
}

const MemoryChallengeUI: React.FC<Props> = ({
    cards,
    onCardClick,
    gameState,
    score,
    streak,
    resetGame,
    gridCols,
    matchedPairs,
    moves,
    startGame
}) => {
    const router = useRouter();

    if (gameState === 'idle') {
        return (
            <div className="flex items-center justify-center min-h-[60rem]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg bg-white/50 backdrop-blur-xl rounded-3xl shadow-xl p-10 text-center border border-white/40"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg transform rotate-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 mb-2">Color Memory</h1>
                    <p className="text-slate-600 mb-8 text-lg">Memorize the colors and find the matching pairs!</p>

                    <button
                        onClick={startGame}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl text-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        Start Game
                    </button>
                </motion.div>
            </div>
        );
    }

    if (gameState === 'game_over') {
        return (
            <ResultCard
                correct={matchedPairs}
                wrong={moves - matchedPairs}
                score={score}
                resetGame={resetGame}
                onCheckRank={() => router.push("/leaderboard")}
            />
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto pb-12">

            {/* Stats Bar */}
            <div className="flex justify-between items-center px-4 mb-6">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-lg px-4 py-2 shadow-sm border border-white/40">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score</span>
                    <span className="text-lg font-bold text-slate-800">{score}</span>
                </div>

                {/* Progress/Match Counter */}
                <div className="hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur rounded-lg px-4 py-2 shadow-sm border border-white/40">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pairs</span>
                    <span className="text-lg font-bold text-violet-600">{matchedPairs} / {cards.length / 2}</span>
                </div>

                {streak > 1 && (
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg px-4 py-2 shadow-sm border border-orange-200/50"
                    >
                        <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Streak</span>
                        <span className="text-lg font-bold text-orange-600">x{streak}</span>
                    </motion.div>
                )}
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid gap-3 sm:gap-4 mx-auto perspective-1000"
                style={{
                    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`, // This might need manual overrides for pure CSS responsiveness on very small screens, but dynamic is fine for now
                    maxWidth: matchedPairs > 0 ? '800px' : '600px'
                }}
            >
                <AnimatePresence>
                    {cards.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            onClick={onCardClick}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

// --- Subcomponent: Card ---

interface CardProps {
    card: CardType;
    onClick: (id: string) => void;
}

const Card = ({ card, onClick }: CardProps) => {
    return (
        <motion.div
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative aspect-square cursor-pointer active:scale-95 transition-transform duration-200"
            onClick={() => onClick(card.id)}
            style={{ perspective: 1000 }}
        >
            <motion.div
                className={cn(
                    "w-full h-full relative rounded-2xl shadow-sm border border-black/5 transform-style-3d transition-all duration-500",
                    // card.isMatched ? "opacity-50" : "opacity-100" 
                )}
                animate={{
                    rotateY: card.isFlipped ? 180 : 0,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                {/* Front Face (Hidden initially, Shows Color + Icon) */}
                <div
                    className={cn(
                        "absolute inset-0 w-full h-full rounded-2xl flex items-center justify-center backface-hidden shadow-xl border-2 border-white/20",
                        card.colorClass // Apply the color class
                    )}
                    style={{ transform: "rotateY(180deg)" }}
                >
                    {/* Icon Overlay */}
                    <card.Icon className="w-1/2 h-1/2 text-white/90 drop-shadow-md" />

                    {/* Optional: Add a subtle shine or texture to the color card */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none" />
                </div>

                {/* Back Face (Visible, Uniform) */}
                <div className="absolute inset-0 w-full h-full bg-slate-800 rounded-2xl backface-hidden flex items-center justify-center border-2 border-slate-700/50">
                    {/* Pattern for card back */}
                    <div className="w-full h-full opacity-20 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:12px_12px]" />
                    <div className="absolute w-8 h-8 rounded-full border-2 border-white/10" />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MemoryChallengeUI;

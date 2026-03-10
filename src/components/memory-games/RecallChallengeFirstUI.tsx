'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import ResultCard from '../common/Result';
import { useRouter } from 'next/navigation';
import { ColorItem } from '@/app/memory-game/recall-challenge/gameLogic';

interface Props {
    gameState: string;
    colors: ColorItem[];
    target: ColorItem | null;
    onSelect: (id: number) => void;
    score: number;
    streak: number;
    gridCols: number;
    selectedId: number | null;
    isCorrect: boolean | null;
    resetGame: () => void;
    startGame: () => void;
    lives: number;
    timer: string;
}

const MemoryChallengeFirstUI: React.FC<Props> = ({
    gameState,
    colors,
    target,
    onSelect,
    score,
    streak,
    gridCols,
    selectedId,
    isCorrect,
    resetGame,
    startGame,
    lives,
    timer
}) => {
    const router = useRouter();

    if (gameState === 'game_over') {
        if (gameState === 'game_over') {
            return (
                <div className="w-full min-h-[60vh] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="w-full max-w-md rounded-3xl  backdrop-blur-xl border border-white/60 p-8 text-center"
                    >
                        {/* Title */}
                        <h2 className="text-3xl font-semibold text-white mb-2">
                            Game Over
                        </h2>
                        <p className="text-white/50 text-sm mb-6">
                            Your memory challenge results
                        </p>

                        {/* Score */}
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-widest text-white/40">
                                Final Score
                            </p>
                            <p className="text-5xl font-bold text-white mt-1">
                                {score}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center gap-8 mb-8">
                            {/* <div>
                        <p className="text-xs uppercase tracking-widest text-white/40">
                            Best Streak
                        </p>
                        <p className="text-xl font-semibold text-amber-400">
                            ×{streak}
                        </p>
                    </div> */}

                            {/* <div>
                        <p className="text-xs uppercase tracking-widest text-white/40">
                            Lives Left
                        </p>
                        <p className="text-xl font-semibold text-white">
                            {lives}
                        </p>
                    </div> */}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={resetGame}
                                className="w-full rounded-xl bg-white text-black font-medium py-3 transition hover:bg-white/90"
                            >
                                Play Again
                            </button>

                            <button
                                onClick={() => router.push('/memorygames')}
                                className="w-full rounded-xl border border-white/15 text-white/80 font-medium py-3 transition hover:bg-white/5"
                            >
                                Exit Game
                            </button>
                        </div>
                    </motion.div>
                </div>
            );
        }

    }

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4 ">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex gap-8">
                    <div>
                        <p className="text-md uppercase tracking-widest font-game text-white">Score: {score}</p>
                    </div>

                    {streak > 1 && (
                        <div>
                            <p className="text-md uppercase tracking-widest text-white/40">Streak</p>
                            <p className="text-2xl font-semibold text-amber-400">×{streak}</p>
                        </div>
                    )}
                </div>


                <div className="text-md text-white font-game font-semibold">
                    <p className="text-md uppercase tracking-widest font-game text-white">Time: {timer}</p>
                </div>

                <div className="flex gap-1.5 ">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={false}
                            animate={{
                                scale: i < lives ? 1 : 0.8,
                                opacity: i < lives ? 1 : 0.2
                            }}
                            className="text-2xl"
                        >
                            ❤️
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Instruction */}
            <motion.h2
                key={gameState}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-xl md:text-2xl font-medium text-white mb-12 "
            >
                {gameState === 'memorizing'
                    ? 'Memorize the colors'
                    : <>Select the <span className="underline underline-offset-4">{target?.colorName}</span></>}
            </motion.h2>

            {/* Grid */}
            <div
                className="grid gap-5 mx-auto "
                style={{
                    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                    maxWidth:
                        gridCols === 4 ? '760px' : gridCols === 3 ? '660px' : '460px'
                }}
            >
                {colors.map((item) => {
                    const isSelected = selectedId === item.id;
                    const showResult = gameState === 'result';

                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            disabled={gameState !== 'selecting'}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={gameState === 'selecting' ? { scale: 1.03 } : {}}
                            whileTap={gameState === 'selecting' ? { scale: 0.97 } : {}}
                            className={cn(
                                'aspect-square rounded-2xl relative overflow-hidden transition-all',
                                'border border-white/10',
                                gameState === 'selecting' && 'hover:border-white/30',
                                showResult && item.id === target?.id && 'ring-2 ring-white/40',
                                showResult && isSelected && !isCorrect && 'ring-2 ring-red-400/60'
                            )}
                        >
                            {/* Card face */}
                            <div
                                className={cn(
                                    'absolute inset-0 transition-colors duration-500',
                                    gameState === 'memorizing' ||
                                        (showResult &&
                                            (item.id === target?.id || isSelected))
                                        ? item.twClass
                                        : 'bg-neutral-800'
                                )}
                            />

                            {/* Result icon */}
                            <AnimatePresence>
                                {showResult && item.id === target?.id && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute inset-0 flex items-center justify-center bg-black/10"
                                    >
                                        <span className="text-white text-xl">✓</span>
                                    </motion.div>
                                )}

                                {showResult && isSelected && !isCorrect && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute inset-0 flex items-center justify-center bg-black/20"
                                    >
                                        <span className="text-red-400 text-xl">✕</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default MemoryChallengeFirstUI;

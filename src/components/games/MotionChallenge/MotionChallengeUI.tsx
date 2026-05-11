import React, { useState, useEffect, useRef } from 'react';
import MotionChallengeBoard from './MotionChallengeBoard';
import { motionLevels, shuffleLevelIndices, Entity, isValidMove, checkWinPattern, LevelDef } from '@/features/motion-challenge/gameLogic';
import { ArrowRight, SkipForward, RefreshCw, Trophy, Target, Zap } from 'lucide-react';
import { useGameSounds } from '@/lib/useGameSounds';

interface MotionChallengeUIProps {
    levelIndex: number;
    onLevelComplete: (moves: number) => void;
    onSkipLevel: () => void;
    gameStatus: 'playing' | 'results';
    correct: number;
    wrong: number;
    resetGame: () => void;
}

const MotionChallengeUI: React.FC<MotionChallengeUIProps> = ({
    levelIndex,
    onLevelComplete,
    onSkipLevel,
    gameStatus,
    correct,
    wrong,
    resetGame,
}) => {
    // Shuffle level order once on mount so every session feels different
    const [levelSequence] = useState<number[]>(() =>
        shuffleLevelIndices(motionLevels.length)
    );

    const actualIndex = levelSequence[levelIndex % levelSequence.length];
    const levelDef: LevelDef = motionLevels[actualIndex];

    const [entities, setEntities] = useState<Entity[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [movesCount, setMovesCount] = useState<number>(0);
    const [isLevelWon, setIsLevelWon] = useState<boolean>(false);

    const { play } = useGameSounds();
    const prevStatus = useRef(gameStatus);

    useEffect(() => {
        if (gameStatus === 'results' && prevStatus.current !== 'results') play('gameOver');
        prevStatus.current = gameStatus;
    }, [gameStatus, play]);

    useEffect(() => {
        setEntities(JSON.parse(JSON.stringify(levelDef.entities)));
        setSelectedId(null);
        setMovesCount(0);
        setIsLevelWon(false);
    }, [levelDef]);

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    const handleMove = (id: string, dx: number, dy: number) => {
        if (isLevelWon || gameStatus !== 'playing') return;

        if (isValidMove(levelDef, entities, id, dx, dy)) {
            const newEntities = entities.map((e) =>
                e.id === id ? { ...e, x: e.x + dx, y: e.y + dy } : e
            );
            setEntities(newEntities);
            setSelectedId(null);
            setMovesCount((m) => m + 1);
            play('move');

            if (checkWinPattern(levelDef, newEntities)) {
                setIsLevelWon(true);
                play('levelWin');
                setTimeout(() => {
                    onLevelComplete(movesCount + 1);
                }, 700);
            }
        }
    };

    const handleResetLevel = () => {
        setEntities(JSON.parse(JSON.stringify(levelDef.entities)));
        setSelectedId(null);
        setMovesCount(0);
    };

    if (gameStatus === 'results') {
        const finalScore = correct * 4 - wrong;
        const accuracy = correct + wrong > 0
            ? Math.round((correct / (correct + wrong)) * 100)
            : 0;

        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" aria-hidden="true" />

                <div className="z-10 flex flex-col items-center w-full">
                    <Trophy className="w-12 h-12 text-amber-400 mb-3" />
                    <h2 className="text-3xl font-extrabold text-foreground mb-1">Time&apos;s Up!</h2>
                    <p className="text-muted-foreground text-sm mb-8">Here&apos;s how you did</p>

                    <div className="w-full space-y-3 mb-8">
                        <div className="flex justify-between items-center bg-white/5 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <Target className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-muted-foreground font-semibold">Levels Solved</span>
                            </div>
                            <span className="text-2xl font-extrabold text-emerald-400">{correct}</span>
                        </div>

                        <div className="flex justify-between items-center bg-white/5 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center">
                                    <SkipForward className="w-4 h-4 text-rose-400" />
                                </div>
                                <span className="text-muted-foreground font-semibold">Levels Skipped</span>
                            </div>
                            <span className="text-2xl font-extrabold text-rose-400">{wrong}</span>
                        </div>

                        <div className="flex justify-between items-center bg-white/5 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-sky-500/20 flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-sky-400" />
                                </div>
                                <span className="text-muted-foreground font-semibold">Accuracy</span>
                            </div>
                            <span className="text-2xl font-extrabold text-sky-400">{accuracy}%</span>
                        </div>

                        <div className="flex justify-between items-center bg-gradient-to-r from-amber-500/10 to-amber-600/5 px-6 py-5 rounded-2xl border border-amber-500/20 relative overflow-hidden group mt-2">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" aria-hidden="true" />
                            <span className="text-foreground font-bold text-lg">Total Score</span>
                            <span className="text-4xl font-black text-amber-400">{Math.max(0, finalScore)}</span>
                        </div>
                    </div>

                    <button
                        onClick={resetGame}
                        className="group relative w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" aria-hidden="true" />
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 ease-out" />
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full">
            {/* Controls row */}
            <div className="w-full max-w-[400px] flex justify-between items-center mb-6 px-2">
                <div className="flex flex-col bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Moves</span>
                    <span className="text-3xl font-black text-foreground leading-none">{movesCount}</span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleResetLevel}
                        className="p-3 rounded-2xl bg-white/5 backdrop-blur-md text-foreground/60 border border-white/10 hover:bg-white/10 hover:text-foreground transition-all duration-200 hover:-translate-y-0.5"
                        title="Reset Level"
                        aria-label="Reset Level"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => { play('skip'); onSkipLevel(); }}
                        className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-all duration-200 font-bold hover:-translate-y-0.5 text-sm"
                    >
                        Skip <SkipForward className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Board */}
            <div className="relative">
                <MotionChallengeBoard
                    level={levelDef}
                    entities={entities}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    onMove={handleMove}
                    disabled={isLevelWon}
                />

                {/* Win overlay */}
                {isLevelWon && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-3xl animate-in fade-in duration-300">
                        <div className="bg-emerald-500 text-white px-8 py-5 rounded-2xl shadow-[0_15px_40px_rgba(16,185,129,0.5)] flex items-center gap-4 scale-110 border border-white/20">
                            <span className="font-extrabold text-2xl tracking-wide">Well Done!</span>
                            <ArrowRight className="w-7 h-7" />
                        </div>
                    </div>
                )}
            </div>

            {/* Hint */}
            <p className="mt-5 text-xs text-muted-foreground/50 text-center">
                Tap a piece to select it, then use the arrows to move it
            </p>
        </div>
    );
};

export default MotionChallengeUI;

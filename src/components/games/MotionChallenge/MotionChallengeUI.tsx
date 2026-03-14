import React, { useState, useEffect } from 'react';
import MotionChallengeBoard from './MotionChallengeBoard';
import { motionLevels, Entity, isValidMove, checkWinPattern, LevelDef } from '@/features/motion-challenge/gameLogic';
import { ArrowRight, SkipForward, RefreshCw } from 'lucide-react';

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
    // Get current level definition (looping if we run out)
    const levelDef: LevelDef = motionLevels[levelIndex % motionLevels.length];

    const [entities, setEntities] = useState<Entity[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [movesCount, setMovesCount] = useState<number>(0);
    const [isLevelWon, setIsLevelWon] = useState<boolean>(false);

    // Initialize or reset level state when levelIndex changes
    useEffect(() => {
        // Deep copy entities to avoid mutating the original level definition
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

            if (checkWinPattern(levelDef, newEntities)) {
                setIsLevelWon(true);
                // Small delay so user sees the ball enter the hole
                setTimeout(() => {
                    onLevelComplete(movesCount + 1);
                }, 800);
            }
        }
    };

    const handleResetLevel = () => {
        setEntities(JSON.parse(JSON.stringify(levelDef.entities)));
        setSelectedId(null);
        setMovesCount(0);
    };

    if (gameStatus === 'results') {
        const totalAttempted = correct + wrong;
        const finalScore = correct * 4 - wrong * 1;
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

                <h2 className="text-4xl font-extrabold text-foreground mb-8 z-10">Time's Up!</h2>

                <div className="w-full space-y-4 mb-8 z-10 relative">
                    <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                        <span className="text-muted-foreground font-semibold text-lg">Levels Complete</span>
                        <span className="text-3xl font-extrabold text-emerald-400">{correct}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                        <span className="text-muted-foreground font-semibold text-lg">Levels Skipped</span>
                        <span className="text-3xl font-extrabold text-rose-400">{wrong}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 mt-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <span className="text-foreground font-bold text-xl">Total Score</span>
                        <span className="text-4xl font-black text-amber-400">{finalScore}</span>
                    </div>
                </div>

                <button
                    onClick={resetGame}
                    className="group relative w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-xl hover:bg-primary/90 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 z-10 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500 ease-out" />
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full">
            {/* Game Header Controls */}
            <div className="w-full max-w-[400px] flex justify-between items-center mb-8 px-4">
                <div className="flex flex-col bg-white/5 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/10">
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Moves</span>
                    <span className="text-3xl font-black text-foreground leading-none">{movesCount}</span>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleResetLevel}
                        className="p-3 rounded-2xl bg-white/5 backdrop-blur-md text-foreground/60 border border-white/10 hover:bg-white/10 hover:text-foreground transition-all duration-300 hover:-translate-y-0.5"
                        title="Reset Level"
                        aria-label="Reset Level"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onSkipLevel}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-all duration-300 font-bold hover:-translate-y-0.5 text-sm"
                    >
                        Skip <SkipForward className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* The Board */}
            <div className="relative">
                <MotionChallengeBoard
                    level={levelDef}
                    entities={entities}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    onMove={handleMove}
                    disabled={isLevelWon}
                />

                {/* Success Overlay */}
                {isLevelWon && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-3xl animate-in fade-in duration-300">
                        <div className="bg-[#8A9A5B] text-white px-8 py-5 rounded-2xl shadow-[0_15px_30px_rgba(138,154,91,0.4)] flex items-center gap-4 transform scale-110 border border-white/20">
                            <span className="font-extrabold text-2xl tracking-wide">Well Done!</span>
                            <ArrowRight className="w-7 h-7 animate-bounce-x" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MotionChallengeUI;

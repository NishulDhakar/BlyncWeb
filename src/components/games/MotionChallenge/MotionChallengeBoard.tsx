import React from 'react';
import { Entity, LevelDef, getValidMoves } from '@/features/motion-challenge/gameLogic';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X } from 'lucide-react';

interface MotionChallengeBoardProps {
    level: LevelDef;
    entities: Entity[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onMove: (id: string, dx: number, dy: number) => void;
    disabled?: boolean;
}

const CELL_SIZE = 64;

const MotionChallengeBoard: React.FC<MotionChallengeBoardProps> = ({
    level,
    entities,
    selectedId,
    onSelect,
    onMove,
    disabled = false,
}) => {
    const boardWidth = level.cols * CELL_SIZE;
    const boardHeight = level.rows * CELL_SIZE;

    const handleEntityClick = (id: string, type: string) => {
        if (disabled || type === 'obstacle') return;
        onSelect(id === selectedId ? '' : id);
    };

    const arrowBtnClass =
        'absolute flex items-center justify-center bg-slate-800/95 backdrop-blur-md rounded-full w-[30px] h-[30px] shadow-[0_4px_16px_rgba(0,0,0,0.5)] pointer-events-auto hover:bg-amber-500 hover:text-white transition-all duration-200 text-slate-300 border border-slate-600/60 z-40';

    return (
        <div className="flex flex-col items-center select-none">
            <div
                className="relative rounded-3xl overflow-hidden border border-slate-700/60 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.7)]"
                style={{
                    width: boardWidth,
                    height: boardHeight,
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                }}
                aria-hidden="false"
            >
                {/* Subtle grid lines */}
                {Array.from({ length: level.rows }).map((_, r) =>
                    Array.from({ length: level.cols }).map((_, c) => (
                        <div
                            key={`grid-${r}-${c}`}
                            className="absolute border border-slate-700/25"
                            style={{
                                top: r * CELL_SIZE,
                                left: c * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                            }}
                        />
                    ))
                )}

                {/* Hole */}
                <div
                    className="absolute flex items-center justify-center"
                    style={{
                        top: level.hole.y * CELL_SIZE,
                        left: level.hole.x * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                    }}
                >
                    <div className="relative w-[62%] h-[62%] flex items-center justify-center">
                        {/* Outer glow ring */}
                        <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md scale-125" aria-hidden="true" />
                        {/* Main hole */}
                        <div className="relative w-full h-full bg-slate-950 rounded-full shadow-[inset_0_4px_20px_rgba(0,0,0,1),0_0_16px_rgba(245,158,11,0.3)] ring-2 ring-amber-500/40 z-10" />
                    </div>
                </div>

                {/* Entities */}
                {entities.map((entity) => {
                    const isSelected = selectedId === entity.id;
                    const validMoves = isSelected ? getValidMoves(level, entities, entity.id) : null;

                    let entityClasses = 'absolute flex items-center justify-center transition-colors duration-200 cursor-pointer';
                    let innerContent: React.ReactNode = null;

                    if (entity.type === 'obstacle') {
                        entityClasses += ' cursor-not-allowed z-10 rounded-2xl';
                        innerContent = (
                            <div
                                className="w-full h-full flex items-center justify-center rounded-2xl"
                                style={{
                                    background: 'repeating-linear-gradient(45deg, #1e293b, #1e293b 6px, #263147 6px, #263147 12px)',
                                    border: '1px solid rgba(100,116,139,0.3)',
                                }}
                            >
                                <X className="text-slate-500 w-6 h-6 opacity-70" />
                            </div>
                        );
                    } else if (entity.type === 'ball') {
                        entityClasses += ` rounded-full ${entity.color} z-20 hover:scale-[1.06] active:scale-95`;
                        if (isSelected) entityClasses += ' ring-[3px] ring-amber-400 ring-offset-2 ring-offset-slate-900';
                    } else if (entity.type === 'block') {
                        entityClasses += ` ${entity.color} rounded-2xl z-20 hover:brightness-110`;
                        if (isSelected) entityClasses += ' ring-[3px] ring-amber-400 ring-offset-2 ring-offset-slate-900';
                    }

                    return (
                        <motion.div
                            key={entity.id}
                            layout
                            initial={false}
                            animate={{
                                top: entity.y * CELL_SIZE,
                                left: entity.x * CELL_SIZE,
                                width: entity.w * CELL_SIZE,
                                height: entity.h * CELL_SIZE,
                            }}
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                            className={entityClasses}
                            style={{
                                padding: entity.type === 'obstacle' ? '4px' : entity.type === 'ball' ? '7px' : '4px',
                            }}
                            onClick={() => handleEntityClick(entity.id, entity.type)}
                        >
                            {entity.type === 'obstacle' ? (
                                innerContent
                            ) : (
                                <>
                                    {/* Glass highlight overlay */}
                                    <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            borderRadius: 'inherit',
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
                                        }}
                                        aria-hidden="true"
                                    />
                                    {/* Shadow inset for depth */}
                                    <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            borderRadius: 'inherit',
                                            boxShadow: entity.type === 'ball'
                                                ? '0 8px 24px rgba(0,0,0,0.5), inset 0 -3px 8px rgba(0,0,0,0.3)'
                                                : '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.3)',
                                        }}
                                        aria-hidden="true"
                                    />
                                </>
                            )}

                            {/* Arrow controls */}
                            {isSelected && !disabled && (
                                <div className="absolute inset-0 z-30 pointer-events-none">
                                    {validMoves?.up && (
                                        <button
                                            className={`${arrowBtnClass} top-0 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                                            onClick={(e) => { e.stopPropagation(); onMove(entity.id, 0, -1); }}
                                            aria-label="Move up"
                                        >
                                            <ArrowUp className="w-[14px] h-[14px]" />
                                        </button>
                                    )}
                                    {validMoves?.down && (
                                        <button
                                            className={`${arrowBtnClass} bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2`}
                                            onClick={(e) => { e.stopPropagation(); onMove(entity.id, 0, 1); }}
                                            aria-label="Move down"
                                        >
                                            <ArrowDown className="w-[14px] h-[14px]" />
                                        </button>
                                    )}
                                    {validMoves?.left && (
                                        <button
                                            className={`${arrowBtnClass} left-0 top-1/2 -translate-x-1/2 -translate-y-1/2`}
                                            onClick={(e) => { e.stopPropagation(); onMove(entity.id, -1, 0); }}
                                            aria-label="Move left"
                                        >
                                            <ArrowLeft className="w-[14px] h-[14px]" />
                                        </button>
                                    )}
                                    {validMoves?.right && (
                                        <button
                                            className={`${arrowBtnClass} right-0 top-1/2 translate-x-1/2 -translate-y-1/2`}
                                            onClick={(e) => { e.stopPropagation(); onMove(entity.id, 1, 0); }}
                                            aria-label="Move right"
                                        >
                                            <ArrowRight className="w-[14px] h-[14px]" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default MotionChallengeBoard;

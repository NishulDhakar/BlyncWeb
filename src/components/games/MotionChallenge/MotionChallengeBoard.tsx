import React from 'react';
import { Entity, LevelDef, getValidMoves } from '@/app/play/Motion-challenge/gameLogic';
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

const CELL_SIZE = 64; // px

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
        onSelect(id === selectedId ? '' : id); // Toggle selection
    };

    return (
        <div className="flex flex-col items-center select-none">
            <div
                className="relative bg-[#FAECE1]/30 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden border-2 border-[#E5DFD3] backdrop-blur-sm"
                style={{ width: boardWidth, height: boardHeight }}
            >
                {/* Render grid lines for visual clarity */}
                {Array.from({ length: level.rows }).map((_, r) => (
                    Array.from({ length: level.cols }).map((_, c) => (
                        <div
                            key={`grid-${r}-${c}`}
                            className="absolute border border-[#E5DFD3]/40"
                            style={{
                                top: r * CELL_SIZE,
                                left: c * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                            }}
                        />
                    ))
                ))}

                {/* Render the Hole */}
                <div
                    className="absolute flex items-center justify-center transition-all duration-300"
                    style={{
                        top: level.hole.y * CELL_SIZE,
                        left: level.hole.x * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                    }}
                >
                    <div className="w-[65%] h-[65%] bg-[#2C241B] rounded-full shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)] z-0 ring-4 ring-[#E5DFD3]/30" />
                </div>

                {/* Render Entities */}
                {entities.map((entity) => {
                    const isSelected = selectedId === entity.id;
                    const validMoves = isSelected ? getValidMoves(level, entities, entity.id) : null;

                    // Entity styling based on type
                    let entityClasses = 'absolute flex items-center justify-center transition-all duration-300 cursor-pointer';
                    let innerContent = null;

                    if (entity.type === 'obstacle') {
                        entityClasses += ' bg-[#EBE5DA] cursor-not-allowed z-10 rounded-[14px]';
                        innerContent = (
                            <div className="w-full h-full relative flex items-center justify-center">
                                <X className="text-[#C2B7A9] w-8 h-8 opacity-40" />
                            </div>
                        );
                    } else if (entity.type === 'ball') {
                        entityClasses += ` rounded-full ${entity.color} z-20 hover:scale-[1.03] active:scale-95 shadow-[0_8px_16px_rgba(0,0,0,0.2)] border-2 border-white/20`;
                        if (isSelected) entityClasses += ' ring-[3px] ring-[#C08457] ring-offset-2 ring-offset-[#FCF8F4]';
                    } else if (entity.type === 'block') {
                        entityClasses += ` ${entity.color} rounded-[14px] z-20 hover:brightness-110 shadow-[0_6px_12px_rgba(0,0,0,0.12)] border border-white/20`;
                        if (isSelected) entityClasses += ' ring-[3px] ring-[#C08457] ring-offset-2 ring-offset-[#FCF8F4]';
                    }

                    const arrowBtnClass = "absolute flex items-center justify-center bg-white/95 backdrop-blur-md rounded-full w-[28px] h-[28px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] pointer-events-auto hover:bg-[#C08457] hover:text-white transition-all text-[#3B3024] border border-[#E5DFD3]/50";

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
                            className={entityClasses}
                            // Slight padding to scale blocks down a bit from absolute cell borders
                            style={{
                                padding: entity.type === 'ball' ? '6px' : '3px',
                                backgroundClip: 'content-box'
                            }}
                            onClick={() => handleEntityClick(entity.id, entity.type)}
                        >
                            {innerContent}
                            {/* Inner gradient for balls & blocks to give 3D pop */}
                            {(entity.type === 'ball' || entity.type === 'block') && (
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none rounded-inherit" style={{ borderRadius: 'inherit' }} />
                            )}

                            {/* Arrow Controls for Selected Entity */}
                            {isSelected && !disabled && (
                                <div className="absolute inset-0 z-30 pointer-events-none">
                                    {validMoves?.up && (
                                        <button
                                            className={`${arrowBtnClass} top-0 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                                            onClick={(e) => { e.stopPropagation(); onMove(entity.id, 0, -1); }}
                                        >
                                            <ArrowUp className="w-[14px] h-[14px]" />
                                        </button>
                                    )}
                                    {validMoves?.down && (
                                        <button
                                            className={`${arrowBtnClass} bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2`}
                                            onClick={(e) => { e.stopPropagation(); onMove(entity.id, 0, 1); }}
                                        >
                                            <ArrowDown className="w-[14px] h-[14px]" />
                                        </button>
                                    )}
                                    {validMoves?.left && (
                                        <button
                                            className={`${arrowBtnClass} left-0 top-1/2 -translate-x-1/2 -translate-y-1/2`}
                                            onClick={(e) => { e.stopPropagation(); onMove(entity.id, -1, 0); }}
                                        >
                                            <ArrowLeft className="w-[14px] h-[14px]" />
                                        </button>
                                    )}
                                    {validMoves?.right && (
                                        <button
                                            className={`${arrowBtnClass} right-0 top-1/2 translate-x-1/2 -translate-y-1/2`}
                                            onClick={(e) => { e.stopPropagation(); onMove(entity.id, 1, 0); }}
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

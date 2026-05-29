'use client';

import Image from "next/image";
import Link from "next/link";
import { memoryGameCards } from "@/data/MemoryGamesData";
import { cn } from "@/lib/utils";

export default function MemoryGamesCard() {
    return (
        <div className="relative">
            <div
                className="grid sm:grid-cols-2 lg:grid-cols-3 px-4 pt-6 pb-20 justify-items-center gap-8"
            >
                {memoryGameCards.map((game) => {
                    const isAvailable = game.isAvailable !== false;

                    return (
                        <div
                            key={game.id}
                            className="group relative w-full max-w-[320px] aspect-[2/2] cursor-pointer"
                        >
                            <Link
                                href={isAvailable ? game.rulesLink : "#"}
                                className={cn(
                                    "block h-full w-full",
                                    !isAvailable && "cursor-not-allowed pointer-events-none"
                                )}
                            >
                                <div className={cn(
                                    "relative h-full w-full rounded-[28px] overflow-hidden shadow-2xl transition-all duration-300",
                                    isAvailable ? "hover:scale-[1.01]" : "grayscale opacity-80"
                                )}>
                                    {/* Background Image */}
                                    <Image
                                        src={game.image}
                                        alt={game.name}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Content (Bottom Section) */}
                                    <div className="absolute bottom-0 left-0 w-full p-8 space-y-4">
                                        {/* Name */}
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-bold text-white tracking-tight">
                                                {game.name}
                                            </h3>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex gap-2">
                                            {!isAvailable && (
                                                <div className="bg-white/20 rounded-full px-4 py-1">
                                                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                                                        Coming Soon
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Button */}
                                        <div className="pt-4">
                                            <div className={cn(
                                                "w-full py-4 rounded-[24px] text-center font-bold transition-colors duration-200",
                                                isAvailable
                                                    ? "bg-white/80 text-black hover:bg-white/60 border border-white/10"
                                                    : "bg-white/10 text-white/40 border border-white/10"
                                            )}>
                                                {isAvailable ? "Play Game" : "Locked"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pagination indicator */}
                                    <div className="absolute top-[48%] left-1/2 -translate-x-1/2 flex gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

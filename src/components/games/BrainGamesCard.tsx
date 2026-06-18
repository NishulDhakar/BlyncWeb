'use client';

import Link from "next/link";
import { brainGameCards } from "@/data/BrainGamesData";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Grid2X2,
  Puzzle,
  Bomb,
  Hash,
  Snail,
  Layers,
  Bug,
  Dice5,
} from "lucide-react";

const BRAIN_GAME_ICONS: Record<number, React.ReactNode> = {
  1: <Grid2X2 className="w-5 h-5" />,    // Sudoku
  2: <Puzzle className="w-5 h-5" />,      // 15 Puzzle
  3: <Bomb className="w-5 h-5" />,        // Minesweeper
  4: <Hash className="w-5 h-5" />,        // Tic Tac Toe
  5: <Snail className="w-5 h-5" />,       // Snake
  6: <Layers className="w-5 h-5" />,      // Memory Match Pairs
  7: <Bug className="w-5 h-5" />,         // Ant Smasher
  8: <Dice5 className="w-5 h-5" />,       // Dice Roller
};

export default function BrainGamesCard() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 pt-6 pb-20">
      {brainGameCards.map((game) => {
        const isAvailable = game.isAvailable !== false;
        const icon = BRAIN_GAME_ICONS[game.id];

        return (
          <div key={game.id}>
            <Link
              href={isAvailable ? game.playLink : "#"}
              aria-disabled={!isAvailable}
              className={cn(
                "group relative flex flex-col gap-4 p-5 rounded-2xl h-full",
                "bg-card border border-border/50",
                "transition-all duration-300",
                isAvailable
                  ? "hover:border-border/80 hover:shadow-lg hover:shadow-primary/5"
                  : "pointer-events-none opacity-60"
              )}
            >
              {/* Top row: icon + tag */}
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl border border-border/40 bg-white/5 text-foreground/70 transition-colors group-hover:text-foreground group-hover:border-border/60">
                  {icon}
                </div>
                {game.tag && (
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-border/40 text-muted-foreground">
                    {game.tag}
                  </span>
                )}
              </div>

              {/* Name + description */}
              <div className="flex-1 flex flex-col gap-1.5">
                <h3 className="text-base font-semibold text-foreground leading-snug">
                  {game.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {game.description}
                </p>
              </div>

              {/* Footer */}
              {isAvailable && (
                <div className="flex items-center gap-1 text-sm font-medium text-foreground/60 group-hover:text-foreground transition-colors duration-200 mt-auto pt-1">
                  Play Now
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              )}

              {!isAvailable && (
                <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground mt-auto pt-1">
                  Coming Soon
                </div>
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

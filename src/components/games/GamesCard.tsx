'use client';

import Image from "next/image";
import Link from "next/link";
import { gameCards } from "@/data/GamesData";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Shuffle,
  Hash,
  Brain,
  MoveRight,
  Eye,
  Grid2X2,
} from "lucide-react";

// One icon per game id
const GAME_ICONS: Record<number, React.ReactNode> = {
  1: <Shuffle className="w-5 h-5 text-white" />,
  2: <Brain className="w-5 h-5 text-white" />,
  3: <Hash className="w-5 h-5 text-white" />,
  4: <MoveRight className="w-5 h-5 text-white" />,
  5: <Grid2X2 className="w-5 h-5 text-white" />,
  6: <Eye className="w-5 h-5 text-white" />,
};

export default function GamesCard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 px-4 pt-6 pb-20">
      {gameCards.map((game, index) => {
        const isAvailable = game.isAvailable !== false;

        // Split name so the last word gets a lighter italic style
        const words = game.name.trim().split(" ");
        const lastWord = words.pop() ?? "";
        const firstName = words.join(" ");

        return (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: index * 0.1 }}
          >
            <Link
              href={isAvailable ? game.rulesLink : "#"}
              aria-disabled={!isAvailable}
              className={cn(
                "group block relative h-[380px] w-full overflow-hidden rounded-3xl",
                !isAvailable && "pointer-events-none"
              )}
            >
              {/* Background image */}
              <Image
                src={game.image}
                alt={game.name}
                fill
                priority={index < 3}
                className={cn(
                  "object-cover transition-transform duration-700 ease-out",
                  isAvailable && "group-hover:scale-[1.04]"
                )}
              />

              {/* Dark gradient — stronger at bottom, subtle at top */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

              {/* Coming soon badge */}
              {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 rounded-3xl backdrop-blur-[2px]">
                  <span className="px-5 py-2 rounded-full bg-white/90 text-gray-800 text-sm font-semibold shadow">
                    Coming Soon
                  </span>
                </div>
              )}

              {/* Card content */}
              <div className="absolute inset-0 flex flex-col items-center">
                {/* Icon — floats in the upper-center */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                    {GAME_ICONS[game.id]}
                  </div>
                </div>

                {/* Bottom content */}
                <div className="w-full px-6 pb-6 text-center">
                  {/* Title — first part normal weight, last word italic-light */}
                  <h3 className="text-2xl font-semibold text-white leading-tight mb-2">
                    {firstName && <span>{firstName} </span>}
                    <span className="font-light italic">{lastWord}</span>
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/65 leading-relaxed line-clamp-2 mb-5">
                    {game.description}
                  </p>

                  {/* Pill button */}
                  <span
                    className={cn(
                      "inline-block px-7 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                      isAvailable
                        ? "bg-white/85 text-gray-900 group-hover:bg-white group-hover:scale-105 backdrop-blur-sm shadow-md"
                        : "bg-white/40 text-white/70 cursor-not-allowed"
                    )}
                  >
                    {isAvailable ? "Play Now" : "Coming Soon"}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

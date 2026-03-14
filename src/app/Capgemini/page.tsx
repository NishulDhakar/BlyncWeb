"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { gamesData } from "@/data/BlogData";
import { Gamepad2, Shuffle, Brain, Eye, Grid2X2, MoveRight, Hash } from "lucide-react";
import BackToDashboard from "@/components/common/BackToDashboard";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// game id → background image
const GAME_IMAGES: Record<number, string> = {
  5: "/switch.png",
  1: "/deductive.png",
  2: "/games/inductive.png",
  3: "/games/comingsoon.png",
  4: "/games/motion.png",
  6: "/digit.png",
};

// game id → icon
const GAME_ICONS: Record<number, React.ReactNode> = {
  5: <Shuffle className="w-5 h-5 text-white" />,
  1: <Brain className="w-5 h-5 text-white" />,
  2: <Eye className="w-5 h-5 text-white" />,
  3: <Grid2X2 className="w-5 h-5 text-white" />,
  4: <MoveRight className="w-5 h-5 text-white" />,
  6: <Hash className="w-5 h-5 text-white" />,
};

export default function CapgeminiPage() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8 relative z-10">
        {/* Back nav */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <BackToDashboard />
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 mt-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6 md:mb-8 px-2">
            Capgemini Game Based Aptitude Test — Free Practice 2025
          </h1>

          <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-border/50 shadow-sm text-left">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Capgemini has introduced a{" "}
              <strong className="text-foreground">Game-Based Aptitude Test</strong> in its hiring
              process. Candidates play{" "}
              <strong className="text-foreground">4 randomly selected games</strong> out of 24
              available, measuring logical thinking, problem-solving, multitasking, memory, and
              decision-making. Practicing here gives you a real advantage — every game on Blync
              mirrors the actual format and difficulty used in the Capgemini cognitive assessment round.
            </p>
            <div className="mt-4 pt-4 border-t border-border/30">
              <Button asChild size="sm" variant="default" className="gap-2">
                <Link href="/games/cognitive">
                  <Gamepad2 className="w-4 h-4" /> Practice Games
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* H2 for SEO — Available Practice Games */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
            Available Practice Games
          </h2>
          <p className="text-muted-foreground text-base">
            Select any game below to start practicing. Each challenge is designed to closely replicate what you&apos;ll encounter in the Capgemini game-based aptitude round.
          </p>
        </motion.div>

        {/* Game cards — full-bleed image style */}
        <div ref={ref} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gamesData.map((game, index) => {
            const words = game.name.trim().split(" ");
            const lastWord = words.pop() ?? "";
            const firstName = words.join(" ");

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <Link
                  href={game.playLink}
                  className="group block relative h-[360px] w-full overflow-hidden rounded-3xl"
                >
                  {/* Background image */}
                  <Image
                    src={GAME_IMAGES[game.id] ?? "/games/comingsoon.png"}
                    alt={game.name}
                    fill
                    priority={index < 3}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center">
                    {/* Icon — centered in upper half */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="p-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                        {GAME_ICONS[game.id]}
                      </div>
                    </div>

                    {/* Title, description, button */}
                    <div className="w-full px-6 pb-6 text-center">
                      <h3 className="text-2xl font-semibold text-white leading-tight mb-2">
                        {firstName && <span>{firstName} </span>}
                        <span className="font-light italic">{lastWord}</span>
                      </h3>

                      <p className="text-sm text-white/65 leading-relaxed line-clamp-2 mb-5">
                        {game.description}
                      </p>

                      <span
                        className={cn(
                          "inline-block px-7 py-2.5 rounded-full text-sm font-medium",
                          "bg-white/85 text-gray-900 backdrop-blur-sm shadow-md",
                          "transition-all duration-200 group-hover:bg-white group-hover:scale-105"
                        )}
                      >
                        Play Now
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* H2 — How It Works section for SEO depth */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-16 pt-10 border-t border-border/40"
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
            How Capgemini&apos;s Gaming Round Works
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
            The Capgemini game-based aptitude test is administered through the Aon/cut-e platform and typically takes place early in the hiring process as an elimination stage. Candidates are randomly assigned 4 games from a pool of 24, each measuring a different cognitive ability — from logical deduction and spatial reasoning to working memory and numerical pattern recognition. Scores are benchmarked against other candidates, so speed and accuracy together determine your cut-off. Regular practice with our free mock games significantly improves your baseline performance.
          </p>
        </motion.section>
      </div>
    </div>

  );
}

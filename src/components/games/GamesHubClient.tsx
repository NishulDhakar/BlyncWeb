'use client';

import Link from "next/link";
import Image from "next/image";
import {
  Shuffle, Hash, Brain, MoveRight, Eye, Grid2X2,
  BookOpen, ArrowRight, Zap, Layers, Play,
  Puzzle, Bomb, Snail, Bug, Dice5, Gamepad2,
  Send,
} from "lucide-react";
import { gamesConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const GAME_META: Record<string, { icon: React.ElementType }> = {
  "switch-challenge": { icon: Shuffle },
  "digit-challenge": { icon: Hash },
  "deductive-challenge": { icon: Brain },
  "motion-challenge": { icon: MoveRight },
  "inductive-challenge": { icon: Eye },
  "grid-challenge": { icon: Grid2X2 },
  "recall-challenge": { icon: BookOpen },
  // Brain Games
  "sudoku": { icon: Grid2X2 },
  "15-puzzle": { icon: Puzzle },
  "minesweeper": { icon: Bomb },
  "tic-tac-toe": { icon: Hash },
  "snake": { icon: Snail },
  "memory-match-pairs": { icon: Layers },
  "ant-smasher": { icon: Bug },
  "dice-roller": { icon: Dice5 },
};

const categories = [
  {
    slug: "cognitive",
    name: "Cognitive Games",
    href: "/games/cognitive",
    description:
      "Switch, Digit, Motion, Grid, Inductive & Deductive challenges — the exact games used in placement tests.",
    count: gamesConfig.filter((g) => g.category === "cognitive").length,
    Icon: Zap,
    badge: "Placement Ready",
    image: "/games/games.png",
  },
  {
    slug: "memory",
    name: "Memory Games",
    href: "/games/memory",
    description:
      "Memory and Recall challenges to improve working memory, recall speed, and short-term retention.",
    count: gamesConfig.filter((g) => g.category === "memory").length,
    Icon: Layers,
    badge: "Brain Training",
    image: "/games/memory.png",
  },
  {
    slug: "brain",
    name: "Brain Games",
    href: "/games/brain",
    description:
      "Classic brain teasers — Sudoku, Minesweeper, 15 Puzzle, Snake & more. Sharpen logic, reflexes, and strategy.",
    count: gamesConfig.filter((g) => g.category === "brain").length,
    Icon: Gamepad2,
    badge: "Fun & Logic",
    image: "/games/braingames.png",
  },
];

export default function GamesHubClient() {
  return (
    <div className="min-h-screen relative selection:bg-white/20">
      {/* Subtle Background Pattern */}
      {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" /> */}

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative z-10 mt-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm font-medium text-muted-foreground mb-16 tracking-wide">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="text-muted-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden className="opacity-50">/</li>
            <li className="text-foreground">Games</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="relative mb-24 max-w-3xl">

          <h1 className="text-2xl md:text-2xl lg:text-[2rem] font-bold tracking-tighter mb-8 leading-[1.05] text-balance">
            Choose Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50">{" "}Challenge.</span>
          </h1>

          <p className="text-sm md:text-md text-muted-foreground leading-relaxed max-w-xl font-light">
            Practice free online cognitive games for <strong className="font-semibold text-foreground">Capgemini &amp; Cognizant</strong> aptitude rounds. Train memory, logic, and pattern recognition instantly.
          </p>
                      <div className="mt-6">
              <Button asChild size="sm" variant="outline" className="border-sky-500/30 hover:border-sky-500/50 hover:bg-sky-500/10 text-sky-500 gap-2">
                <a href="https://t.me/Savvyop" target="_blank" rel="noopener noreferrer">
                  <Send className="w-4 h-4" /> Contact Here for Free Games
                </a>
              </Button>
            </div>
        </div>

        {/* Categories Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className="relative flex flex-col overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group"
            >
              {/* Category Image Cover */}
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1 justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 tracking-tight">
                    {cat.name}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {cat.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 mt-8 text-sm font-bold text-foreground/50 group-hover:text-foreground transition-colors duration-200">
                  <span className="tracking-wide">Explore Category</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Games Grid */}
        <div className="relative">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pb-8 border-b border-white/[0.05]">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2">All Games</h2>
              <p className="text-muted-foreground font-light">
                The complete training collection
              </p>
            </div>
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] text-sm font-medium text-foreground/80">
              {gamesConfig.length} Modules Available
            </div>
          </div>

          {/* Grid */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesConfig.map((game) => {
              const meta = GAME_META[game.slug] ?? { icon: Zap };
              const Icon = meta.icon;

              return (
                <li key={game.slug}>
                  <Link
                    href={`/games/${game.category}/${game.slug}`}
                    className="relative flex flex-col h-full p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.03] hover:border-white/[0.1] transition-colors duration-200 ease-in-out"
                  >
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Top: Icon + Tag */}
                      {/* <div className="flex items-start justify-between mb-8">
                        <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.05] text-foreground/70">
                          <Icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-white/[0.03] text-muted-foreground">
                          {game.category}
                        </span>
                      </div> */}

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                          {game.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed font-light">
                          {game.description}
                        </p>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 mt-8 text-sm font-bold text-foreground/40">
                        <Play className="w-4 h-4 fill-current" />
                        <span>Play Now</span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
}

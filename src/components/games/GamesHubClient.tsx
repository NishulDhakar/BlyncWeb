'use client';

import Link from "next/link";
import {
  Shuffle, Hash, Brain, MoveRight, Eye, Grid2X2,
  BookOpen, ArrowRight, Zap, Layers, Play
} from "lucide-react";
import { gamesConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const GAME_META: Record<string, { icon: React.ElementType }> = {
  "switch-challenge":    { icon: Shuffle },
  "digit-challenge":     { icon: Hash },
  "deductive-challenge": { icon: Brain },
  "motion-challenge":    { icon: MoveRight },
  "inductive-challenge": { icon: Eye },
  "grid-challenge":      { icon: Grid2X2 },
  "recall-challenge":    { icon: BookOpen },
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
  },
];

export default function GamesHubClient() {
  return (
    <div className="min-h-screen relative selection:bg-white/20">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative z-10">
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
        </div>

        {/* Categories Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className="relative flex flex-col justify-between p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] overflow-hidden"
            >
              <div className="relative z-10 flex flex-col h-full">
                {/* Top Row */}
                {/* <div className="flex items-start justify-between mb-12">
                  <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/[0.05] text-foreground/80 shadow-sm">
                    <cat.Icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.05] text-foreground/80">
                      {cat.badge}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {cat.count} games inside
                    </span>
                  </div>
                </div> */}

                {/* Content */}
                <div className="mt-auto">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 tracking-tight">
                    {cat.name}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {cat.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 mt-10 text-sm font-bold text-foreground/50">
                  <span className="tracking-wide">Explore Category</span>
                  <ArrowRight className="w-4 h-4" />
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

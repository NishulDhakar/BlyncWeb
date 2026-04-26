'use client';

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import {
  Shuffle, Hash, Brain, MoveRight, Eye, Grid2X2,
  BookOpen, ArrowRight, Zap, Layers,
} from "lucide-react";
import { gamesConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const GAME_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  "switch-challenge":    { icon: Shuffle,   color: "#FF3F8F", bg: "from-pink-500/12 to-rose-500/5" },
  "digit-challenge":     { icon: Hash,      color: "#0586C8", bg: "from-blue-500/12 to-cyan-500/5" },
  "deductive-challenge": { icon: Brain,     color: "#7C3AED", bg: "from-violet-500/12 to-purple-500/5" },
  "motion-challenge":    { icon: MoveRight, color: "#F59E0B", bg: "from-amber-500/12 to-orange-500/5" },
  "inductive-challenge": { icon: Eye,       color: "#10B981", bg: "from-emerald-500/12 to-green-500/5" },
  "grid-challenge":      { icon: Grid2X2,   color: "#6366F1", bg: "from-indigo-500/12 to-violet-500/5" },
  "recall-challenge":    { icon: BookOpen,  color: "#EC4899", bg: "from-pink-400/12 to-fuchsia-500/5" },
};

const categories = [
  {
    slug: "cognitive",
    name: "Cognitive Games",
    href: "/games/cognitive",
    description:
      "Switch, Digit, Motion, Grid, Inductive & Deductive challenges — the exact games used in Capgemini & Cognizant placement tests.",
    count: gamesConfig.filter((g) => g.category === "cognitive").length,
    gradientFrom: "#FF3F8F",
    gradientTo: "#7C3AED",
    bgGradient: "from-[#FF3F8F]/12 via-[#7C3AED]/6 to-transparent",
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
    gradientFrom: "#0586C8",
    gradientTo: "#6366F1",
    bgGradient: "from-[#0586C8]/12 via-[#6366F1]/6 to-transparent",
    Icon: Layers,
    badge: "Brain Training",
  },
];

export default function GamesHubClient() {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const gamesRef = useRef<HTMLDivElement>(null);
  const categoriesInView = useInView(categoriesRef, { once: true, margin: "-60px" });
  const gamesInView = useInView(gamesRef, { once: true, margin: "-60px" });

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-10">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-border">/</li>
          <li className="text-foreground font-medium">Games</li>
        </ol>
      </nav>

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="relative mb-20"
      >
        {/* Ambient glow */}
        {/* <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full blur-[120px] opacity-40"
          style={{ background: "radial-gradient(ellipse, #FF3F8F 0%, #0586C8 60%, transparent 100%)" }}
        /> */}

        {/* Live badge */}
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-[#FF3F8F]/30 bg-[#FF3F8F]/10 text-[#FF3F8F]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3F8F] animate-pulse" />
            Free — No download needed
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
          Choose Your{" "}
          {/* <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #FF3F8F 0%, #0586C8 100%)" }}
          > */}
            Challenge
          {/* </span> */}
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Practice free online cognitive games for{" "}
          <span className="text-foreground font-semibold">Capgemini &amp; Cognizant</span> aptitude
          rounds. Train memory, logic, and pattern recognition — right in your browser.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-8 mt-10 pt-8 border-t border-border/40">
          {[
            { value: String(gamesConfig.length), label: "Games" },
            { value: "2", label: "Categories" },
            // { value: "100%", label: "Free Forever" },
            { value: "5k+", label: "Active Users" },
          ].map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Category Cards ── */}
      <div ref={categoriesRef} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-24 mt-10">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 32 }}
            animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: index * 0.13, ease: "easeOut" as const }}
          >
            <Link
              href={cat.href}
              className="group relative flex flex-col h-full min-h-[240px] py-6 px-6 rounded-2xl border border-border/90 overflow-hidden transition-all duration-300 hover:border-border hover:shadow-xl"
            >
              {/* Background gradient */}
              <div
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-70",
                  cat.bgGradient
                )}
              />
              {/* Hover border glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: `inset 0 0 0 1px ${cat.gradientFrom}28` }}
              />

              <div className="relative z-10 flex flex-col h-full">
                {/* Top row */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="p-2.5 rounded-xl border"
                    style={{
                      backgroundColor: `${cat.gradientFrom}18`,
                      borderColor: `${cat.gradientFrom}30`,
                    }}
                  >
                    <cat.Icon className="w-5 h-5" style={{ color: cat.gradientFrom }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${cat.gradientFrom}14`,
                        color: cat.gradientFrom,
                        border: `1px solid ${cat.gradientFrom}25`,
                      }}
                    >
                      {cat.badge}
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border/40">
                      {cat.count} games
                    </span>
                  </div>
                </div>

                {/* Text */}
                <h2 className="text-xl font-semibold text-foreground mb-2.5">{cat.name}</h2>
                <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
                  {cat.description}
                </p>

                {/* CTA */}
                <div
                  className="flex items-center gap-2 mt-6 text-sm font-semibold"
                  style={{ color: cat.gradientFrom }}
                >
                  Browse {cat.name}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── All Games Grid ── */}

      
      <div ref={gamesRef}>
        
        <div className="flex items-center justify-between mb-8 mt-12">
          <h2 className="text-2xl font-semibold">All Games</h2>
          <span className="text-sm text-muted-foreground">
            {gamesConfig.length} available
          </span>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gamesConfig.map((game, index) => {
            const meta = GAME_META[game.slug] ?? {
              icon: Zap,
              color: "#FF3F8F",
              bg: "from-pink-500/10 to-transparent",
            };
            const Icon = meta.icon;

            return (
              <motion.li
                key={game.slug}
                initial={{ opacity: 0, y: 22 }}
                animate={gamesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" as const }}
              >
                <Link
                  href={`/games/${game.category}/${game.slug}`}
                  className="group relative flex flex-col h-full p-5 rounded-xl border border-border/90 overflow-hidden transition-all duration-300 hover:border-border hover:shadow-md"
                >
                  {/* Hover gradient bg */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                      meta.bg
                    )}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon + category */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          backgroundColor: `${meta.color}15`,
                          border: `1px solid ${meta.color}25`,
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: meta.color }} />
                      </div>
                      <span className="text-xs text-muted-foreground capitalize bg-muted/40 px-2.5 py-0.5 rounded-full border border-border/40">
                        {game.category}
                      </span>
                    </div>

                    <span className="font-semibold text-foreground mb-1.5">{game.name}</span>
                    <p className="text-sm text-muted-foreground flex-1 line-clamp-2 leading-relaxed">
                      {game.description}
                    </p>

                    <div
                      className="flex items-center gap-1.5 mt-4 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
                      style={{ color: meta.color }}
                    >
                      Play Free
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

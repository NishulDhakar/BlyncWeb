'use client';

import Link from "next/link";
import { gameCards } from "@/data/GamesData";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight, Shuffle, Hash, Brain, MoveRight, Eye, Grid2X2, Lock, Zap } from "lucide-react";
import { useUser } from "@/context/UserContext";

const GAME_META: Record<number, { icon: React.ReactNode; accent: string; glow: string }> = {
  1: {
    icon: <Shuffle className="w-5 h-5" />,
    accent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    glow: "group-hover:border-blue-500/40 group-hover:shadow-blue-500/5",
  },
  2: {
    icon: <Brain className="w-5 h-5" />,
    accent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glow: "group-hover:border-emerald-500/40 group-hover:shadow-emerald-500/5",
  },
  3: {
    icon: <Hash className="w-5 h-5" />,
    accent: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    glow: "group-hover:border-violet-500/40 group-hover:shadow-violet-500/5",
  },
  4: {
    icon: <MoveRight className="w-5 h-5" />,
    accent: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    glow: "group-hover:border-orange-500/40 group-hover:shadow-orange-500/5",
  },
  5: {
    icon: <Grid2X2 className="w-5 h-5" />,
    accent: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    glow: "group-hover:border-slate-500/40 group-hover:shadow-slate-500/5",
  },
  6: {
    icon: <Eye className="w-5 h-5" />,
    accent: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    glow: "group-hover:border-pink-500/40 group-hover:shadow-pink-500/5",
  },
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function GamesCard() {
  const user = useUser();
  const isPro = user?.isPro ?? false;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4 pt-6 pb-20"
    >
      {gameCards.map((game) => {
        const isAvailable = game.isAvailable !== false;
        const locked = game.isPremium && !isPro;
        const meta = GAME_META[game.id];

        const href = !isAvailable ? "#" : locked ? "/pricing" : game.rulesLink;

        return (
          <motion.div key={game.id} variants={item}>
            <Link
              href={href}
              aria-disabled={!isAvailable}
              className={cn(
                "group relative flex flex-col gap-4 p-5 rounded-2xl h-full",
                "bg-card border border-border/50",
                "transition-all duration-200 shadow-sm",
                isAvailable && !locked
                  ? cn("hover:shadow-lg", meta.glow)
                  : !isAvailable
                  ? "pointer-events-none opacity-60"
                  : cn("hover:shadow-lg hover:border-yellow-500/30")
              )}
            >
              {/* Premium lock overlay */}
              {locked && (
                <div className="absolute inset-0 rounded-2xl bg-background/30 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
                    <Lock className="w-3 h-3" />
                    Premium
                  </div>
                  <span className="text-[11px] text-muted-foreground">From ₹49/month</span>
                </div>
              )}

              {/* Top row: icon + badge */}
              <div className="flex items-start justify-between">
                <div className={cn("p-2.5 rounded-xl border", meta.accent)}>
                  {meta.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  {game.isPremium && isPro && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                      <Zap className="w-2.5 h-2.5" />
                      Pro
                    </span>
                  )}
                  {!isAvailable && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50">
                      Coming Soon
                    </span>
                  )}
                </div>
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
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors duration-200 mt-auto pt-1",
                  locked
                    ? "text-yellow-500/70 group-hover:text-yellow-400"
                    : "text-foreground/60 group-hover:text-foreground"
                )}>
                  {locked ? (
                    <>
                      Unlock Access
                      <Zap className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                    </>
                  ) : (
                    <>
                      Play Now
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              )}
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

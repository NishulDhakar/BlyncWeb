"use client";

import Link from "next/link";
import { Crown, Lock, CheckCircle2, ArrowRight, ShieldCheck, Zap, ArrowLeft } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { CoolMode } from "@/components/ui/cool-mode";
import { cn } from "@/lib/utils";

interface GamePaywallProps {
  gameName?: string;
  className?: string;
}

export default function GamePaywall({ gameName, className }: GamePaywallProps) {
  return (
    <div className={cn("mx-auto max-w-2xl py-6 sm:py-12 px-4", className)}>
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-card/95 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

        {/* Top badge */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-500 dark:text-amber-400">
            <Crown className="h-4 w-4" />
            <span>Pro Assessment Suite</span>
          </div>

          <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-500 shadow-inner">
            <Lock className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {gameName ? `Unlock ${gameName}` : "Unlock All Assessment Games"}
          </h2>

          <p className="mt-2 max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed">
            Interactive cognitive challenge rounds and mock tests require an active{" "}
            <span className="font-semibold text-foreground">Blync Pro</span> subscription. Upgrade today to unlock the full preparation battery.
          </p>
        </div>

        {/* Value proposition grid */}
        <div className="relative z-10 mt-8 space-y-3 rounded-2xl border border-border/60 bg-muted/30 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-foreground">All 26+ Cognitive & Brain Games</span>
              <p className="text-muted-foreground">Full access to Switch, Grid, Digit, Motion, Deductive & Inductive challenges.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-foreground">Authentic Exam Pacing & Timers</span>
              <p className="text-muted-foreground">Exact test rules and timing used by Capgemini, Cognizant, Accenture, and TCS.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-foreground">Performance Trajectory & Accuracy Analytics</span>
              <p className="text-muted-foreground">Track reaction speed, score progression, and placement readiness benchmark.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-foreground">Global Candidate Leaderboard Ranking</span>
              <p className="text-muted-foreground">Compare your aptitude standing against 2,000+ active test takers.</p>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="relative z-10 mt-8 flex flex-col items-center text-center">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Starting from</span>
            <span className="text-3xl font-extrabold text-foreground">₹49</span>
            <span className="text-xs text-muted-foreground">/ month</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Cancel anytime • Instant access to all games
          </p>

          <div className="mt-5 w-full flex flex-col sm:flex-row gap-3">
            <CoolMode>
              <ShimmerButton
                href="/pricing"
                borderRadius="0.75rem"
                background="hsl(var(--primary))"
                className="w-full flex-1 h-11 text-sm font-semibold shadow-lg text-primary-foreground"
              >
                <Zap className="mr-2 h-4 w-4" />
                <span>Upgrade to Pro — Instant Unlock</span>
              </ShimmerButton>
            </CoolMode>

            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-secondary px-4 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Secure 256-bit payment via Razorpay
            </span>
            <span>•</span>
            <span>6,400+ registered candidates</span>
          </div>
        </div>
      </div>
    </div>
  );
}

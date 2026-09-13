"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Brain,
  Check,
  ChevronRight,
  Download,
  Grid2X2,
  Share,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Button } from "../ui/button";
import { ShimmerButton } from "../ui/shimmer-button";
import { CoolMode } from "../ui/cool-mode";
import { landingHeadingClass, landingSubtitleClass } from "./_ui";

const heroStats = [
  { value: "26+", label: "Assessment games" },
  { value: "6.4k+", label: "Students preparing" },
  { value: "₹49/mo", label: "All games unlocked" },
];

const previewGames = [
  { title: "Switch Challenge", detail: "Rule inference", Icon: Zap },
  { title: "Grid Challenge", detail: "Spatial memory", Icon: Grid2X2 },
  { title: "Deductive Logic", detail: "Constraint solving", Icon: Brain },
];

function AppShowcase() {
  return (
    <div className="mx-auto mt-16 w-full max-w-5xl">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_30px_80px_-40px_rgb(0_0_0/0.35)]">
        <div className="grid min-h-[360px] lg:grid-cols-[220px_1fr]">
          <aside className="hidden flex-col border-r border-border bg-secondary/50 p-5 lg:flex">
            <p className="font-heading text-lg font-bold text-foreground">Blync</p>
            <nav className="mt-8 space-y-1.5">
              {["Practice", "Streaks", "Progress", "Leaderboard"].map((label, i) => (
                <div
                  key={label}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    i === 0
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {label}
                </div>
              ))}
            </nav>
            <div className="mt-auto rounded-lg border border-border bg-card p-3">
              <p className="text-xs font-semibold text-muted-foreground">Today</p>
              <p className="mt-1 text-base font-bold text-foreground">4 rounds cleared</p>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Practice dashboard
                </p>
                <p className="mt-1 font-heading text-xl font-bold text-foreground sm:text-2xl">
                  Placement rounds ready
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-bold text-foreground">
                <span className="size-1.5 rounded-full bg-foreground" />
                Live
              </span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <div className="flex items-end gap-3">
                <span className="font-serif text-7xl italic leading-none text-foreground sm:text-8xl">
                  13
                </span>
                <span className="mb-2 text-xl font-bold text-muted-foreground">games</span>
              </div>
              <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-muted-foreground">
                Cognitive drills, puzzle rounds and timed mocks in one quiet workspace.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {previewGames.map(({ title, detail, Icon }) => (
                <div key={title} className="rounded-xl border border-border bg-secondary/40 p-4">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Icon className="size-4" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-foreground">{title}</p>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { canInstall, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const installButton = isInstalled ? (
    <Button
      size="lg"
      variant="outline"
      className="h-12 rounded-full px-6 text-sm font-semibold"
      disabled
    >
      <Check className="size-4" />
      App installed
    </Button>
  ) : canInstall ? (
    <CoolMode>
      <Button
        size="lg"
        variant="outline"
        className="h-12 rounded-full px-6 text-sm font-semibold"
        onClick={install}
      >
        <Download className="size-4" />
        Install app
      </Button>
    </CoolMode>
  ) : isIOS ? (
    <CoolMode>
      <Button
        size="lg"
        variant="outline"
        className="h-12 rounded-full px-6 text-sm font-semibold"
        onClick={() => setShowIOSGuide((v) => !v)}
      >
        <Smartphone className="size-4" />
        Install app
      </Button>
    </CoolMode>
  ) : (
    <CoolMode>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="h-12 rounded-full px-6 text-sm font-semibold"
      >
        <Link href="/games">
          Browse all games
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </CoolMode>
  );

  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/trendybg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
        className="-z-20 object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-background/35"
      />
      {/* Background: soft grid + a single quiet glow. Decorative only. */}
      <div
        aria-hidden="true"
        className="bg-grid-soft pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 -z-10 h-72 w-[70%] -translate-x-1/2 rounded-full bg-foreground/[0.06] blur-3xl"
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 pt-32 pb-16 text-center sm:pt-36 lg:pt-40">

        <h1 className={`mt-7 max-w-6xl ${landingHeadingClass}`}>
          A quiet practice space for
          <br />
          <span>game-based aptitude tests.</span>
        </h1>

        <p className={landingSubtitleClass}>
          Play every cognitive challenge from the real placement rounds — Switch,
          Grid, Digit, Motion, Inductive and Deductive — with exam-accurate timing,
          full solutions, and nothing to install.
        </p>

        <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <CoolMode>
            <ShimmerButton
              href="/games/cognitive"
              className="h-12 px-7 text-sm font-semibold shadow-lg"
            >
              Start practising now
              <ArrowUpRight className="size-4" />
            </ShimmerButton>
          </CoolMode>
          {installButton}
        </div>

        {showIOSGuide && isIOS && (
          <div className="mt-5 w-full max-w-sm rounded-2xl border border-border bg-card p-4 text-left shadow-lg">
            <p className="text-sm font-bold text-foreground">Install Blync on your iPhone</p>
            <div className="mt-3 space-y-2 text-sm font-medium leading-6 text-muted-foreground">
              <p>
                1. Tap the <Share className="inline size-4 text-foreground" /> share button in
                Safari.
              </p>
              <p>2. Choose Add to Home Screen.</p>
              <p>3. Tap Add, then open Blync from your home screen.</p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-3 text-sm font-bold text-foreground"
            >
              Got it
            </button>
          </div>
        )}

        <dl className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-serif text-4xl italic leading-none text-foreground">
                {stat.value}
              </dd>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>

        <AppShowcase />
      </div>
    </section>
  );
}

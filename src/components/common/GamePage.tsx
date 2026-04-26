import React from "react";
import Link from "next/link";
import Music from "./music";
import { Trophy } from "lucide-react";

interface GamePageProps {
  title: string;
  level: number;
  timer: string | number;
  children: React.ReactNode;
  extraHeaderContent?: React.ReactNode;
}

const GamePage: React.FC<GamePageProps> = ({
  title,
  level,
  timer,
  children,
  extraHeaderContent,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center relative overflow-x-hidden">

      {/* ── HUD ── */}
      <header className="w-full z-10 mt-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">

          <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-card border border-border/50 shadow-sm">

            {/* Left: Music + Level */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Music />

              <div className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-muted/50 border border-border/40 min-w-13">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-none mb-0.5">
                  Level
                </span>
                <span className="text-base font-black tabular-nums leading-none">{level}</span>
              </div>
            </div>

            {/* Center: Title — desktop only */}
            <div className="hidden sm:flex flex-1 justify-center">
              <div className="px-4 py-1.5 rounded-xl bg-primary/8 border border-primary/15">
                <span className="text-sm font-semibold text-primary/80 tracking-wide">{title}</span>
              </div>
            </div>

            {/* Right: Extra + Timer + Rank */}
            <div className="flex items-center gap-2.5 shrink-0">
              {extraHeaderContent && (
                <div className="hidden sm:block">{extraHeaderContent}</div>
              )}

              <div className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-muted/50 border border-border/40 min-w-[56px]">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-none mb-0.5">
                  Time
                </span>
                <span className="text-base font-black font-mono tabular-nums leading-none">{timer}</span>
              </div>

              <Link
                href="/leaderboard"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 hover:border-amber-400/35 transition-all duration-200"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 hidden xs:block">Rank</span>
              </Link>
            </div>
          </div>

          {/* Mobile: title + extra row */}
          <div className="flex sm:hidden items-center justify-between mt-2 px-1">
            <span className="text-xs font-semibold text-primary/70 tracking-wide">{title}</span>
            {extraHeaderContent && <div>{extraHeaderContent}</div>}
          </div>

        </div>
      </header>

      {/* ── Game content ── */}
      <main className="relative z-10 w-full max-w-2xl px-4 md:px-0 mt-8 mb-16 flex flex-col items-center">
        {children}
      </main>

      {/* ── Footer links ── */}
      <footer className="relative z-10 w-full max-w-2xl px-4 md:px-0 mb-12">
        <div className="border-t border-border/30 pt-8">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-4">
            More Challenges
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { href: "/games/cognitive",     label: "Capgemini Assessments" },
              { href: "/cognizant-games",      label: "Cognizant GenC Prep" },
              { href: "/rules/switch-challenge", label: "Switch Guide" },
              { href: "/play/grid-challenge",  label: "Grid Challenge" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground/50 border border-border/30 hover:text-foreground/80 hover:border-border/60 hover:bg-muted/30 transition-all duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
};

export default GamePage;

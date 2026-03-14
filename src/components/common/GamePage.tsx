import React from "react";
import Link from "next/link";
import Music from "./music";

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

      {/* ── Ambient background glows ─────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-700/8 rounded-full blur-[140px]" />
      </div>

      {/* ── HUD Header ───────────────────────────────────────────── */}
      <header className="w-full z-10 mt-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">

          {/* Outer HUD frame */}
          <div className="relative flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)]">

            {/* Left cluster — Music + Level */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Music toggle */}
              <Music />

              {/* Level pill */}
              <div className="flex flex-col items-center px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 min-w-[56px]">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 leading-none mb-0.5">Level</span>
                <span className="text-base font-black text-white tabular-nums leading-none">{level}</span>
              </div>
            </div>

            {/* Center — Game title */}
            <div className="hidden sm:flex flex-1 justify-center">
              <div className="px-4 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <span className="text-sm font-bold text-indigo-300 tracking-wide">{title}</span>
              </div>
            </div>

            {/* Right cluster — Timer + Extra + Rank */}
            <div className="flex items-center gap-2.5 shrink-0">

              {/* Extra content slot (e.g. score) */}
              {extraHeaderContent && (
                <div className="hidden sm:block">
                  {extraHeaderContent}
                </div>
              )}

              {/* Timer */}
              <div className="relative flex flex-col items-center px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 min-w-[60px]">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 leading-none mb-0.5">Time</span>
                <span className="text-base font-black font-mono text-white tabular-nums leading-none">{timer}</span>
                {/* Subtle glow when low time — always-on subtle pulse */}
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none" />
              </div>

              {/* Rank CTA */}
              <Link
                href="/leaderboard"
                className="group flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/25 hover:bg-amber-500/25 hover:border-amber-400/40 transition-all duration-200"
              >
                {/* Star icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold text-amber-300 hidden xs:block">Rank</span>
              </Link>
            </div>
          </div>

          {/* Mobile: game title + extra content row */}
          <div className="flex sm:hidden items-center justify-between mt-2 px-1">
            <span className="text-xs font-semibold text-indigo-400 tracking-wide">{title}</span>
            {extraHeaderContent && <div>{extraHeaderContent}</div>}
          </div>

        </div>
      </header>

      {/* ── Scan-line decoration (subtle immersion) ─────────────── */}
      <div
        className="pointer-events-none fixed inset-0 -z-0 opacity-[0.015]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* ── Game content ─────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-2xl px-4 md:px-0 mt-8 mb-16 flex flex-col items-center">
        {children}
      </main>

      {/* ── Discover more ────────────────────────────────────────── */}
      <footer className="relative z-10 w-full max-w-2xl px-4 md:px-0 mb-12">
        <div className="border-t border-white/8 pt-8">
          <p className="text-center text-[11px] font-bold uppercase tracking-widest text-white/20 mb-4">
            More Challenges
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              { href: "/games/cognitive", label: "Capgemini Assessments" },
              { href: "/cognizant-games", label: "Cognizant GenC Prep" },
              { href: "/rules/switch-challenge", label: "Switch Guide" },
              { href: "/play/grid-challenge", label: "Grid Challenge" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium
                           text-white/40 border border-white/10
                           hover:text-white/80 hover:border-white/25 hover:bg-white/5
                           transition-all duration-200"
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

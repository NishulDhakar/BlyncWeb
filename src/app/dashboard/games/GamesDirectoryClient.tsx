"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Clock,
  BookOpen,
  ArrowRightLeft,
  Calculator,
  LayoutGrid,
  Move,
  Puzzle,
  Binary,
  Route,
  KeyRound,
  HelpCircle,
  Mic,
  Headphones,
  FileText,
  MessageSquare,
  Brain,
  RotateCcw,
  Hash,
  Grid3X3,
  Flag,
  X,
  Activity,
  Layers,
  Target,
  Dices,
  Gamepad2,
  SlidersHorizontal,
  CheckCircle2,
  Crown,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import type { GameDefinition, GameCategory, CompanySlug } from "@/games/types";

const GAME_ICON_MAP: Record<string, LucideIcon> = {
  "switch-challenge": ArrowRightLeft,
  "digit-challenge": Calculator,
  "grid-challenge": LayoutGrid,
  "motion-challenge": Move,
  "motion-challenge-advanced": Move,
  "deductive-challenge": Puzzle,
  "bubble-math": Binary,
  "grid-puzzle": LayoutGrid,
  "path-finder": Route,
  "key-and-door": KeyRound,
  "accenture-technical-quiz": HelpCircle,
  "read-aloud": Mic,
  "listen-and-repeat": Headphones,
  "grammar-round": BookOpen,
  "comprehension-round": FileText,
  "open-response": MessageSquare,
  "inductive-challenge": Brain,
  "recall-challenge": RotateCcw,
  "sudoku": Hash,
  "15-puzzle": Grid3X3,
  "minesweeper": Flag,
  "tic-tac-toe": X,
  "snake": Activity,
  "memory-match-pairs": Layers,
  "ant-smasher": Target,
  "dice-roller": Dices,
};

interface GameWithHref extends GameDefinition {
  href: string;
}

interface Props {
  games: GameWithHref[];
}

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "All Games" },
  { id: "cognitive", label: "Cognitive Reasoning" },
  { id: "memory", label: "Working Memory" },
  { id: "quiz", label: "Technical Quizzes" },
  { id: "communication", label: "Communication Tests" },
  { id: "brain", label: "Brain & Strategy" },
];

const COMPANIES: { id: string; label: string }[] = [
  { id: "all", label: "All Employers" },
  { id: "capgemini", label: "Capgemini" },
  { id: "cognizant", label: "Cognizant" },
  { id: "accenture", label: "Accenture" },
  { id: "general", label: "General" },
];

const DIFFICULTIES = ["all", "easy", "medium", "hard"] as const;

export default function GamesDirectoryClient({ games }: Props) {
  const user = useUser();
  const isPro = user?.isPro ?? false;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = game.name.toLowerCase().includes(q);
        const matchesTagline = game.tagline.toLowerCase().includes(q);
        const matchesSkills = game.skills.some((s) => s.toLowerCase().includes(q));
        const matchesCompany = game.company.toLowerCase().includes(q);
        if (!matchesName && !matchesTagline && !matchesSkills && !matchesCompany) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== "all" && game.category !== selectedCategory) {
        return false;
      }

      // Company
      if (selectedCompany !== "all" && game.company !== selectedCompany) {
        return false;
      }

      // Difficulty
      if (selectedDifficulty !== "all" && game.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    });
  }, [games, searchQuery, selectedCategory, selectedCompany, selectedDifficulty]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCompany("all");
    setSelectedDifficulty("all");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Assessment & Practice Games
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Complete library of cognitive aptitude rounds, reasoning challenges, and hiring assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{games.length} Live Games</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ───────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-2xs">
        {/* Search input */}
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by game title, tested skill, or company..."
            className="h-9 w-full rounded-lg border border-border/70 bg-muted/20 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-border focus:bg-background focus:outline-none"
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/60">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                  selectedCategory === cat.id
                    ? "bg-secondary text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Company & Difficulty selects */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="h-7 rounded-md border border-border/70 bg-muted/20 px-2 text-xs font-medium text-foreground focus:outline-none cursor-pointer"
            >
              {COMPANIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-popover text-popover-foreground">
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="h-7 rounded-md border border-border/70 bg-muted/20 px-2 text-xs font-medium text-foreground focus:outline-none cursor-pointer capitalize"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d} className="bg-popover text-popover-foreground">
                  {d === "all" ? "All Difficulties" : `${d.charAt(0).toUpperCase() + d.slice(1)}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Active Filters Summary / Results Count ─────────────────────── */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing <span className="font-semibold text-foreground">{filteredGames.length}</span> of{" "}
          {games.length} games
        </span>

        {(searchQuery || selectedCategory !== "all" || selectedCompany !== "all" || selectedDifficulty !== "all") && (
          <button
            onClick={resetFilters}
            className="text-xs font-medium text-primary hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Games Grid ─────────────────────────────────────────────────── */}
      {filteredGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Gamepad2 className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-sm font-semibold text-foreground">No matching games found</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            Try adjusting your search query or removing category/company filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 inline-flex h-8 items-center justify-center rounded-lg border border-border/80 bg-secondary px-3 text-xs font-medium text-foreground hover:bg-secondary/80 cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGames.map((game) => {
            const Icon = GAME_ICON_MAP[game.slug] ?? Gamepad2;
            const companyLabel =
              game.company === "general"
                ? "General"
                : game.company.charAt(0).toUpperCase() + game.company.slice(1);

            return (
              <div
                key={game.slug}
                className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all duration-150 hover:border-border hover:shadow-2xs"
              >
                <div>
                  {/* Top row: Icon + Duration */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/40 text-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{game.duration}</span>
                    </div>
                  </div>

                  {/* Title & Badges */}
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {game.name}
                    </h3>

                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="rounded border border-border/70 bg-muted/40 px-1.5 py-0.2 text-[9px] font-medium text-muted-foreground">
                        {companyLabel}
                      </span>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider",
                          game.difficulty === "easy" &&
                            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                          game.difficulty === "medium" &&
                            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
                          game.difficulty === "hard" &&
                            "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                        )}
                      >
                        {game.difficulty}
                      </span>
                      <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1">
                        <Crown className="h-2.5 w-2.5" />
                        Pro
                      </span>
                    </div>
                  </div>

                  {/* Tagline */}
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {game.tagline}
                  </p>

                  {/* Tested Skills */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {game.skills.slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2">
                  <Link
                    href={isPro ? game.href : "/pricing"}
                    className={cn(
                      "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-opacity cursor-pointer",
                      isPro
                        ? "border-border/80 bg-foreground text-background hover:opacity-90"
                        : "border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25"
                    )}
                  >
                    {!isPro && <Lock className="h-3 w-3" />}
                    <span>{isPro ? "Play Now" : "Unlock with Pro"}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>

                  {game.hasRulesPage && (
                    <Link
                      href={`/rules/${game.slug}`}
                      aria-label={`View rules and guide for ${game.name}`}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-border/70 bg-muted/20 px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                      title="View rules and instructions"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

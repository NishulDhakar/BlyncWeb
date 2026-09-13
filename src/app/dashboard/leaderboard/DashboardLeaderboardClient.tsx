"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Crown,
  Medal,
  Search,
  ArrowRight,
  Gamepad2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  LeaderboardEntry,
  UserStanding,
  LeaderboardPlatformStats,
} from "@/features/leaderboard/actions";

interface Props {
  entries: LeaderboardEntry[];
  userStanding: UserStanding | null;
  stats: LeaderboardPlatformStats;
  selectedGame: string;
  currentUserId?: string;
}

const GAME_OPTIONS = [
  { id: "overall", name: "Overall Ranking", tag: "Combined" },
  { id: "switch-challenge", name: "Switch Challenge", tag: "Capgemini" },
  { id: "digit-challenge", name: "Digit Challenge", tag: "Capgemini" },
  { id: "deductive-challenge", name: "Deductive Challenge", tag: "Capgemini / Deloitte" },
  { id: "motion-challenge", name: "Motion Challenge", tag: "Accenture" },
  { id: "grid-challenge", name: "Grid Challenge", tag: "TCS" },
  { id: "inductive-challenge", name: "Inductive Challenge", tag: "EY" },
];

function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardLeaderboardClient({
  entries,
  userStanding,
  stats,
  selectedGame,
  currentUserId,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

  const handleGameSelect = (gameId: string) => {
    startTransition(() => {
      if (gameId === "overall") {
        router.push("/dashboard/leaderboard");
      } else {
        router.push(`/dashboard/leaderboard?game=${gameId}`);
      }
    });
  };

  // Filter entries by candidate search query
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase().trim();
    return entries.filter((e) => e.name?.toLowerCase().includes(q));
  }, [entries, searchQuery]);

  const top3 = useMemo(() => entries.slice(0, 3), [entries]);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Candidate Leaderboard
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Real-time aptitude rankings across {stats.activeCandidates.toLocaleString()} candidates and {stats.totalRounds.toLocaleString()} assessment rounds.
          </p>
        </div>

        {/* Platform KPI Badges */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground uppercase font-medium">
              Candidates
            </span>
            <span className="font-bold text-foreground tabular-nums">
              {stats.activeCandidates.toLocaleString()}
            </span>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground uppercase font-medium">
              Rounds
            </span>
            <span className="font-bold text-foreground tabular-nums">
              {stats.totalRounds.toLocaleString()}
            </span>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground uppercase font-medium">
              Peak Score
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {stats.leaderScore.toLocaleString()} pts
            </span>
          </div>
        </div>
      </div>

      {/* ── Current Candidate Standing Banner ────────────────────────── */}
      {userStanding ? (
        <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-sm sm:text-base">
              #{userStanding.rank}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-foreground">
                  Your Standing
                </span>
                <span className="rounded bg-primary/15 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                  {userStanding.percentile}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {userStanding.score.toLocaleString()} points earned across {userStanding.gamesPlayed} {userStanding.gamesPlayed === 1 ? "round" : "rounds"}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            <Link
              href="/dashboard/games"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <span>Play to Rank Up</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              You haven&apos;t completed an assessment round yet. Play any game to join the global rankings!
            </span>
          </div>
          <Link
            href="/dashboard/games"
            className="inline-flex h-7 items-center gap-1 rounded-md bg-foreground px-2.5 text-xs font-medium text-background hover:bg-foreground/90 transition-colors w-fit"
          >
            <span>Start Practicing</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* ── Game Filter Tabs ─────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {GAME_OPTIONS.map((g) => {
          const isActive = selectedGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => handleGameSelect(g.id)}
              disabled={isPending}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                isActive
                  ? "border-primary bg-primary/10 text-foreground font-semibold shadow-2xs"
                  : "border-border/60 bg-card/60 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <span>{g.name}</span>
              <span
                className={cn(
                  "text-[9px] rounded px-1 py-0.2",
                  isActive
                    ? "bg-primary/20 text-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {g.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Top 3 Spotlight Podium Cards ─────────────────────────────── */}
      {top3.length > 0 && !searchQuery && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {top3.map((entry, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;
            const isCurrentUser = entry.userId === currentUserId;

            return (
              <div
                key={entry.userId}
                className={cn(
                  "relative flex flex-col justify-between rounded-xl border p-4 transition-all",
                  isFirst && "border-amber-500/40 bg-amber-500/[0.04] shadow-xs",
                  isSecond && "border-slate-300/40 bg-slate-400/[0.03]",
                  isThird && "border-amber-600/30 bg-amber-600/[0.03]",
                  isCurrentUser && "ring-1 ring-primary"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {isFirst && <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />}
                      {isSecond && <Medal className="h-4 w-4 text-slate-400 fill-slate-400" />}
                      {isThird && <Medal className="h-4 w-4 text-amber-700 fill-amber-700" />}
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Rank #{entry.rank}
                      </span>
                    </div>
                    <span className="rounded bg-muted/60 px-1.5 py-0.2 text-[9px] font-semibold text-muted-foreground">
                      {entry.percentile}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <Avatar className="h-11 w-11 border border-border/70 shrink-0">
                      <AvatarImage src={entry.image ?? undefined} alt={entry.name ?? "Candidate"} />
                      <AvatarFallback className="bg-muted font-bold text-xs">
                        {getInitials(entry.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {entry.name ?? "Anonymous Candidate"}
                        </p>
                        {entry.isPro && (
                          <span className="rounded bg-amber-500/15 px-1 py-0.2 text-[8px] font-bold text-amber-500">
                            PRO
                          </span>
                        )}
                        {isCurrentUser && (
                          <span className="rounded bg-primary/20 px-1 py-0.2 text-[8px] font-bold text-primary">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {entry.gamesPlayed} {entry.gamesPlayed === 1 ? "round" : "rounds"} played
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-border/40 pt-2.5 flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">Best Score</span>
                  <span className="text-base font-bold tabular-nums text-foreground">
                    {entry.score.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">pts</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Search & Table Controls ──────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidate by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 text-xs border-border/60 bg-card"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Showing {filteredEntries.length} ranked candidate{filteredEntries.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* ── Leaderboard Table ────────────────────────────────────────── */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 w-16">Rank</th>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4 w-32 hidden sm:table-cell">Rounds</th>
                <th className="py-3 px-4 w-28 hidden md:table-cell">Percentile</th>
                <th className="py-3 px-4 text-right w-32">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No candidates found matching &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  const isCurrentUser = entry.userId === currentUserId;

                  return (
                    <tr
                      key={entry.userId}
                      className={cn(
                        "transition-colors hover:bg-muted/30",
                        isCurrentUser && "bg-primary/[0.04] font-medium"
                      )}
                    >
                      {/* Rank */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-mono font-bold">
                          {entry.rank === 1 && (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
                              <Crown className="h-3.5 w-3.5 fill-amber-500" />
                            </span>
                          )}
                          {entry.rank === 2 && (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300/20 text-slate-400">
                              <Medal className="h-3.5 w-3.5 fill-slate-400" />
                            </span>
                          )}
                          {entry.rank === 3 && (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-700/20 text-amber-700">
                              <Medal className="h-3.5 w-3.5 fill-amber-700" />
                            </span>
                          )}
                          {entry.rank > 3 && (
                            <span className="text-muted-foreground pl-1">
                              #{entry.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Candidate Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Avatar className="h-7 w-7 border border-border/50 shrink-0">
                            <AvatarImage src={entry.image ?? undefined} alt={entry.name ?? "Candidate"} />
                            <AvatarFallback className="bg-muted text-[10px] font-bold">
                              {getInitials(entry.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="truncate text-xs font-medium text-foreground">
                              {entry.name ?? "Anonymous Candidate"}
                            </span>
                            {entry.isPro && (
                              <span className="rounded bg-amber-500/15 px-1 py-0.2 text-[8px] font-bold text-amber-600 dark:text-amber-400 shrink-0">
                                PRO
                              </span>
                            )}
                            {isCurrentUser && (
                              <span className="rounded bg-primary/20 px-1 py-0.2 text-[8px] font-bold text-primary shrink-0">
                                YOU
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Rounds Completed */}
                      <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell tabular-nums">
                        {entry.gamesPlayed ?? 1} {(entry.gamesPlayed ?? 1) === 1 ? "round" : "rounds"}
                      </td>

                      {/* Percentile */}
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="rounded-md border border-border/40 bg-muted/20 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {entry.percentile}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold tabular-nums text-foreground">
                          {entry.score.toLocaleString()}{" "}
                          <span className="text-[10px] font-normal text-muted-foreground">pts</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

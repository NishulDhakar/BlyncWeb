"use client";

import { useMemo, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Trophy,
  Gamepad2,
  Star,
  LogOut,
  Calendar,
  ArrowRightLeft,
  Binary,
  Move,
  Brain,
  LayoutGrid,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

import { signOut } from "@/features/auth/actions";
import type { ProfileStats } from "@/features/profile/actions";
import type { User } from "@/types/user";

/* ------------------------------------------------ */
/* constants                                        */
/* ------------------------------------------------ */

const GAME_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "switch-challenge": LayoutGrid,
  "digit-challenge": Binary,
  "deductive-challenge": ArrowRightLeft,
  "motion-challenge": Move,
  "inductive-challenge": Brain,
};

const GAME_COLORS: Record<string, string> = {
  "switch-challenge": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  "digit-challenge": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "deductive-challenge": "bg-purple-500/10 text-purple-400 border-purple-500/30",
  "motion-challenge": "bg-orange-500/10 text-orange-400 border-orange-500/30",
  "inductive-challenge": "bg-pink-500/10 text-pink-400 border-pink-500/30",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/* ------------------------------------------------ */
/* Mini bar chart for score history                 */
/* ------------------------------------------------ */

function ScoreChart({ scores }: { scores: number[] }) {
  const max = Math.max(...scores, 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {scores.map((s, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-primary/60 transition-all"
          style={{ height: `${Math.max(10, (s / max) * 100)}%` }}
          title={`${s} pts`}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------ */
/* types                                            */
/* ------------------------------------------------ */

interface Props {
  user: User;
  stats: ProfileStats;
}

/* ------------------------------------------------ */
/* component                                        */
/* ------------------------------------------------ */

export default function ProfileClient({ user, stats }: Props) {
  const handleSignOut = useCallback(async () => {
    await signOut();
    location.href = "/";
  }, []);

  const initials = useMemo(() => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    return user.email[0].toUpperCase();
  }, [user]);

  const statCards = useMemo(
    () => [
      {
        label: "Overall Rank",
        value: stats.rank ? `#${stats.rank}` : "—",
        icon: Trophy,
        color: "text-yellow-500",
      },
      {
        label: "Total Score",
        value: stats.totalScore.toLocaleString(),
        icon: Star,
        color: "text-blue-500",
      },
      {
        label: "Games Played",
        value: stats.totalGamesPlayed,
        icon: Gamepad2,
        color: "text-emerald-500",
      },
      {
        label: "Member Since",
        value: formatDate(stats.memberSince),
        icon: Calendar,
        color: "text-purple-500",
      },
    ],
    [stats]
  );

  const gamesWithHistory = useMemo(
    () =>
      Object.entries(stats.scoreHistory)
        .filter(([, entries]) => entries.length > 0)
        .map(([gameId, entries]) => ({
          gameId,
          entries: [...entries].reverse(), // oldest → newest for the chart
        })),
    [stats.scoreHistory]
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* profile card */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border border-border/50 bg-card/80 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="h-24" />
              <div className="px-6 pb-6 -mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex items-end gap-4">
                  <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mb-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold">{user.name ?? "Anonymous"}</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label}>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{card.label}</span>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className="text-xl font-bold tabular-nums">{card.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* game performance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border border-border/50 bg-card/80 backdrop-blur-xl shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-primary" />
                Game Performance
              </h2>
              {stats.gameStats.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Gamepad2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No games played yet.</p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href="/play/switch-challenge">Play your first game</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.gameStats.map((game, i) => {
                    const Icon = GAME_ICONS[game.gameId] || Gamepad2;
                    return (
                      <motion.div
                        key={game.gameId}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                      >
                        <Link href={`/play/${game.gameId}`}>
                          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/40 transition group cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg border ${GAME_COLORS[game.gameId] ?? "bg-muted text-muted-foreground border-border"}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{game.gameName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {game.gamesPlayed}{" "}
                                  {game.gamesPlayed === 1 ? "session" : "sessions"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="font-mono text-sm font-bold">
                                {game.bestScore.toLocaleString()} pts
                              </Badge>
                              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Score history charts — available to all users for free */}
        {gamesWithHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Card className="border border-border/50 bg-card/80 backdrop-blur-xl shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Score History
                </h2>
                <div className="space-y-6">
                  {gamesWithHistory.map(({ gameId, entries }) => {
                    const Icon = GAME_ICONS[gameId] || Gamepad2;
                    const scores = entries.map((e) => e.score);
                    const best = Math.max(...scores);
                    const latest = scores[scores.length - 1];
                    return (
                      <div key={gameId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg border ${GAME_COLORS[gameId] ?? "bg-muted text-muted-foreground border-border"}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-medium">
                              {stats.gameStats.find((g) => g.gameId === gameId)?.gameName ?? gameId}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Latest: <span className="font-semibold text-foreground">{latest.toLocaleString()}</span></span>
                            <span>Best: <span className="font-semibold text-yellow-400">{best.toLocaleString()}</span></span>
                          </div>
                        </div>
                        <ScoreChart scores={scores} />
                        <p className="text-[10px] text-muted-foreground text-right">
                          Last {entries.length} session{entries.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}



        {/* quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Button asChild variant="outline" size="sm">
            <Link href="/leaderboard">
              <Trophy className="w-4 h-4 mr-2" />
              View Leaderboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/play/switch-challenge">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Play Games
            </Link>
          </Button>
        </motion.div>

      </div>
    </div>
  );
}

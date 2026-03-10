"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { signOut } from "@/features/auth/actions";
import Link from "next/link";
import type { ProfileStats } from "@/features/profile/actions";
import type { User } from "@/types/user";

const GAME_ICONS: Record<string, React.ReactNode> = {
  "switch-challenge": <LayoutGrid className="w-4 h-4" />,
  "digit-challenge": <Binary className="w-4 h-4" />,
  "deductive-challenge": <ArrowRightLeft className="w-4 h-4" />,
  "motion-challenge": <Move className="w-4 h-4" />,
  "inductive-challenge": <Brain className="w-4 h-4" />,
};

const GAME_COLORS: Record<string, string> = {
  "switch-challenge": "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  "digit-challenge": "bg-blue-500/10 text-blue-600 border-blue-200",
  "deductive-challenge": "bg-purple-500/10 text-purple-600 border-purple-200",
  "motion-challenge": "bg-orange-500/10 text-orange-600 border-orange-200",
  "inductive-challenge": "bg-pink-500/10 text-pink-600 border-pink-200",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

interface Props {
  user: User;
  stats: ProfileStats;
}

export default function ProfileClient({ user, stats }: Props) {
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  const statCards = [
    {
      label: "Overall Rank",
      value: stats.rank ? `#${stats.rank}` : "—",
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      bg: "from-yellow-500/10 to-yellow-500/5",
      border: "border-yellow-200",
    },
    {
      label: "Total Score",
      value: stats.totalScore.toLocaleString(),
      icon: <Star className="w-5 h-5 text-blue-500" />,
      bg: "from-blue-500/10 to-blue-500/5",
      border: "border-blue-200",
    },
    {
      label: "Games Played",
      value: stats.totalGamesPlayed,
      icon: <Gamepad2 className="w-5 h-5 text-emerald-500" />,
      bg: "from-emerald-500/10 to-emerald-500/5",
      border: "border-emerald-200",
    },
    {
      label: "Member Since",
      value: formatDate(stats.memberSince),
      icon: <Calendar className="w-5 h-5 text-purple-500" />,
      bg: "from-purple-500/10 to-purple-500/5",
      border: "border-purple-200",
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Profile Card ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border border-border/50 shadow-xl bg-card/80 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-0">
              {/* Banner */}
              <div className="h-24" />
              <div className="px-6 pb-6 -mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex items-end gap-4">
                  <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mb-1">
                    <h1 className="text-xl font-bold text-foreground">
                      {user.name ?? "Anonymous"}
                    </h1>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 shrink-0"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Stat Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {statCards.map((card) => (
            <Card
              key={card.label}
              className={`border ${card.border} shadow-sm`}
            >
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-xl font-bold text-foreground tabular-nums">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* ── Per-Game Breakdown ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border border-border/50 shadow-xl bg-card/80 backdrop-blur-xl">
            <CardContent className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
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
                  {stats.gameStats.map((game, i) => (
                    <motion.div
                      key={game.gameId}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.06 }}
                    >
                      <Link href={`/play/${game.gameId}`}>
                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/40 transition-colors group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg border text-sm ${GAME_COLORS[game.gameId] ?? "bg-muted text-muted-foreground border-border"}`}>
                              {GAME_ICONS[game.gameId] ?? <Gamepad2 className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{game.gameName}</p>
                              <p className="text-xs text-muted-foreground">{game.gamesPlayed} {game.gamesPlayed === 1 ? "session" : "sessions"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <Badge variant="outline" className="font-mono text-sm font-bold">
                                {game.bestScore.toLocaleString()} pts
                              </Badge>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Quick Links ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
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

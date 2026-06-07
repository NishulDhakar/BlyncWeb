'use client';

import type { LeaderboardEntry } from "@/features/leaderboard/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
    Crown, Trophy, Gamepad2, LayoutGrid, Binary,
    ArrowRightLeft, Move, Brain, Sparkles, Medal,
    Star, Flame, Grid2X2
} from "lucide-react";
import { useRouter } from "next/navigation";
import BackToDashboard from "@/components/common/BackToDashboard";
import Container from "@/components/common/Container";
import Image from "next/image";

interface LeaderboardClientProps {
    data: LeaderboardEntry[];
    gameId: string;
    currentUserId?: string;
}

const GAME_TABS = [
    { value: "overall", label: "Overall", icon: Trophy },
    { value: "switch-challenge", label: "Switch", icon: LayoutGrid },
    { value: "grid-challenge", label: "Grid", icon: Grid2X2 },
    { value: "digit-challenge", label: "Digit", icon: Binary },
    { value: "deductive-challenge", label: "Deductive", icon: ArrowRightLeft },
    { value: "motion-challenge", label: "Motion", icon: Move },
    { value: "inductive-challenge", label: "Inductive", icon: Brain },
];

function getMedalConfig(rank: number) {
    if (rank === 1) return {
        glow: "shadow-[0_0_40px_rgba(234,179,8,0.5)]",
        ring: "ring-[3px] ring-yellow-400",
        badge: "bg-yellow-400 text-yellow-900",
        label: "bg-yellow-500/15 text-yellow-300 border border-yellow-400/30",
        bar: "from-yellow-500/20 via-yellow-500/5 to-transparent",
        score: "text-yellow-300",
        icon: <Crown className="h-5 w-5 text-yellow-400 drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]" fill="currentColor" />,
        height: "h-28",
        podiumBg: "bg-gradient-to-b from-yellow-400/20 to-yellow-400/5",
        podiumBorder: "border-yellow-400/30",
    };
    if (rank === 2) return {
        glow: "shadow-[0_0_24px_rgba(209,213,219,0.3)]",
        ring: "ring-[3px] ring-slate-300",
        badge: "bg-slate-300 text-slate-800",
        label: "bg-slate-400/15 text-slate-300 border border-slate-300/30",
        bar: "from-slate-400/15 to-transparent",
        score: "text-slate-200",
        icon: <Medal className="h-5 w-5 text-slate-300" fill="currentColor" />,
        height: "h-20",
        podiumBg: "bg-gradient-to-b from-slate-400/20 to-slate-400/5",
        podiumBorder: "border-slate-400/30",
    };
    return {
        glow: "shadow-[0_0_24px_rgba(217,119,6,0.3)]",
        ring: "ring-[3px] ring-amber-500",
        badge: "bg-amber-600 text-white",
        label: "bg-amber-600/15 text-amber-400 border border-amber-500/30",
        bar: "from-amber-600/15 to-transparent",
        score: "text-amber-400",
        icon: <Medal className="h-5 w-5 text-amber-400" fill="currentColor" />,
        height: "h-14",
        podiumBg: "bg-gradient-to-b from-amber-600/20 to-amber-600/5",
        podiumBorder: "border-amber-500/30",
    };
}

// ─── Podium Component ─────────────────────────────────────────────────────────
function Podium({ top3 }: { top3: LeaderboardEntry[] }) {
    const displayOrder = [
        { entry: top3[1], rank: 2, delay: 0.35 },
        { entry: top3[0], rank: 1, delay: 0.2 },
        { entry: top3[2], rank: 3, delay: 0.5 },
    ].filter(d => d.entry);

    return (
        <div className="flex items-end justify-center gap-4 sm:gap-8 mb-10 px-2 pt-6">
            {displayOrder.map(({ entry, rank, delay }) => {
                const cfg = getMedalConfig(rank);
                const isFirst = rank === 1;

                return (
                    <motion.div
                        key={entry.userId}
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay, type: "spring" as const, stiffness: 120, damping: 14 }}
                        className="flex flex-col items-center"
                    >
                        {/* Medal icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.5, delay: delay + 0.2, type: "spring" as const }}
                            className="mb-2"
                        >
                            {cfg.icon}
                        </motion.div>

                        {/* Avatar */}
                        <div className={`relative mb-3 rounded-full ${cfg.glow}`}>
                            <Avatar className={`
                                ${isFirst ? "h-20 w-20 sm:h-[88px] sm:w-[88px]" : "h-16 w-16 sm:h-20 sm:w-20"}
                                ${cfg.ring}
                            `}>
                                <AvatarImage src={entry.image || undefined} alt={entry.name || "User"} className="object-cover" />
                                <AvatarFallback className={`text-base font-black ${cfg.badge}`}>
                                    {entry.name?.slice(0, 2).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            {/* Rank badge */}
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-lg ${cfg.badge}`}>
                                {rank}
                            </div>
                        </div>

                        {/* Name */}
                        <p className={`font-bold text-center text-sm truncate max-w-[80px] sm:max-w-[100px] ${isFirst ? "text-white" : "text-white/70"}`}>
                            {(entry.name || "User").split(" ")[0]}
                        </p>

                        {/* Score */}
                        <p className={`text-xs font-mono font-bold mt-0.5 ${cfg.score}`}>
                            {entry.score.toLocaleString()}
                            <span className="text-white/30 font-normal ml-0.5">pts</span>
                        </p>

                        {/* Podium block */}
                        <div className={`
                            mt-3 w-[72px] sm:w-24 ${cfg.height}
                            ${cfg.podiumBg} border ${cfg.podiumBorder}
                            rounded-t-2xl backdrop-blur-sm
                            flex items-center justify-center
                        `}>
                            <span className={`text-3xl font-black ${isFirst ? cfg.score : "text-white/20"}`}>
                                {rank}
                            </span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

// ─── My Rank Card ─────────────────────────────────────────────────────────────
function MyRankCard({ userRank }: { userRank: LeaderboardEntry }) {
    const isTop3 = userRank.rank <= 3;
    const cfg = isTop3 ? getMedalConfig(userRank.rank) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
        >
            <div className={`
                relative overflow-hidden rounded-2xl p-5
                flex items-center justify-between gap-4
                ${isTop3
                    ? `border ${cfg!.podiumBorder} bg-gradient-to-r ${cfg!.bar} backdrop-blur-xl`
                    : "border border-white/10 bg-white/5 backdrop-blur-xl"
                }
            `}>
                {/* Left glow accent */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${isTop3 ? cfg!.badge : "bg-primary"}`} />

                <div className="flex items-center gap-4 pl-3">
                    {/* Avatar */}
                    <div className={`relative ${isTop3 ? cfg!.glow + " rounded-full" : ""}`}>
                        <Avatar className={`h-12 w-12 ${isTop3 ? cfg!.ring : "ring-1 ring-white/20"}`}>
                            <AvatarImage src={userRank.image || undefined} alt={userRank.name || "You"} className="object-cover" />
                            <AvatarFallback className={`font-black text-sm ${isTop3 ? cfg!.badge : "bg-primary/20 text-primary"}`}>
                                {userRank.name?.slice(0, 2).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Your Position</p>
                            {isTop3 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${cfg!.label}`}>
                                {userRank.rank === 1 ? "🏆 Champion" : userRank.rank === 2 ? "🥈 Runner-up" : "🥉 3rd Place"}
                            </span>}
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-4xl font-black tabular-nums ${isTop3 ? cfg!.score : "text-white"}`}>
                                #{userRank.rank}
                            </span>
                            <span className="text-xs text-white/30">{userRank.name?.split(" ")[0] || "You"}</span>
                        </div>
                    </div>
                </div>

                {/* Right — score */}
                <div className="text-right pr-1">
                    <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-0.5">Best Score</p>
                    <p className={`text-3xl font-black tabular-nums ${isTop3 ? cfg!.score : "text-white"}`}>
                        {userRank.score.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-white/30">points</p>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Variants ─────────────────────────────────────────────────────────────────
const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.055 } },
};
const rowVariants = {
    hidden: { opacity: 0, x: -14 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LeaderboardClient({ data, gameId, currentUserId }: LeaderboardClientProps) {
    const router = useRouter();

    const userRank = currentUserId ? data.find(e => e.userId === currentUserId) ?? null : null;
    const top3 = data.filter(e => e.rank <= 3);

    const handleTabChange = (value: string) => {
        router.push(value === "overall" ? "/leaderboard" : `/leaderboard?game=${value}`);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* BG */}
            {/* <div className="fixed inset-0 -z-20">
                <Image src="/leaderboard.jpg" alt="Leaderboard background" fill priority className="object-cover" />
            </div> */}
            <div className="fixed inset-0 -z-10 bg-black backdrop-blur-[3px]" />

            {/* Ambient glows */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-yellow-400/6 rounded-full blur-[130px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/6 rounded-full blur-[150px]" />
            </div>

            <Container className="max-w-3xl py-10 relative z-10">
                {/* Back */}
                <div className="mb-8">
                    <BackToDashboard />
                </div>

                {/* ── Header ──────────────────────────── */}
                {/* <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 text-[11px] font-bold tracking-widest uppercase mb-5"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        Hall of Fame
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-none mb-3">
                        Leader<span className="text-yellow-300">board</span>
                    </h1>
                    <p className="text-sm text-white/35 font-light max-w-xs mx-auto">
                        Top performers across all Capgemini cognitive challenges
                    </p>
                </motion.div> */}
                
                {/* Podium */}
                {top3.length >= 2 && <Podium top3={top3} />}
                {/* ── Tabs ────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                >
                    <Tabs defaultValue={gameId} onValueChange={handleTabChange} className="w-full">
                        {/* Tab bar */}
                        <div className="hidden md:flex justify-center mb-8">
                            <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl h-auto shadow-2xl flex-wrap gap-1 justify-center">
                                {GAME_TABS.map(({ value, label, icon: Icon }) => (
                                    <TabsTrigger
                                        key={value}
                                        value={value}
                                        className="rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white/40
                                                   data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-md
                                                   hover:text-white/70 transition-all duration-200 flex items-center gap-1.5"
                                    >
                                        <Icon className="h-3.5 w-3.5 shrink-0" />
                                        <span>{label}</span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {/* ── Tab content – one panel for all (data is already filtered by server) ── */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={gameId}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.28 }}
                            >
                                {/* ── Rank Table ── */}
                                <Card className="border-0 bg-white/5 backdrop-blur-xl ring-1 ring-white/10 rounded-2xl shadow-2xl overflow-hidden">
                                    <CardContent className="p-0">
                                        {data.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-32 text-white/25">
                                                <Gamepad2 className="h-14 w-14 mb-4 opacity-25" />
                                                <p className="text-lg font-bold">No champions yet</p>
                                                <p className="text-sm mt-1 opacity-60">Be the first to claim the top spot!</p>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Header row */}
                                                <div className="flex items-center justify-between px-5 sm:px-6 py-2.5 border-b border-white/6 bg-white/4">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Rank · Player</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Score</span>
                                                </div>

                                                {/* Rows */}
                                                <motion.div
                                                    variants={listVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                >
                                                    {data.map((entry) => {
                                                        const isTop3 = entry.rank <= 3;
                                                        const isCurrent = !!currentUserId && entry.userId === currentUserId;
                                                        const cfg = isTop3 ? getMedalConfig(entry.rank) : null;

                                                        return (
                                                            <motion.div
                                                                key={entry.userId}
                                                                variants={rowVariants}
                                                                className={`
                                                                    flex items-center justify-between
                                                                    px-5 sm:px-6 py-3.5
                                                                    border-b border-white/5 last:border-0
                                                                    transition-colors duration-150
                                                                    ${isCurrent
                                                                        ? "bg-primary/10 border-l-2 border-l-primary/70"
                                                                        : isTop3
                                                                            ? `bg-gradient-to-r ${cfg!.bar}`
                                                                            : "hover:bg-white/4"
                                                                    }
                                                                `}
                                                            >
                                                                {/* Left: rank + avatar + name */}
                                                                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                                                    {/* Rank */}
                                                                    <div className="w-8 shrink-0 flex justify-center">
                                                                        {isTop3 ? (
                                                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${cfg!.badge}`}>
                                                                                {entry.rank}
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-sm font-bold text-white/25 tabular-nums text-center w-full">{entry.rank}</span>
                                                                        )}
                                                                    </div>

                                                                    {/* Avatar */}
                                                                    <Avatar className={`h-9 w-9 sm:h-10 sm:w-10 shrink-0 ${isTop3 ? cfg!.ring : "ring-1 ring-white/10"}`}>
                                                                        <AvatarImage src={entry.image || undefined} alt={entry.name || "User"} className="object-cover" />
                                                                        <AvatarFallback className={`text-xs font-black ${isTop3 ? cfg!.badge : "bg-white/8 text-white/60"}`}>
                                                                            {entry.name?.slice(0, 2).toUpperCase() || "U"}
                                                                        </AvatarFallback>
                                                                    </Avatar>

                                                                    {/* Name + labels */}
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            <span className={`font-bold text-sm truncate ${isCurrent ? "text-primary" : isTop3 ? "text-white" : "text-white/85"}`}>
                                                                                {entry.name || "Anonymous"}
                                                                            </span>
                                                                            {isCurrent && (
                                                                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/25 text-primary font-bold shrink-0">
                                                                                    YOU
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {isTop3 && (
                                                                            <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full font-semibold mt-0.5 ${cfg!.label}`}>
                                                                                {entry.rank === 1 ? "🏆 Champion" : entry.rank === 2 ? "🥈 Runner-up" : "🥉 3rd Place"}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Right: score */}
                                                                <div className="pl-3 shrink-0 text-right">
                                                                    <span className={`font-mono font-black text-base sm:text-lg tabular-nums ${entry.rank === 1 ? "text-yellow-300" :
                                                                            entry.rank === 2 ? "text-slate-200" :
                                                                                entry.rank === 3 ? "text-amber-400" :
                                                                                    isCurrent ? "text-primary" : "text-white/70"
                                                                        }`}>
                                                                        {entry.score.toLocaleString()}
                                                                    </span>
                                                                    <span className="text-[10px] ml-0.5 text-white/25">pts</span>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </motion.div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* ── My Rank card (below table) ── */}
                                {userRank && <MyRankCard userRank={userRank} />}
                            </motion.div>
                        </AnimatePresence>
                    </Tabs>
                </motion.div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center text-[11px] text-white/20 mt-8"
                >
                    Updated in real-time · Only your best score per game counts toward ranking
                </motion.p>
            </Container>
        </div>
    );
}

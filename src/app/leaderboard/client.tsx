'use client';

import type { LeaderboardEntry } from "@/features/leaderboard/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Medal, Trophy, ArrowLeft, Gamepad2, LayoutGrid, Binary, ArrowRightLeft, ChevronDown, Move, Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import BackToDashboard from "@/components/common/BackToDashboard";
import Container from "@/components/common/Container";
import { useState } from "react";
import Image from "next/image";

interface LeaderboardClientProps {
    data: LeaderboardEntry[];
    gameId: string;
    currentUserId?: string;
}

export default function LeaderboardClient({ data, gameId, currentUserId }: LeaderboardClientProps) {
    const router = useRouter();
    const [isExplanationOpen, setIsExplanationOpen] = useState(false);

    // Find current user's rank
    const userRank = currentUserId ? data.find(entry => entry.userId === currentUserId) : null;

    const handleTabChange = (value: string) => {
        if (value === 'overall') {
            router.push('/leaderboard');
        } else {
            router.push(`/leaderboard?game=${value}`);
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Crown className="h-8 w-8 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" fill="currentColor" />
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Medal className="h-7 w-7 text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]" fill="currentColor" />
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Medal className="h-7 w-7 text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]" fill="currentColor" />
                    </motion.div>
                );
            default:
                return <span className="text-xl font-bold text-muted-foreground/50 w-8 text-center tabular-nums">{rank}</span>;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Fixed Background */}
            <div className="fixed inset-0 ">
                <Image
                    src="/leaderboard.jpg"
                    alt="Background"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            {/* Optional dark overlay for readability */}
            <div className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-[1px]" />

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <Container className="max-w-5xl py-12 relative z-10">
                <div className="flex items-center mb-12">
                    <BackToDashboard />
                </div>

                <div className="text-center mb-12 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
                            Leaderboard
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto font-light"
                    >
                        Celebrating the brilliant minds mastering our cognitive challenges.
                    </motion.p>
                </div>

                {/* User's Current Rank Display */}
                {userRank && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mb-8"
                    >
                        <Card className="border-2 border-primary/30 shadow-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-xl">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-primary/20">
                                            <Trophy className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground font-medium">Your Current Rank</p>
                                            <p className="text-3xl font-bold text-primary">#{userRank.rank}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground font-medium">Your Score</p>
                                        <p className="text-3xl font-bold">{userRank.score.toLocaleString()}<span className="text-sm ml-1 text-muted-foreground">pts</span></p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* How Rankings Work Explanation - Collapsible */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mb-8"
                >
                    <Card className="border border-border/50 shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
                        <CardHeader
                            className="pb-4 cursor-pointer hover:bg-accent/5 transition-colors"
                            onClick={() => setIsExplanationOpen(!isExplanationOpen)}
                        >
                            <CardTitle className="text-lg flex items-center justify-between gap-2">
                                <div className="flex mt-6 items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-blue-500/10">
                                        <Trophy className="h-4 w-4 text-blue-500" />
                                    </div>
                                    How Rankings Work
                                </div>
                                <motion.div
                                    animate={{ rotate: isExplanationOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className="h-5 w-5 mt-6 text-muted-foreground" />
                                </motion.div>
                            </CardTitle>
                        </CardHeader>
                        <AnimatePresence initial={false}>
                            {isExplanationOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <CardContent className="space-y-3 text-sm pt-0">
                                        {gameId === 'overall' ? (
                                            <>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    <span className="font-semibold text-foreground">Overall Ranking</span> is calculated by adding your <span className="font-medium text-foreground">best score from each game</span>. Only your highest score per game counts toward your total.
                                                </p>
                                                <div className="bg-muted/90 mb-8 rounded-lg p-3 space-y-1.5">
                                                    <p className="text-xs text-muted-foreground font-medium">Example:</p>
                                                    <ul className="text-xs space-y-1 text-muted-foreground">
                                                        <li>• Switch Challenge: Best score = <span className="font-mono text-foreground">85</span> pts</li>
                                                        <li>• Digit Challenge: Best score = <span className="font-mono text-foreground">72</span> pts</li>
                                                        <li>• Deductive Challenge: Best score = <span className="font-mono text-foreground">63</span> pts</li>
                                                        <li>• Motion Challenge: Best score = <span className="font-mono text-foreground">54</span> pts</li>
                                                        <li>• Inductive Challenge: Best score = <span className="font-mono text-foreground">47</span> pts</li>
                                                        <li className="pt-1 border-t border-border/50 font-semibold text-foreground mb-2 mt-4">→ Total Score = <span className="font-mono">321</span> pts</li>
                                                    </ul>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    <span className="font-semibold text-foreground">Game-Specific Ranking</span> shows your <span className="font-medium text-foreground">highest score</span> for this particular game. If you play multiple times, only your best performance counts.
                                                </p>
                                                <div className="bg-muted/30 rounded-lg p-3">
                                                    <p className="text-xs text-muted-foreground">
                                                        💡 <span className="font-medium">Tip:</span> Each correct answer earns you points. Complete more levels and answer accurately to climb the ranks!
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </motion.div>

                <Tabs defaultValue={gameId} onValueChange={handleTabChange} className="w-full space-y-8">
                    <div className="flex justify-center">
                        <TabsList className="bg-background/80 backdrop-blur-xl border border-border/50 p-1 rounded-full h-auto gap-0 md:gap-4 shadow-lg flex-wrap justify-center sm:flex-nowrap">
                            <TabsTrigger
                                value="overall"
                                className="rounded-full px-4 py-2 text-sm sm:px-6 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex-1 sm:flex-none min-w-[20px] md:min-w-[100px]"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>Overall</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="switch-challenge"
                                className="rounded-full px-4 py-2 text-sm sm:px-6 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex-1 sm:flex-none min-w-[20px] md:min-w-[100px]"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>Switch</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="digit-challenge"
                                className="rounded-full px-4 py-2 text-sm sm:px-6 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex-1 sm:flex-none min-w-[100px]"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Binary className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>Digit</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="deductive-challenge"
                                className="rounded-full px-4 py-2 text-sm sm:px-6 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex-1 sm:flex-none min-w-[100px]"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <ArrowRightLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>Deductive</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="motion-challenge"
                                className="rounded-full px-4 py-2 text-sm sm:px-6 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex-1 sm:flex-none min-w-[100px]"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Move className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>Motion</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="inductive-challenge"
                                className="rounded-full px-4 py-2 text-sm sm:px-6 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex-1 sm:flex-none min-w-[100px]"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>Inductive</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={gameId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-xl overflow-hidden ring-1 ring-white/10">
                                <CardHeader className="border-b border-border/10 bg-muted/5 p-6">
                                    <CardTitle className="text-2xl flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            {gameId === 'overall' && <Trophy className="h-6 w-6 text-primary" />}
                                            {gameId === 'switch-challenge' && <LayoutGrid className="h-6 w-6 text-primary" />}
                                            {gameId === 'digit-challenge' && <Binary className="h-6 w-6 text-primary" />}
                                            {gameId === 'deductive-challenge' && <ArrowRightLeft className="h-6 w-6 text-primary" />}
                                            {gameId === 'motion-challenge' && <Move className="h-6 w-6 text-primary" />}
                                            {gameId === 'inductive-challenge' && <Brain className="h-6 w-6 text-primary" />}
                                        </div>
                                        <span>Top Performers</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {data.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground bg-muted/5">
                                            <Gamepad2 className="h-16 w-16 mb-4 opacity-20" />
                                            <p className="text-xl font-medium">No champions yet</p>
                                            <p className="text-sm opacity-60">Be the first to claim victory!</p>
                                        </div>
                                    ) : (
                                        <motion.div
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="divide-y divide-border/10"
                                        >
                                            {data.map((entry, index) => {
                                                const isCurrentUser = currentUserId && entry.userId === currentUserId;
                                                return (
                                                    <motion.div
                                                        key={entry.userId}
                                                        variants={itemVariants}
                                                        className={`group flex items-center justify-between p-4 sm:p-6 hover:bg-accent/5 transition-all duration-300 ${isCurrentUser ? 'bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border-l-4 border-primary' :
                                                            index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' :
                                                                index === 1 ? 'bg-gradient-to-r from-gray-400/10 to-transparent' :
                                                                    index === 2 ? 'bg-gradient-to-r from-amber-600/10 to-transparent' : ''
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3 sm:gap-8 flex-1 min-w-0">
                                                            <div className="w-8 sm:w-12 flex justify-center transform group-hover:scale-110 transition-transform shrink-0">
                                                                {getRankIcon(entry.rank)}
                                                            </div>

                                                            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                                                <div className="relative shrink-0">
                                                                    <Avatar className={`h-10 w-10 sm:h-14 sm:w-14 border-2 ${index === 0 ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
                                                                        index === 1 ? 'border-gray-400' :
                                                                            index === 2 ? 'border-amber-700' : 'border-border'
                                                                        }`}>
                                                                        <AvatarImage src={entry.image || undefined} alt={entry.name || 'User'} className="object-cover" />
                                                                        <AvatarFallback className="font-bold bg-muted">{entry.name?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                                                                    </Avatar>
                                                                    {index < 3 && (
                                                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${index === 0 ? 'bg-yellow-500' :
                                                                            index === 1 ? 'bg-gray-400' :
                                                                                'bg-amber-700'
                                                                            }`}>
                                                                            {index + 1}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex flex-col min-w-0 pr-2">
                                                                    <span className={`font-bold text-base sm:text-xl truncate ${index === 0 ? 'text-primary' : 'text-foreground'
                                                                        }`}>
                                                                        {entry.name || 'Anonymous User'}
                                                                    </span>
                                                                    <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                                                        {index < 3 ? 'Champion' : 'Contender'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="pl-2 sm:pl-4 shrink-0">
                                                            <Badge variant="outline" className={`text-sm sm:text-lg px-2 sm:px-4 py-1 sm:py-1.5 font-mono font-bold tracking-tight border-2 ${index === 0 ? 'border-yellow-500/30 text-yellow-600 bg-yellow-500/5' :
                                                                'border-border bg-background/50'
                                                                }`}>
                                                                {entry.score.toLocaleString()}
                                                                <span className="text-[10px] ml-1 opacity-60 font-sans uppercase">pts</span>
                                                            </Badge>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                </Tabs>
            </Container>
        </div>
    );
}

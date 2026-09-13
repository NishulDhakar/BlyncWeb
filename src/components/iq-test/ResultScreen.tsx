"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { CoolMode } from "@/components/ui/cool-mode";
import { Download, RefreshCcw, Home, Share2 } from "lucide-react";
import Link from "next/link";

interface ResultScreenProps {
    results: {
        iq: number;
        rawScore: number;
        correctCount: number;
        totalTime: number;
        answers: number[];
    };
    onRetry: () => void;
}

export default function ResultScreen({ results, onRetry }: ResultScreenProps) {
    // Determine category based on IQ (Mock Logic)
    let category = "Average";
    let color = "text-yellow-500";

    if (results.iq > 130) {
        category = "Superior Intelligence";
        color = "text-purple-500";
    } else if (results.iq > 115) {
        category = "High Intelligence";
        color = "text-emerald-500";
    } else if (results.iq > 90) {
        category = "Normal Intelligence";
        color = "text-blue-500";
    } else {
        category = "Lower Intelligence";
        color = "text-orange-500";
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
            >
                <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-2 block">
                    Assessment Complete
                </span>
                <h2 className="text-3xl font-bold text-foreground">Your Cognitive Profile</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 w-full mb-12">
                {/* Main Score Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card border border-border/50 rounded-3xl p-8 flex flex-col items-center justify-center shadow-lg relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-primary/5 z-0" />
                    <div className="relative z-10 text-center">
                        <div className="text-6xl md:text-8xl font-black text-foreground mb-2 flex items-baseline justify-center gap-2">
                            {results.iq}
                            <span className="text-lg md:text-xl font-medium text-muted-foreground">IQ</span>
                        </div>
                        <div className={`text-xl font-bold ${color} mb-6`}>{category}</div>

                        <div className="grid grid-cols-2 gap-4 text-left w-full max-w-xs mx-auto text-sm">
                            <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                                <div className="text-muted-foreground mb-1">Raw Score</div>
                                <div className="font-semibold">{results.rawScore} points</div>
                            </div>
                            <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                                <div className="text-muted-foreground mb-1">Accuracy</div>
                                <div className="font-semibold">{Math.round((results.correctCount / 20) * 100)}%</div>
                            </div>
                            <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                                <div className="text-muted-foreground mb-1">Time Taken</div>
                                <div className="font-semibold">{Math.floor(results.totalTime / 60)}m {results.totalTime % 60}s</div>
                            </div>
                            <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                                <div className="text-muted-foreground mb-1">Percentile</div>
                                <div className="font-semibold">Top {Math.max(1, 100 - Math.round(((results.iq - 70) / 70) * 100))}%</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Breakdown Card (Mock Data) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm flex flex-col justify-between"
                >
                    <div>
                        <h3 className="text-xl font-bold mb-6">Cognitive Breakdown</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2 text-sm font-medium">
                                    <span>Pattern Recognition</span>
                                    <span>85%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2 text-sm font-medium">
                                    <span>Spatial Reasoning</span>
                                    <span>70%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '70%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2 text-sm font-medium">
                                    <span>Memory Recall</span>
                                    <span>92%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2 text-sm font-medium">
                                    <span>Speed & Processing</span>
                                    <span>78%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '78%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border/50">
                        <p className="text-sm text-muted-foreground">
                            * This is a preliminary assessment. For a comprehensive clinical evaluation, consult a professional psychologist.
                        </p>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 items-center justify-center"
            >
                <CoolMode>
                    <Button onClick={onRetry} variant="outline" className="gap-2">
                        <RefreshCcw className="w-4 h-4" /> Retake Test
                    </Button>
                </CoolMode>
                <CoolMode>
                    <ShimmerButton href="/dashboard" className="h-10 text-sm font-semibold gap-2 px-6">
                        <Home className="w-4 h-4 mr-1.5" /> Back to Dashboard
                    </ShimmerButton>
                </CoolMode>
                <CoolMode>
                    <Button variant="ghost" className="gap-2">
                        <Share2 className="w-4 h-4" /> Share Result
                    </Button>
                </CoolMode>
            </motion.div>
        </div>
    );
}

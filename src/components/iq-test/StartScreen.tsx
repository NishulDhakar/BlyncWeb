"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { CoolMode } from "@/components/ui/cool-mode";
import { Brain, Clock, Activity, Zap, Layers, Grid3X3, ArrowRight } from "lucide-react";

interface StartScreenProps {
    onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
    const categories = [
        {
            name: "Pattern Recognition",
            icon: <Grid3X3 className="w-6 h-6" />,
            description: "Identify missing pieces and continuing patterns.",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            name: "Spatial Reasoning",
            icon: <Layers className="w-6 h-6" />,
            description: "Mentally rotate and manipulate 3D shapes.",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            name: "Sequence Completion",
            icon: <Activity className="w-6 h-6" />,
            description: "Find the logic behind numerical and shape series.",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            name: "Memory Recall",
            icon: <Brain className="w-6 h-6" />,
            description: "Test your short-term visual memory capacity.",
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-5xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-primary/5 text-primary">
                    <Brain className="w-10 h-10" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                    IQ Cognitive Assessment
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    A scientific evaluation of your logical reasoning, pattern recognition, and problem-solving abilities.
                </p>

                <div className="flex items-center justify-center gap-6 mt-6 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> 8-12 Minutes
                    </span>
                    <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4" /> 20 Adaptive Questions
                    </span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-12"
            >
                {categories.map((cat, idx) => (
                    <div
                        key={idx}
                        className="group p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                            {cat.icon}
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <CoolMode>
                    <ShimmerButton
                        onClick={onStart}
                        borderRadius="0.75rem"
                        className="text-base sm:text-lg px-8 py-4 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    >
                        Start Assessment <ArrowRight className="ml-2 w-5 h-5" />
                    </ShimmerButton>
                </CoolMode>
                <p className="mt-4 text-xs text-muted-foreground text-center">
                    By starting, you agree to the testing terms.
                </p>
            </motion.div>
        </div>
    );
}

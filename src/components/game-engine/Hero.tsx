"use client";

import { motion } from "framer-motion";
import { PixelButton, FloatingPlatform, PixelCoin } from "./PixelComponents";
import { Gamepad2, Sparkles, Zap } from "lucide-react";
import GameBackgroundGrid from "@/components/common/GameBackgroundGrid";

export default function Hero() {
    return (
        <div className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">

            {/* Background Grid */}
            <GameBackgroundGrid />

            {/* Floating Elements (Decorative) */}
            <div className="absolute top-20 left-10">
                <FloatingPlatform width="w-24" delay={0} />
            </div>
            <div className="absolute bottom-40 right-20">
                <FloatingPlatform width="w-32" delay={2} />
                <div className="absolute -top-8 left-10">
                    <PixelCoin />
                </div>
            </div>
            <div className="absolute top-1/3 right-10 opacity-60 scale-75 blur-[1px]">
                <FloatingPlatform width="w-20" delay={1} />
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-md"
                >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-bold tracking-wider uppercase text-yellow-300">New: v2.0 Released</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-game text-4xl md:text-6xl leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]"
                >
                    Build Your Dream Game <br /> <span className="text-white">In Pixels</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-mono"
                >
                    The no-code 2D game engine for dreamers. Drag, drop, and publish your pixel art masterpiece in minutes.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col md:flex-row gap-6 items-center"
                >
                    <PixelButton onClick={() => console.log('start')} className="bg-[#fbbf24] text-black text-lg">
                        <span className="flex items-center gap-2">
                            <Gamepad2 className="w-5 h-5" /> Start Creating
                        </span>
                    </PixelButton>

                    <button className="font-game text-sm text-cyan-300 hover:text-cyan-100 underline decoration-2 underline-offset-4 decoration-dashed">
                        View Showcase
                    </button>
                </motion.div>
            </div>

            {/* Magic Glow Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] -z-10"></div>
        </div>
    );
}

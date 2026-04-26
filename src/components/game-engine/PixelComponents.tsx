"use client";

import { motion } from "framer-motion";

export const PixelButton = ({ children, className = "", onClick }: any) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`font-game relative px-6 py-3 bg-[#ffcc00] text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase text-sm ${className}`}
        >
            {children}
        </motion.button>
    );
};

export const PixelCard = ({ children, className = "" }: any) => {
    return (
        <div
            className={`relative bg-[#1a1b26] border-4 border-[#414868] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] ${className}`}
        >
            {children}
        </div>
    );
};

// A pure CSS pixel art coin
export const PixelCoin = () => {
    return (
        <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" as const }}
            className="w-12 h-12 relative"
        >
            <div className="absolute inset-0 bg-yellow-400 rounded-full border-4 border-black shadow-[inset_-4px_-4px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="absolute top-2 left-2 w-3 h-3 bg-white opacity-50 rounded-full"></div>
                <div className="absolute center inset-0 flex items-center justify-center font-bold text-black font-game text-xs">
                    $
                </div>
            </div>
        </motion.div>
    );
};

// A simple floating platform shape
export const FloatingPlatform = ({ width = "w-32", delay = 0 }) => {
    return (
        <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut" as const,
                delay: delay,
            }}
            className={`relative ${width} h-12`}
        >
            {/* Grass Top */}
            <div className="h-4 bg-[#4ade80] w-full border-x-4 border-t-4 border-black relative z-10"></div>
            {/* Dirt Body */}
            <div className="h-8 bg-[#854d0e] w-full border-x-4 border-b-4 border-black relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                {/* Texture dots */}
                <div className="absolute top-2 left-4 w-2 h-2 bg-[#5d360a] opacity-50"></div>
                <div className="absolute bottom-2 right-6 w-2 h-2 bg-[#5d360a] opacity-50"></div>
            </div>
        </motion.div>
    );
};

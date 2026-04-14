"use client";

import Link from "next/link";
import { PixelButton } from "./PixelComponents";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0c29]/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link href="/game-engine" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-sm border-2 border-white group-hover:rotate-45 transition-transform duration-300"></div>
                    <span className="font-game text-xl text-white tracking-tighter">PIXEL<span className="text-cyan-400">FORGE</span></span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 font-mono text-sm text-gray-300">
                    <Link href="#" className="hover:text-white hover:underline decoration-cyan-400 underline-offset-4">Features</Link>
                    <Link href="#" className="hover:text-white hover:underline decoration-purple-400 underline-offset-4">Showcase</Link>
                    <Link href="#" className="hover:text-white hover:underline decoration-green-400 underline-offset-4">Docs</Link>
                </div>

                {/* CTA */}
                <div className="hidden md:block">
                    <PixelButton className="text-xs py-2 px-4 bg-cyan-400 hover:bg-cyan-300 border-black">
                        Login
                    </PixelButton>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    <Menu className="w-8 h-8" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#1a1b26] border-b border-white/10 p-4 flex flex-col gap-4">
                    <Link href="#" className="font-mono text-white">Features</Link>
                    <Link href="#" className="font-mono text-white">Showcase</Link>
                    <Link href="#" className="font-mono text-white">Docs</Link>
                    <PixelButton className="w-full text-center">Login</PixelButton>
                </div>
            )}
        </nav>
    );
}

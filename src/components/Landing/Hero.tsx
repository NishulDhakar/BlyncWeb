"use client";

import Container from "../common/Container";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Download, Share, Smartphone, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MorphingText } from "@/components/ui/morphing-text"
import { DotPattern } from "../ui/dot-pattern";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useState } from "react";


export default function Hero() {
  const { canInstall, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* <Image
        src="/bg.jpg"
        alt="Nishul"
        fill
        className="object-cover"
        priority
        quality={180}
      /> */}
      {/* <DotPattern /> */}

      <div className="relative z-10 mt-20 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">

        <motion.a
            href="https://www.nishul.dev/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-1 flex items-center gap-3 rounded-full 
               backdrop-blur-sm px-2 py-1 text-sm font-medium text-foreground"
          >
        <div className="mb-6 flex items-center gap-3 rounded-full 
                px-4 py-1.5 text-sm font-medium text-foreground
              hover:bg-secondary/10 hover:scale-[1] transition-all cursor-pointer">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border border-primary/20">
              <Image
                src="/nishulhero.jpg"
                alt="Nishul"
                fill
                className="object-cover"
                priority
                quality={90}
              />
            </div>

            <span className="pr-1 font-bold font-game">By Nishul</span>
            </div>  
        </motion.a> 



        <motion.h1
          className="text-4xl md:text-6xl mt-6 lg:text-7xl text-center font-bold tracking-tight text-foreground mb-3 leading-tight flex flex-col md:flex-row items-center justify-center md:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-transparent bg-clip-text bg-[#FF3F8F]">
            Play.
          </span>
          <span className="text-transparent bg-clip-text bg-neutral-100">
            Train.
          </span>
          <span className="text-transparent bg-clip-text bg-[#0586C8]">
            Prepare.
          </span>
        </motion.h1>

        {/* SEO subtitle — primary keyword in first 100 words, visible to users and search engines */}
        <motion.p
          className="text-base md:text-lg font-semibold text-foreground/70 max-w-2xl mx-auto mb-3 leading-snug"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Free Game-Based Aptitude Practice for Capgemini &amp; Cognizant Placements
        </motion.p>

        <motion.p
          className="text-base md:text-sm lg:text-md font-normal text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Practice Switch, Grid, Digit, Motion, Inductive &amp; Deductive challenges — the exact games used in Capgemini &amp; Cognizant cognitive aptitude rounds. Improve your speed, accuracy, and logical reasoning with our free online mock tests.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* PWA Install / Mobile App Button */}
          {isInstalled ? (
            <Button size="lg" className="h-12 px-8 text-base" disabled>
              <Check className="mr-2 w-4 h-4" /> App Installed
            </Button>
          ) : canInstall ? (
            <Button
              size="lg"
              className="h-12 px-8 text-base group relative overflow-hidden"
              onClick={install}
            >
              <span className="relative z-10 flex items-center">
                <Download className="mr-2 w-4 h-4 group-hover:animate-bounce" />
                Install App
              </span>
            </Button>
          ) : isIOS ? (
            <Button
              size="lg"
              className="h-12 px-8 text-base"
              onClick={() => setShowIOSGuide(!showIOSGuide)}
            >
              <Smartphone className="mr-2 w-4 h-4" />
              Install App
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-12 px-8 text-base group"
              onClick={() => {
                // Fallback for browsers that don't support beforeinstallprompt
                // Direct to games as a soft conversion
                window.location.href = "/games/cognitive";
              }}
            >
              <Download className="mr-2 w-4 h-4" />
              Mobile App<ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}

          <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
            <Link href="/games/cognitive">
              Capgemini Games <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        {/* iOS Install Guide Tooltip */}
        <AnimatePresence>
          {showIOSGuide && isIOS && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mt-4 p-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-2xl max-w-sm text-left"
            >
              <p className="text-sm font-semibold text-foreground mb-3">
                Install Blync on your iPhone:
              </p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tap the <Share className="inline w-4 h-4 text-blue-400 -mt-0.5" /> <span className="font-medium text-foreground">Share</span> button in Safari
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scroll down and tap <span className="font-medium text-foreground">&quot;Add to Home Screen&quot;</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tap <span className="font-medium text-foreground">&quot;Add&quot;</span> — open from your home screen!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Got it ✓
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats / Trust Indicators (Optional placeholder for professional look) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-16 pt-8 border-t border-[#111]/40 grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-2xl px-4 items-center justify-center text-center"
        >
          <div>
            <h4 className="text-xl md:text-2xl font-bold text-foreground">6+</h4>
            <p className="text-xs md:text-sm text-muted-foreground">Cognitive Games</p>
          </div>
          <div>
            <h4 className="text-xl md:text-2xl font-bold text-foreground">5k+</h4>
            <p className="text-xs md:text-sm text-muted-foreground">Active Users</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xl md:text-2xl font-bold text-foreground">98%</h4>
            <p className="text-xs md:text-sm text-muted-foreground">Improvement Rate</p>
          </div>
        </motion.div>
      </div>
      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] md:w-[800px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>
    </section>
  );
}


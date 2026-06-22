"use client";

import Container from "../common/Container";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Download, Share, Smartphone, Check, Icon, Instagram  } from "lucide-react";
import Image from "next/image";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useState, useRef, useEffect } from "react";

export default function Hero() {
  const { canInstall, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy-load video: set src after mount so it doesn't block initial paint
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Small delay to let critical content paint first
    const timer = setTimeout(() => {
      video.src = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4";
      video.load();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden md:py-1">
      <div className="relative w-full h-[calc(100vh-24px)] sm:h-[calc(100vh-32px)] overflow-hidden rounded-2xl sm:rounded-3xl shrink-0 bg-[#131221] bg-gradient-to-b from-[#7bb0ff]/10 via-[#c3d7f5]/5 to-[#f2e2be]/10">
        {/* Background Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/videos/hero-poster.webp"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none gpu-accelerated"
        />

        <div className="relative z-10 mt-34 md:mt-40 flex flex-col items-center justify-center text-center max-w-7xl mx-auto">
          <a
            href="https://www.nishul.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-1 flex items-center gap-3 rounded-full backdrop-blur-sm px-2 py-1 text-sm font-medium text-foreground"
          >
            <div className="mb-1 flex items-center gap-3 rounded-full px-4 py-1.5 text-sm font-medium text-foreground hover:bg-secondary/10 transition-all cursor-pointer">
              <div className="relative w-10 h-10 overflow-hidden rounded-full border border-white/20">
                <Image
                  src="/nishulhero.jpg"
                  alt="Nishul"
                  fill
                  className="object-cover"
                  priority
                  quality={90}
                />
              </div>
              <span className="pr-1 font-bold text-secondary">By Nishul</span>
            </div>
          </a>

          <h1 className="text-4xl md:text-6xl mt-6 lg:text-7xl text-center font-bold tracking-tight text-foreground mb-3 leading-tight flex md:flex-row items-center justify-center gap-4 md:gap-8">
            <span className="text-secondary">Play.</span>
            <span className="text-secondary">Train.</span>
            <span className="text-secondary">Prepare.</span>
          </h1>

          {/* SEO subtitle */}
          <p className="text-sm hidden md:text-lg font-semibold text-secondary max-w-2xl md:max-w-xl mx-auto mb-3 mt-6 leading-snug">
            Free Game-Based Aptitude Practice for Capgemini &amp; Cognizant Placements
          </p>

          <p className="hidden md:block text-md md:text-md lg:text-md font-normal text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice Switch, Grid, Digit, Motion, Inductive &amp; Deductive challenges — the exact games used in Capgemini &amp; Cognizant cognitive aptitude rounds. Improve your speed, accuracy, and logical reasoning with our free online mock tests.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">

            <Button asChild variant="secondary" size="lg" className="h-12 px-8 text-white text-base bg-black">
              <Link href="https://instagram.com/blyncgames">
                <Instagram />Instagram <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>

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
                  <Download className="mr-2 w-4 h-4" />
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
                  window.location.href = "/games/cognitive";
                }}
              >
                <Download className="mr-2 w-4 h-4" />
                Mobile App<ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>

          {/* iOS Install Guide */}
          {showIOSGuide && isIOS && (
            <div className="mt-4 p-4 rounded-2xl bg-card/90 backdrop-blur-md glass-optimized border border-border/50 shadow-2xl max-w-sm text-left">
              <p className="text-sm font-semibold text-foreground mb-3">
                Install Blync on your iPhone:
              </p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tap the <Share className="inline w-4 h-4 text-blue-400 -mt-0.5" /> <span className="font-medium text-foreground">Share</span> button in Safari
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scroll down and tap <span className="font-medium text-foreground">&quot;Add to Home Screen&quot;</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">3</span>
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
            </div>
          )}

          {/* Stats */}
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-2xl px-4 items-center justify-center text-center">
            <div>
              <h4 className="text-xl md:text-2xl font-bold text-secondary">6+</h4>
              <p className="text-xs md:text-sm text-secondary">Cognitive Games</p>
            </div>
            <div>
              <h4 className="text-xl md:text-2xl font-bold text-secondary">5k+</h4>
              <p className="text-xs md:text-sm text-secondary">Active Users</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-xl md:text-2xl font-bold text-secondary">98%</h4>
              <p className="text-xs md:text-sm text-secondary">Improvement Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

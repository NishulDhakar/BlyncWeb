'use client';

import Link from "next/link";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";

interface BrainGamePlayerProps {
  title: string;
  iframeUrl: string;
  description?: string;
}

export default function BrainGamePlayer({ title, iframeUrl, description }: BrainGamePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Listen for native fullscreen changes (e.g. user presses Esc)
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fallback: some browsers may block fullscreen
    }
  }, []);

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 pt-6 pb-20 mt-12">
      {/* Back nav + title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/games/brain"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Brain Games
          </Link>
          <span className="text-border">/</span>
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
        </div>

        <button
          onClick={toggleFullscreen}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border/40 bg-white/5 text-muted-foreground hover:text-foreground hover:border-border/60 transition-colors"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              Fullscreen
            </>
          )}
        </button>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">{description}</p>
      )}

      {/* Game iframe container — invert colors to match dark theme */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-border/40 bg-[#1a1a2e] w-full aspect-[4/3] md:aspect-[16/10]"
      >
        <iframe
          src={iframeUrl}
          title={title}
          className="absolute inset-0 w-full h-full border-0 bg-white"
          style={{ filter: "invert(1) hue-rotate(180deg)" }}
          allow="fullscreen"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}

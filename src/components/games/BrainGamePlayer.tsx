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
  const [containerWidth, setContainerWidth] = useState(500);

  // Measure container width to dynamically scale the iframe on smaller viewports
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    
    observer.observe(containerRef.current);
    // Initial measure
    setContainerWidth(containerRef.current.offsetWidth);
    
    return () => observer.disconnect();
  }, []);

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

  // Base dimensions of the embedded games
  const gameWidth = 500;
  const gameHeight = 620;
  const scale = Math.min(1, containerWidth / gameWidth);

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-2 sm:px-4 pt-6 pb-20 mt-20 md:mt-12">
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

      {/* Game iframe container — scaled for mobile & inverted colors to match dark theme */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-border/40 w-full"
        style={{ height: `${gameHeight * scale}px`, transition: "height 0.1s ease-out" }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 origin-top"
          style={{
            width: `${gameWidth}px`,
            height: `${gameHeight}px`,
            transform: `scale(${scale})`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <iframe
            src={iframeUrl}
            title={title}
            className="w-full h-full border-0 bg-white"
            style={{ filter: "invert(1) hue-rotate(180deg)" }}
            allow="fullscreen"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </div>
    </div>
  );
}

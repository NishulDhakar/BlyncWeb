"use client";

import { useState } from "react";
import { Play, BookOpen, ChevronRight, Eye, EyeOff } from "lucide-react";
import HlsVideo from "./HlsVideo";

export interface RuleData {
  title: string;
  description: string;
  howToPlay: string[];
  Solution?: string;
  playLink: string;
}

export default function RulePage({ data }: { data: RuleData }) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <main className="min-h-screen relative overflow-hidden bg-neutral-950">
      {/* Video background */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <HlsVideo
          src="https://stream.mux.com/01yW6GoUz01OTXk5w1Rt1MHkJWlCGIwj46SUONJZ4DJUE.m3u8"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-3">
            {data.title}
          </h1>
          <div className="w-16 h-0.5 bg-white/20 mx-auto mt-4" />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md glass-optimized shadow-2xl overflow-hidden">
          {/* Description */}
          <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-white/10">
            <p className="text-white/65 text-base sm:text-lg leading-relaxed text-center">
              {data.description}
            </p>
          </div>

          {/* How to Play */}
          <div className="px-6 sm:px-10 py-6 sm:py-8">
            <div className="flex items-center mb-5 sm:mb-6">
              <BookOpen className="text-white/50 mr-2.5" size={18} />
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                How to Play
              </h2>
            </div>

            <div className="space-y-2.5">
              {data.howToPlay.map((step, index) => (
                <div
                  key={index}
                  className={`group p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-default ${
                    hoveredStep === index
                      ? "border-white/25 bg-white/10"
                      : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/6"
                  }`}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-200 ${
                        hoveredStep === index
                          ? "bg-white text-neutral-900 scale-110"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <p className="text-white/75 flex-1 text-sm sm:text-base leading-relaxed pt-0.5">
                      {step}
                    </p>
                    <ChevronRight
                      className={`mt-0.5 flex-shrink-0 transition-all duration-200 ${
                        hoveredStep === index
                          ? "translate-x-1 text-white/60"
                          : "text-white/20"
                      }`}
                      size={15}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
              {data.Solution && (
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white/8 text-white/80 rounded-xl font-medium border border-white/15 hover:bg-white/15 hover:text-white hover:border-white/25 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
                >
                  {showSolution ? (
                    <><EyeOff className="mr-2" size={16} /> Hide Solution</>
                  ) : (
                    <><Eye className="mr-2" size={16} /> Show Solution</>
                  )}
                </button>
              )}

              <a
                href={data.playLink}
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-neutral-900 rounded-xl font-semibold shadow-lg hover:bg-white/90 hover:shadow-white/20 hover:shadow-xl transition-all duration-200 hover:scale-105 text-sm sm:text-base"
              >
                <Play className="mr-2 fill-neutral-900" size={16} />
                Play Mock Test Now
              </a>
            </div>

            {/* Solution content */}
            {showSolution && data.Solution && (
              <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-5 rounded-xl border border-white/10 bg-white/5">
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
                    Solution
                  </h3>
                  {data.Solution.match(/\.(png|jpg|jpeg)$/i) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.Solution}
                      alt="Solution"
                      className="mx-auto rounded-lg shadow-md cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <p className="text-base text-white/65 leading-relaxed">
                      {data.Solution}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

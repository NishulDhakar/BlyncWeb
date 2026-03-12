import React from "react";
import Link from "next/link";
import Music from "./music";


interface GamePageProps {
  title: string;
  level: number;
  timer: string | number;
  children: React.ReactNode;
  extraHeaderContent?: React.ReactNode;
}

const GamePage: React.FC<GamePageProps> = ({
  title,
  level,
  timer,
  children,
  extraHeaderContent,
}) => {
  return (
    <div className="mt-28 w-full max-w-2xl mx-auto flex flex-col items-center justify-center bg-gradient-to-br">
      {/* Responsive Header */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-4 md:px-8 mb-8">
        {/* Title & Extra Content */}
        <div className=" hidden md:flex flex-col md:flex-row items-center justify-center md:justify-end gap-2 md:space-x-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
            <span className="text-gray-700 font-semibold text-lg">{title}</span>
          </div>
          {extraHeaderContent}
        </div>
        {/* Level & Timer: stacked on mobile, side-by-side on md+ */}
        <div className="flex flex-col-6 sm:flex-row items-center justify-center sm:justify-start gap-4">
          <Music />
          {/* Level Box */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
            <span className="text-gray-700 font-semibold text-lg">Level {level}</span>
          </div>

          {/* Timer Box */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
            <span className="text-gray-700 font-mono text-lg font-semibold">{timer}</span>
          </div>

          {/* Check Your Rank Button */}
          <Link href="/leaderboard" className="group bg-amber-500 hover:bg-amber-600 rounded-xl px-5 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg">
            <span className="text-white font-semibold text-base flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Rank
            </span>
          </Link>
        </div>
      </div>

      {/* Children Content */}
      <div className="w-full px-4 md:px-0 mb-12">{children}</div>

      {/* Internal Linking / Related Games Bottom Section */}
      <div className="w-full mt-12 mb-8 pt-8 border-t border-white/20 px-4 md:px-0">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Looking for a different challenge?</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/games/cognitive" className="hover:scale-105 transition-transform bg-white/40 shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-gray-700">
            Capgemini Assessments
          </Link>
          <Link href="/cognizant-games" className="hover:scale-105 transition-transform bg-white/40 shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-gray-700">
            Cognizant GenC Prep
          </Link>
          <Link href="/rules/switch-challenge" className="hover:scale-105 transition-transform bg-white/40 shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-gray-700">
            Switch Challenge Guide
          </Link>
          <Link href="/play/grid-challenge" className="hover:scale-105 transition-transform bg-white/40 shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-gray-700">
            Grid Challenge
          </Link>
        </div>
      </div>

    </div>
  );
};

export default GamePage;

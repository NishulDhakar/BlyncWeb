import React from "react";
import { Button } from "../ui/button";

interface ResultCardProps {
  correct: number;
  wrong: number;
  resetGame: () => void;
  onCheckRank?: () => void; // ✅ optional rank handler
  score?: number;
}

const ResultCard: React.FC<ResultCardProps> = ({
  correct,
  wrong,
  resetGame,
  onCheckRank,
  score,
}) => {
  const total = correct + wrong;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="text-center space-y-12">
      <div className="backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-white/20">

        {/* Header */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            Challenge Complete
          </h2>
          <p className="text-muted-foreground text-sm">
            Well done! Here are your results
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-6 mb-12">
          {total > 0 && (
            <div className="mb-8">
              <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
                {accuracy}%
              </div>
              <div className="text-muted-foreground text-sm">accuracy</div>
            </div>
          )}

          <div className="flex justify-center items-center gap-8 md:gap-12 text-sm">
            <div className="text-center">
              <div className="text-2xl font-semibold text-emerald-400 mb-1">
                {correct}
              </div>
              <div className="text-muted-foreground">correct</div>
            </div>

            <div className="w-px h-8 bg-white/15"></div>

            <div className="text-center">
              <div className="text-2xl font-semibold text-rose-400 mb-1">
                {wrong}
              </div>
              <div className="text-muted-foreground">wrong</div>
            </div>

            {score !== undefined && (
              <>
                <div className="w-px h-8 bg-white/15"></div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-violet-400 mb-1">
                    {score}
                  </div>
                  <div className="text-muted-foreground">score</div>
                </div>
              </>
            )}

            <div className="w-px h-8 bg-white/15"></div>

            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground/60 mb-1">
                {total}
              </div>
              <div className="text-muted-foreground">total</div>
            </div>
          </div>

          {total > 0 && (
            <div className="w-full max-w-md mx-auto">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={resetGame}
            variant="outline"
            className="px-8 py-3 text-base font-medium border-white/20 hover:bg-white/5 rounded-lg"
          >
            Try Again
          </Button>

          <Button
            onClick={onCheckRank}
            className="px-8 py-3 text-base font-medium rounded-lg"
          >
            Check Your Rank
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveScore } from "@/features/scoring/actions";

/**
 * Persists a finished run exactly once.
 *
 * Before this hook, each game carried its own `isScoreSaved` boolean and a
 * `useEffect` that watched game status. Two games double-saved when React
 * re-ran the effect (the flag was set after an await), so leaderboard totals
 * drifted. Here the guard is a ref, set synchronously before the request.
 *
 *   const { saved, reset } = useGameSession({ gameSlug: "bubble-math", score, finished });
 */
export function useGameSession({
  gameSlug,
  score,
  finished,
}: {
  gameSlug: string;
  score: number;
  finished: boolean;
}) {
  const savedRef = useRef(false);
  const [saved, setSaved] = useState(false);
  // Read at save time so the effect does not re-run on every point scored.
  const scoreRef = useRef(score);
  scoreRef.current = score;

  useEffect(() => {
    if (!finished || savedRef.current) return;
    savedRef.current = true;

    void saveScore(gameSlug, Math.max(0, Math.round(scoreRef.current)))
      .then(() => setSaved(true))
      .catch(() => {
        // Never block the results screen on a failed write — allow a retry
        // if the player replays.
        savedRef.current = false;
      });
  }, [finished, gameSlug]);

  /** Call from the game's "play again" handler. */
  const reset = useCallback(() => {
    savedRef.current = false;
    setSaved(false);
  }, []);

  return { saved, reset };
}

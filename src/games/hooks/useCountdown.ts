"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A one-second-tick countdown.
 *
 * Replaces the hand-rolled `setTimeout(() => setTimeLeft(t => t - 1), 1000)`
 * effect that every game re-implemented (and that several got subtly wrong by
 * firing `onExpire` twice when the component re-rendered on the zero tick).
 *
 * `onExpire` fires exactly once per countdown run.
 */
export function useCountdown({
  seconds,
  running,
  onExpire,
}: {
  seconds: number;
  running: boolean;
  onExpire?: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Restart whenever the caller hands us a new budget.
  useEffect(() => {
    setTimeLeft(seconds);
    expiredRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (!running) return;

    if (timeLeft <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current?.();
      }
      return;
    }

    const id = setTimeout(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearTimeout(id);
  }, [running, timeLeft]);

  return timeLeft;
}

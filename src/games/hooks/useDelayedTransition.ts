"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Schedules the "pause on the feedback frame, then advance" transition that
 * every game needs after an answer.
 *
 * Each game used to keep its own `transitionRef` plus a cleanup effect; three
 * of them leaked the timeout on unmount. This owns the ref and always clears.
 */
export function useDelayedTransition() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /** Replaces any pending transition — never stacks two advances. */
  const schedule = useCallback(
    (fn: () => void, delayMs: number) => {
      cancel();
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        fn();
      }, delayMs);
    },
    [cancel]
  );

  useEffect(() => cancel, [cancel]);

  return { schedule, cancel };
}

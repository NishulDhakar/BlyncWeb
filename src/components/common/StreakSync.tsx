"use client";

import { useEffect, useRef } from "react";
import { useUser, useSetStreak } from "@/context/UserContext";
import { upsertMyStreakAction } from "@/features/streak/actions";

export default function StreakSync() {
  const user = useUser();
  const setStreak = useSetStreak();
  const hasTriggered = useRef(false);

  useEffect(() => {
    // Only sync if the user is logged in and we haven't synced in this component lifecycle
    if (!user || hasTriggered.current) return;
    
    hasTriggered.current = true;

    // Trigger the database write asynchronously in the background
    upsertMyStreakAction()
      .then((updatedStreak) => {
        if (updatedStreak && updatedStreak.currentStreak > 0) {
          setStreak(updatedStreak);
        }
      })
      .catch((err) => {
        console.error("[StreakSync] Failed to sync streak in background:", err);
      });
  }, [user, setStreak]);

  return null;
}

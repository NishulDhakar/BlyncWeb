"use client";

import type { User } from "@/types/user";
import type { StreakData } from "@/features/streak/actions";
import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  streak: StreakData;
  setStreak: (s: StreakData) => void;
}

const DEFAULT_STREAK: StreakData = { currentStreak: 0, longestStreak: 0 };

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  user: initialUser,
  streak: initialStreak,
  children,
}: {
  user: User | null;
  streak?: StreakData;
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [streak, setStreak] = useState<StreakData>(initialStreak ?? DEFAULT_STREAK);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session !== undefined) {
      setUser((session?.user as User) ?? null);
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ user, setUser, streak, setStreak }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Context readers.
 *
 * These return safe defaults instead of throwing when no provider is mounted.
 * They used to throw, which was invisible for as long as the whole app bailed
 * to client-side rendering — the error surfaced in a client error boundary and
 * the page still painted. With server rendering restored, the same call in a
 * page rendered outside UserProvider (e.g. /cognizant-games) fails the
 * prerender and takes down the build.
 *
 * A missing provider means "no session information here", which is exactly what
 * a logged-out read looks like, so returning the logged-out value is both safer
 * and more truthful than throwing.
 */
export const useUser = () => useContext(UserContext)?.user ?? null;

export const useStreak = () => useContext(UserContext)?.streak ?? DEFAULT_STREAK;

const noop = () => {};

export const useSetUser = () => useContext(UserContext)?.setUser ?? noop;

export const useSetStreak = () => useContext(UserContext)?.setStreak ?? noop;

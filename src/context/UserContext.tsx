"use client";

import type { User } from "@/types/user";
import type { StreakData } from "@/features/streak/actions";
import React, { createContext, useContext, useState } from "react";

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

  return (
    <UserContext.Provider value={{ user, setUser, streak, setStreak }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context.user;
};

export const useSetUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useSetUser must be used within a UserProvider");
  return context.setUser;
};

export const useStreak = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useStreak must be used within a UserProvider");
  return context.streak;
};

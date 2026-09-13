"use client";

import { useUser } from "@/context/UserContext";
import GamePaywall from "@/components/games/GamePaywall";

interface Props {
  gameSlug?: string;
  gameName?: string;
  children: React.ReactNode;
}

export default function ProGate({ gameSlug: _gameSlug, gameName, children }: Props) {
  const user = useUser();
  const isPro = user?.isPro ?? false;

  if (!isPro) {
    return <GamePaywall gameName={gameName} />;
  }

  return <>{children}</>;
}


import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth";
import GameMount from "@/games/GameMount";
import { gamePlayMetadata } from "@/games/seo";

/**
 * Gameplay route. Metadata, canonical and noindex all come from the registry
 * (src/games/registry.ts) — see src/games/seo.ts. The indexable copy for this
 * game lives at /games/cognitive/deductive-challenge.
 */
export const metadata: Metadata = gamePlayMetadata("deductive-challenge");

export default async function Page() {
  const session = await getCachedSession();
  if (!session) redirect("/register?redirect=/play/deductive-challenge");

  return <GameMount slug="deductive-challenge" />;
}

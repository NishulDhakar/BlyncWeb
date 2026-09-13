"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Client mount point for every React game module.
 *
 * Each entry is its own `next/dynamic` call, so a game's code lands in its own
 * chunk and is fetched only when that game is actually mounted. Listing them
 * together does not merge them: `dynamic` creates a lazy chunk boundary per
 * import, so this module itself stays a few hundred bytes.
 *
 * `ssr: false` is deliberate — these are timer-driven client state machines
 * that call Math.random() while building their initial state, so any server
 * render produces markup the client cannot match. It also keeps the game code
 * out of the server bundle. That flag is only legal inside a client module,
 * which is why this file carries "use client" and the play routes render
 * <GameMount slug=... /> instead of importing the map directly.
 */

const loading = () => (
  <div className="flex min-h-[420px] items-center justify-center text-sm text-muted-foreground">
    Loading game…
  </div>
);

const GAME_MODULES: Record<string, ComponentType> = {
  // ── Ported from the company assessment sets ──
  "bubble-math": dynamic(() => import("./bubble-math/logic"), { ssr: false, loading }),
  "grid-puzzle": dynamic(() => import("./grid-puzzle/logic"), { ssr: false, loading }),
  "path-finder": dynamic(() => import("./path-finder/logic"), { ssr: false, loading }),
  "key-and-door": dynamic(() => import("./key-and-door/logic"), { ssr: false, loading }),
  "quick-math": dynamic(() => import("./quick-math/logic"), { ssr: false, loading }),
  "gap-challenge": dynamic(() => import("./gap-challenge/logic"), { ssr: false, loading }),
  "shape-switch-challenge": dynamic(() => import("./shape-switch-challenge/logic"), { ssr: false, loading }),
  "motion-challenge-advanced": dynamic(() => import("./motion-challenge-advanced/logic"), { ssr: false, loading }),

  // ── The original six Capgemini games ──
  "switch-challenge": dynamic(() => import("./switch-challenge/game"), { ssr: false, loading }),
  "digit-challenge": dynamic(() => import("./digit-challenge/game"), { ssr: false, loading }),
  "grid-challenge": dynamic(() => import("./grid-challenge/game"), { ssr: false, loading }),
  "motion-challenge": dynamic(() => import("./motion-challenge/game"), { ssr: false, loading }),
  "inductive-challenge": dynamic(() => import("./inductive-challenge/game"), { ssr: false, loading }),
  "deductive-challenge": dynamic(() => import("./deductive-challenge/game"), { ssr: false, loading }),
};

export default function GameMount({ slug }: { slug: string }) {
  const Game = GAME_MODULES[slug];
  if (!Game) return null;
  return <Game />;
}

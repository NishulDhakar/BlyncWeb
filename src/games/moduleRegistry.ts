/**
 * Slugs backed by a playable React module in src/games/<slug>/.
 *
 * Server routes need this to choose between rendering the game and calling
 * notFound(). It is a plain array rather than a read of the dynamic-import map
 * in ./GameMount.tsx, because that map lives behind a "use client" boundary and
 * a server component cannot inspect it without pulling the boundary in.
 *
 * Keep in sync with GAME_MODULES in ./GameMount.tsx.
 */
export const REACT_GAME_SLUGS = [
  "bubble-math",
  "grid-puzzle",
  "path-finder",
  "key-and-door",
  "quick-math",
  "gap-challenge",
  "shape-switch-challenge",
  "motion-challenge-advanced",
  "switch-challenge",
  "digit-challenge",
  "grid-challenge",
  "motion-challenge",
  "inductive-challenge",
  "deductive-challenge",
] as const;

export function hasReactModule(slug: string): boolean {
  return (REACT_GAME_SLUGS as readonly string[]).includes(slug);
}

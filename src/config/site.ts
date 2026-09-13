import { GAMES, getGame, liveGames, playHref } from "@/games/registry";
import type { GameCategory } from "@/games/types";

/**
 * Central site configuration — single source of truth for URLs, branding, and SEO constants.
 * Import this instead of hardcoding URLs in layout.tsx, sitemap.ts, robots.ts, etc.
 */
export const siteConfig = {
  name: "Blync Cognitive Games",
  shortName: "Blync",
  url: "https://www.cognitivegames.me",
  ogImage: "/og-logo.png",
  description:
    "Capgemini & Cognizant game-based aptitude practice on Blync. Switch, Grid, Digit, Motion, Inductive & Deductive Challenges — full tutorials, mock tests & solutions for 2026 placements with Blync Pro.",
  keywords: [
    // Core Capgemini Games Keywords 
    "capgemini game based aptitude test",
    "capgemini games",
    "capgemini gaming",
    "capgemini game based aptitude",
    "capgemini cognitive ability games",
    "capgemini gaming round",
    "capgemini games round",
    "game based aptitude test capgemini",
    "Capgemini game based aptitude test 2025",
    "Capgemini game round practice",
    "Capgemini cognitive ability test",
    "Capgemini Exceller Game Based Aptitude Test",

    // General Game Based Aptitude Keywords
    "game based aptitude test",
    "game-based aptitude test",
    "aptitude games",
    "aptitude game",
    "game based aptitude test free practice",
    "game-based aptitude test free practice",
    "placement game based aptitude",
    "placement aptitude games",
    "cognitive assessment practice online",

    // General Capgemini Aptitude Keywords
    "capgemini aptitude questions",
    "capgemini aptitude test",
    "capgemini technical assessment questions",
    "aptitude questions for capgemini",
    "capgemini previous year questions",
    "capgemini online test papers with answers",
    "capgemini assessment test",
    "capgemini syllabus",
    "capgemini exam",
    "capgemini test",
    "capgemini faceprep",
    "capgemini assessment test questions",
    "capgemini aptitude syllabus",
    "capgemini online test pattern",
    "capgemini final assessment test pattern",
    "aptitude test capgemini",
    "aptitude test of capgemini",
    "capgemini questions",
    "capgemini assessment test questions and answers pdf",
    "capgemini placement papers",
    "capgemini assessment test pattern",
    "capgemini pseudocode syllabus",
    "capgemini online assessment test",
    "capgemini mock test",
    "capgemini exam pattern for freshers",
    "capgemini final assessment test",
    "capgemini english assessment test for experienced",
    "capgemini english communication test syllabus",
    "capgemini test questions",
    "capgemini coding questions",

    // Cognitive / Brain Games Keywords
    "cognitive games",
    "cognitive games online",
    "brain games online free",
    "brain training games",
    "online brain games",
    "free brain games",
    "cognitive ability test free",
    "cognitive assessment online free",
    "cognitive skills games",

    // Other Relevant Keywords
    "Cognizant GenC game based test",
    "Cognizant puzzle round",
    "Cognizant game based aptitude test",
    "Cognizant placement 2026",
    "campus placement 2026 preparation",
    "campus placement 2025 preparation",

    // Specific Game Challenges
    "Switch Challenge practice",
    "Digit Challenge practice",
    "Grid Challenge practice",
    "Motion Challenge practice",
    "Spacio Challenge practice",
    "Inductive Challenge puzzles",
    "Deductive Challenge puzzles",
    "grid challenge capgemini",
    "grid challenge test"
  ],
  links: {
    twitter: "https://twitter.com/nishuldhakar",
    github: "https://github.com/NishulDhakar/BlyncWeb",
    instagram: "https://instagram.com/blyncgames",
  },
  creator: "@nishuldhakar",
  locale: "en_IN",
  adsenseId: "ca-pub-6271827630758167",
  analyticsId: "G-2WMDWXGJK7",
  umamiId: "c97607d1-dd2e-479f-b785-a935c0dd5e79",
} as const;

// ── Game catalogue (derived) ─────────────────────────────────────────────────
// The catalogue itself lives in src/games/registry.ts — one entry per game,
// which also drives the play routes, JSON-LD and the /games hubs. The exports
// below are the shapes the existing SEO pages already consume, rebuilt from
// that registry so a new game appears everywhere without another edit here.

/** All game slugs. */
export const gameSlugs = GAMES.map((game) => game.slug);

/** Rule/guide pages that exist under /rules/. */
export const ruleSlugs = GAMES.filter((game) => game.hasRulesPage).map((game) => game.slug);

export type GameSlug = (typeof gameSlugs)[number];
export type RuleSlug = (typeof ruleSlugs)[number];

export interface GameConfig {
  slug: string;
  name: string;
  category: GameCategory;
  headline: string;
  description: string;
  keywords: readonly string[];
  related: readonly string[];
}

/**
 * Flattened view of the registry for the /games/* SEO pages.
 * Prefer importing from "@/games/registry" in new code — this stays for the
 * pages that were written against the old shape.
 */
export const gamesConfig: GameConfig[] = liveGames().map((game) => ({
  slug: game.slug,
  name: game.name,
  category: game.category,
  headline: game.seo.headline,
  description: game.seo.description,
  keywords: game.seo.keywords,
  related: game.seo.related,
}));

export type GameCategorySlug = GameCategory;

/** Playable URL for a slug. Delegates to the registry so there is one mapping. */
export function getGamePlayUrl(slug: string): string {
  const game = getGame(slug);
  return game ? playHref(game) : `/play/${slug}`;
}

import type { ComponentType } from "react";

/**
 * The game domain model.
 *
 * One `GameDefinition` per game, all of them declared in `./registry`.
 * Everything downstream — routing, SEO metadata, sitemap entries, JSON-LD,
 * hub listings, footer links — is derived from these objects, so adding a game
 * means adding one registry entry plus one module folder. Nothing else needs
 * to be touched.
 */

/** Content grouping. Drives the /games/<category> hub a game appears on. */
export type GameCategory = "cognitive" | "memory" | "brain" | "quiz" | "communication";

/** Which employer's assessment this game mirrors. Drives the company hubs. */
export type CompanySlug = "capgemini" | "cognizant" | "accenture" | "general";

/** How the game is implemented — decides which route template renders it. */
export type GameKind =
  /** React module in src/games/<slug>, code-split at the route. */
  | "react"
  /** Self-contained HTML assessment served in a sandboxed, theme-bridged iframe. */
  | "html"
  /** Third-party game embedded from an external origin. */
  | "embed";

/** Rough time commitment, shown on cards and in SEO copy. */
export type GameDuration = "1-3 min" | "3-5 min" | "5-10 min" | "10-20 min" | "45 min";

export type GameDifficulty = "easy" | "medium" | "hard";

export interface GameSeo {
  /** <title> for the SEO landing page. Keep under ~60 chars before the brand. */
  headline: string;
  /** Meta description. 150–160 chars, includes the primary keyword. */
  description: string;
  /** Primary keyword first — it also lands in the H1 and the first paragraph. */
  keywords: readonly string[];
  /** Slugs of 3 sibling games to cross-link. Prevents orphan pages. */
  related: readonly string[];
  /** Question/answer pairs rendered as visible copy AND FAQPage JSON-LD. */
  faq?: readonly { question: string; answer: string }[];
}

export interface GameDefinition {
  /** URL-safe id. Also the `gameId` stored in the game_score table. */
  slug: string;
  /** Human name used in headings, cards and structured data. */
  name: string;
  category: GameCategory;
  company: CompanySlug;
  kind: GameKind;
  /** Short card blurb — one sentence, no marketing filler. */
  tagline: string;
  difficulty: GameDifficulty;
  duration: GameDuration;
  /** Cognitive abilities the game exercises. Rendered as chips + JSON-LD. */
  skills: readonly string[];
  seo: GameSeo;
  /** Playable route. Derived by `playHref()` unless overridden. */
  href?: string;
  /** Set for kind === "embed". */
  embedUrl?: string;
  /** Set for kind === "html": folder under src/games/html-assessments. */
  htmlFolder?: string;
  /** Hidden from hubs and the sitemap while true. */
  comingSoon?: boolean;
  /** Requires an active subscription. Free games are the SEO surface. */
  pro?: boolean;
  /** Set once a /rules/<slug> guide page exists. */
  hasRulesPage?: boolean;
}

/**
 * The runtime half of a module: the component the play route renders.
 * Loaded lazily so a game's code never lands in another game's bundle.
 */
export type GameComponent = ComponentType<Record<string, never>>;

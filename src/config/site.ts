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
    "Capgemini & Cognizant game-based aptitude practice on Blync. Switch, Grid, Digit, Motion, Inductive & Deductive Challenges — full tutorials, mock tests & solutions for 2026 placements. No signup required.",
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

    // Other Relevant Keywords
    "Cognizant GenC game based test",
    "Cognizant puzzle round",
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
  },
  creator: "@nishuldhakar",
  locale: "en_IN",
  adsenseId: "ca-pub-6271827630758167",
  analyticsId: "G-2WMDWXGJK7",
  umamiId: "c97607d1-dd2e-479f-b785-a935c0dd5e79",
} as const;

/** All game slugs used in /play/ routes */
export const gameSlugs = [
  "switch-challenge",
  "grid-challenge",
  "digit-challenge",
  "motion-challenge",
  "inductive-challenge",
  "deductive-challenge",
] as const;

/** All rule page slugs used in /rules/ routes */
export const ruleSlugs = [
  "switch-challenge",
  "grid-challenge",
  "digit-challenge",
  "motion-challenge",
  "inductive-challenge",
  "deductive-challenge",
] as const;

export type GameSlug = (typeof gameSlugs)[number];
export type RuleSlug = (typeof ruleSlugs)[number];

// ── SEO game pages config (/games/[category]/[slug]) ─────────────────────────
// Each entry drives generateMetadata + JSON-LD + internal links on game SEO pages.
// "related" = 3 game slugs to link from this game's page (internal linking).
export const gamesConfig = [
  {
    slug: "switch-challenge",
    name: "Switch Challenge",
    category: "cognitive",
    headline: "Switch Challenge — Free Online Cognitive Game",
    description:
      "Practice Switch Challenge for Capgemini & Cognizant placement tests. Train cognitive flexibility and fast pattern switching in free timed online sessions. No download needed.",
    keywords: ["switch challenge", "capgemini switch challenge", "cognitive flexibility game online free"],
    related: ["digit-challenge", "motion-challenge", "deductive-challenge"],
  },
  {
    slug: "digit-challenge",
    name: "Digit Challenge",
    category: "cognitive",
    headline: "Digit Challenge — Free Online Cognitive Game",
    description:
      "Solve Digit Challenge number sequences used in Capgemini & Cognizant aptitude tests. Practice numerical reasoning and pattern recognition for free online. No signup needed.",
    keywords: ["digit challenge", "number sequence game", "capgemini digit challenge online free"],
    related: ["switch-challenge", "inductive-challenge", "deductive-challenge"],
  },
  {
    slug: "motion-challenge",
    name: "Motion Challenge",
    category: "cognitive",
    headline: "Motion Challenge — Free Online Cognitive Game",
    description:
      "Practice Motion Challenge pattern movement puzzles for Capgemini placement. Identify moving patterns in free 4-minute timed sessions. Free cognitive game online, no download.",
    keywords: ["motion challenge", "pattern movement game", "capgemini motion challenge free"],
    related: ["switch-challenge", "grid-challenge", "deductive-challenge"],
  },
  {
    slug: "deductive-challenge",
    name: "Deductive Challenge",
    category: "cognitive",
    headline: "Deductive Challenge — Free Online Cognitive Game",
    description:
      "Sharpen deductive reasoning with free Deductive Challenge puzzles from Capgemini aptitude tests. Logical thinking practice online. Free cognitive game, no signup needed.",
    keywords: ["deductive challenge", "logical reasoning game free", "capgemini deductive challenge"],
    related: ["inductive-challenge", "digit-challenge", "switch-challenge"],
  },
  {
    slug: "inductive-challenge",
    name: "Inductive Challenge",
    category: "cognitive",
    headline: "Inductive Challenge — Free Online Cognitive Game",
    description:
      "Practice Inductive Challenge abstract reasoning for Capgemini & Cognizant tests. Identify patterns and complete sequences. Free online brain training, no download needed.",
    keywords: ["inductive challenge", "abstract reasoning game free", "pattern completion game online"],
    related: ["deductive-challenge", "digit-challenge", "motion-challenge"],
  },
  {
    slug: "grid-challenge",
    name: "Grid Challenge",
    category: "cognitive",
    headline: "Grid Challenge — Free Online Cognitive Game",
    description:
      "Practice Grid Challenge spatial reasoning puzzles for Capgemini placement. Train visual pattern recognition and spatial awareness. Free online cognitive game, no signup.",
    keywords: ["grid challenge", "spatial reasoning game free", "capgemini grid challenge online", "grid challenge capgemini", "grid challenge test"],
    related: ["switch-challenge", "motion-challenge", "inductive-challenge"],
  },
  // {
  //   slug: "memory-challenge",
  //   name: "Memory Challenge",
  //   category: "memory",
  //   headline: "Memory Challenge — Free Online Memory Game",
  //   description:
  //     "Train working memory with free online Memory Challenge games. Improve recall speed and short-term memory retention. Free brain training game online, no download needed.",
  //   keywords: ["memory challenge", "memory games online free", "brain training memory game"],
  //   related: ["recall-challenge", "digit-challenge", "switch-challenge"],
  // },
  {
    slug: "recall-challenge",
    name: "Recall Challenge",
    category: "memory",
    headline: "Recall Challenge — Free Online Memory Game",
    description:
      "Sharpen recall ability with free Recall Challenge memory games. Test and improve episodic memory and recall speed online. Free cognitive brain training game.",
    keywords: ["recall challenge", "recall memory game free", "free memory training online"],
    related: ["memory-challenge", "digit-challenge", "inductive-challenge"],
  },
] as const;

export type GameConfig = (typeof gamesConfig)[number];
export type GameCategorySlug = GameConfig["category"];

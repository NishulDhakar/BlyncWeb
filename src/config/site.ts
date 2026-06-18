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
  // ── Brain Games (from Lakshyapachkhede/brain-games) ────────────────────────
  {
    slug: "sudoku",
    name: "Sudoku",
    category: "brain",
    headline: "Sudoku — Free Online Brain Puzzle Game",
    description:
      "Play classic Sudoku puzzles free online. Fill the 9×9 grid using logic and deduction — no guessing needed. Sharpen number reasoning and concentration. Free brain game, no download.",
    keywords: ["sudoku online free", "sudoku puzzle game", "free sudoku brain training", "number logic puzzle"],
    related: ["minesweeper", "15-puzzle", "tic-tac-toe"],
  },
  {
    slug: "15-puzzle",
    name: "15 Puzzle",
    category: "brain",
    headline: "15 Puzzle — Free Online Sliding Tile Game",
    description:
      "Solve the classic 15 sliding tile puzzle online. Arrange numbered tiles in order by sliding them into the empty space. Trains spatial reasoning and planning skills. Free, no signup.",
    keywords: ["15 puzzle online free", "sliding puzzle game", "tile puzzle brain game", "spatial reasoning game"],
    related: ["sudoku", "minesweeper", "snake"],
  },
  {
    slug: "minesweeper",
    name: "Minesweeper",
    category: "brain",
    headline: "Minesweeper — Free Online Logic Game",
    description:
      "Play Minesweeper free online. Use deductive logic to uncover safe cells and flag mines on the grid. Classic brain game that sharpens analytical thinking. No download needed.",
    keywords: ["minesweeper online free", "minesweeper game", "logic deduction game free", "mine sweeper brain game"],
    related: ["sudoku", "15-puzzle", "tic-tac-toe"],
  },
  {
    slug: "tic-tac-toe",
    name: "Tic Tac Toe",
    category: "brain",
    headline: "Tic Tac Toe — Free Online Strategy Game",
    description:
      "Play Tic Tac Toe free online against the computer. Practice strategic thinking and pattern recognition with this classic brain game. Free, instant play in your browser.",
    keywords: ["tic tac toe online free", "tic tac toe game", "strategy game free online", "noughts and crosses"],
    related: ["minesweeper", "sudoku", "snake"],
  },
  {
    slug: "snake",
    name: "Snake",
    category: "brain",
    headline: "Snake — Free Online Reflex & Strategy Game",
    description:
      "Play the classic Snake game free online. Navigate the growing snake to eat food while avoiding walls and yourself. Trains reflexes, spatial awareness, and quick decision-making.",
    keywords: ["snake game online free", "classic snake game", "reflex training game", "snake brain game free"],
    related: ["ant-smasher", "15-puzzle", "tic-tac-toe"],
  },
  {
    slug: "memory-match-pairs",
    name: "Memory Match Pairs",
    category: "brain",
    headline: "Memory Match Pairs — Free Online Memory Game",
    description:
      "Flip cards and find matching pairs in this classic memory game. Improve short-term memory, focus, and recall speed. Free online brain training game, no download needed.",
    keywords: ["memory match game free", "card matching game online", "memory pairs game", "brain training memory free"],
    related: ["sudoku", "15-puzzle", "minesweeper"],
  },
  {
    slug: "ant-smasher",
    name: "Ant Smasher",
    category: "brain",
    headline: "Ant Smasher — Free Online Reflex Game",
    description:
      "Smash the ants before they escape! Test your reflexes and hand-eye coordination with this fast-paced brain game. Free online, play instantly in your browser.",
    keywords: ["ant smasher game free", "reflex game online", "whack a mole style game", "reaction time game free"],
    related: ["snake", "tic-tac-toe", "memory-match-pairs"],
  },
  {
    slug: "dice-roller",
    name: "Dice Roller",
    category: "brain",
    headline: "Dice Roller — Free Online Probability Game",
    description:
      "Roll virtual dice and explore probability. A simple but fun tool for board games, math practice, and probability experiments. Free online, instant results.",
    keywords: ["dice roller online free", "virtual dice game", "probability game free", "random dice online"],
    related: ["sudoku", "tic-tac-toe", "ant-smasher"],
  },
] as const;

export type GameConfig = (typeof gamesConfig)[number];
export type GameCategorySlug = GameConfig["category"];

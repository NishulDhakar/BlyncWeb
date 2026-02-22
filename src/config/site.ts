/**
 * Central site configuration — single source of truth for URLs, branding, and SEO constants.
 * Import this instead of hardcoding URLs in layout.tsx, sitemap.ts, robots.ts, etc.
 */
export const siteConfig = {
    name: "Blync Cognitive Games",
    shortName: "Blync",
    url: "https://www.cognitivegames.me",
    ogImage: "/images/og/og-logo.png",
    description:
        "Play real Capgemini & Cognizant game-based aptitude tests on Blync. Practice Switch, Grid, Digit, Motion, Spacio, Inductive & Deductive Challenges with full tutorials, rules, mock tests & solutions for 2025 placements.",
    keywords: [
        "Capgemini game based aptitude test 2025",
        "Capgemini game round practice",
        "Capgemini cognitive ability test",
        "Cognizant GenC game based test",
        "Cognizant puzzle round",
        "placement game based aptitude",
        "Switch Challenge practice",
        "Digit Challenge practice",
        "Grid Challenge practice",
        "Motion Challenge practice",
        "Spacio Challenge practice",
        "Inductive Challenge puzzles",
        "Deductive Challenge puzzles",
        "placement aptitude games",
        "campus placement 2025 preparation",
        "cognitive assessment practice online",
        "capgemini-game-based-aptitude-test-questions",
        "capgemini coding questions",
        "capgemini game based aptitude test",
        "capgemini technical assessment questions",
        "Capgemini Exceller Game Based Aptitude Test",
    ],
    links: {
        twitter: "https://twitter.com/nishuldhakar",
        github: "https://github.com/NishulDhakar/BlyncWeb",
    },
    creator: "@nishuldhakar",
    locale: "en_IN",
    adsenseId: "ca-pub-5398084204289432",
    analyticsId: "G-2WMDWXGJK7",
    umamiId: "c97607d1-dd2e-479f-b785-a935c0dd5e79",
} as const;

/** All game slugs used in /play/ routes */
export const gameSlugs = [
    "switch-challenge",
    "grid-challenge",
    "digit-challenge",
    "motion-challenge",
    "spacio-challenge",
    "inductive-challenge",
    "deductive-challenge",
] as const;

/** All rule page slugs used in /rules/ routes */
export const ruleSlugs = [
    "switch-challenge",
    "grid-challenge",
    "digit-challenge",
    "motion-challenge",
    "spacio-challenge",
    "inductive-challenge",
    "deductive-challenge",
] as const;

export type GameSlug = (typeof gameSlugs)[number];
export type RuleSlug = (typeof ruleSlugs)[number];

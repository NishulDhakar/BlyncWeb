import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  Gamepad2,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { getGame, seoHref } from "@/games/registry";
import type { CompanySlug } from "@/games/types";

/**
 * Company-by-company game guide — what each game trains and how to play it.
 *
 * Ported from more_games/src/app/docs/page.tsx. The source page hand-wrote
 * hrefs (several pointed at routes that don't exist here, and Grid Challenge
 * had none at all). This version pulls name/skills/href straight from
 * src/games/registry.ts via getGame(), so a broken link here means the slug
 * is wrong, not that someone forgot to update a hardcoded URL.
 */

export const metadata: Metadata = {
  title: "Company Cognitive Games Guide — How Each Game Works",
  description:
    "A short guide to every Capgemini, Accenture and Cognizant cognitive game on Blync: what it trains, how to play it, and where to start practicing.",
  keywords: [
    "capgemini games guide",
    "accenture games guide",
    "cognizant games guide",
    "how to play capgemini game based aptitude test",
    "cognitive games explained",
  ],
  alternates: { canonical: `${siteConfig.url}/docs` },
  openGraph: {
    title: "Company Cognitive Games Guide | Blync",
    description:
      "What each Capgemini, Accenture and Cognizant cognitive game trains, and how to play it.",
    url: `${siteConfig.url}/docs`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Blync Games Guide" }],
  },
};

type GameDoc = {
  slug: string;
  skill: string;
  description: string;
  steps: string[];
};

type CompanyDoc = {
  slug: CompanySlug;
  name: string;
  tagline: string;
  detail: string;
  note: string;
  games: GameDoc[];
};

const capgeminiCognizantGames: GameDoc[] = [
  {
    slug: "switch-challenge",
    skill: "Pattern recognition, reverse logic, and cognitive flexibility",
    description:
      "A sequence changes after passing through a switch. Your job is to identify which switch rule or operator produced the output.",
    steps: [
      "Compare the input and output sequence position by position.",
      "Work backwards to find how each item moved.",
      "Choose the switch code that matches the same movement pattern.",
    ],
  },
  {
    slug: "deductive-challenge",
    skill: "Deductive reasoning, symbol logic, and elimination",
    description:
      "A grid contains symbols with one missing cell. Use row and column rules to decide which symbol fits logically.",
    steps: [
      "Scan the row and column of the missing cell.",
      "Remove symbols that already break the row or column rule.",
      "Select the only symbol that keeps the grid consistent.",
    ],
  },
  {
    slug: "quick-math",
    skill: "Mental arithmetic, number sense, and fast calculation",
    description:
      "A timed number puzzle where you solve arithmetic equations or place digits correctly under pressure.",
    steps: [
      "Read the equation and identify the missing digit or operation.",
      "Calculate mentally before selecting an answer.",
      "Use each available digit carefully and avoid rushed guesses.",
    ],
  },
  {
    slug: "grid-challenge",
    skill: "Working memory, spatial attention, and multitasking",
    description:
      "A grid-based memory task where you remember highlighted positions while solving quick visual checks.",
    steps: [
      "Memorize each highlighted grid position.",
      "Answer the visual comparison task shown between grid prompts.",
      "Recall the marked positions accurately at the end.",
    ],
  },
  {
    slug: "motion-challenge",
    skill: "Planning, movement logic, and optimization",
    description:
      "A board puzzle where you move an object toward a target while handling blocks, barriers, and limited space.",
    steps: [
      "Study the board before moving.",
      "Plan the shortest route to the target.",
      "Move blocks only when they help clear the path.",
    ],
  },
];

const accentureGames: GameDoc[] = [
  {
    slug: "grid-puzzle",
    skill: "Visual memory, symmetry checking, and attention control",
    description:
      "A fast grid challenge where you track positions and respond to visual pattern prompts.",
    steps: [
      "Watch the highlighted grid location carefully.",
      "Answer the mirror or pattern question quickly.",
      "Recall the saved grid positions when asked.",
    ],
  },
  {
    slug: "bubble-math",
    skill: "Arithmetic ordering, calculation speed, and accuracy",
    description:
      "A number game where expression bubbles must be solved and selected in the correct order.",
    steps: [
      "Calculate each bubble expression.",
      "Compare the values from lowest to highest or highest to lowest.",
      "Pop the bubbles in the requested order before time runs out.",
    ],
  },
  {
    slug: "path-finder",
    skill: "Spatial reasoning, path building, and route planning",
    description:
      "A tile route puzzle where you connect a start point to an end point by arranging the path correctly.",
    steps: [
      "Find the start and destination points.",
      "Rotate or adjust path tiles to create one connected route.",
      "Check that every turn points toward the final target.",
    ],
  },
  {
    slug: "key-and-door",
    skill: "Memory, route recall, and decision making",
    description:
      "A compact memory game where you collect a key and reach the door while remembering blocked or failed directions.",
    steps: [
      "Move toward the key first.",
      "Remember which directions are blocked.",
      "Use the learned route to reach the door efficiently.",
    ],
  },
];

const companies: CompanyDoc[] = [
  {
    slug: "accenture",
    name: "Accenture",
    tagline: "Gamified assessment practice for speed, logic, and working memory.",
    detail:
      "Accenture assessment preparation often includes online aptitude, problem-solving, and role-based evaluation practice. These games help students train the kind of focus, memory, and fast reasoning commonly discussed in gamified placement prep.",
    note: "Practice formats are inspired by publicly discussed assessment styles and are not official Accenture exam questions.",
    games: accentureGames,
  },
  {
    slug: "capgemini",
    name: "Capgemini",
    tagline: "Cognitive game practice for placement aptitude preparation.",
    detail:
      "Capgemini placement preparation is commonly associated with game-based aptitude formats such as switch, digit, grid, motion, and deductive reasoning challenges. The goal is to improve speed, accuracy, pattern recognition, and logical thinking before the real assessment.",
    note: "Game names and mechanics are based on public prep resources and student-facing practice patterns, not guaranteed live-test content.",
    games: capgeminiCognizantGames,
  },
  {
    slug: "cognizant",
    name: "Cognizant",
    tagline: "Shared cognitive game practice for Capgemini-style and Cognizant prep.",
    detail:
      "Cognizant preparation can benefit from the same cognitive game practice set used for Capgemini-style game-based aptitude prep. These exercises build transferable reasoning skills for aptitude, attention, and problem-solving rounds.",
    note: "This section intentionally mirrors the Capgemini game set for shared practice, as requested.",
    games: capgeminiCognizantGames,
  },
];

const totalNotes = companies.reduce((sum, c) => sum + c.games.length, 0);

export default function DocsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 pb-20 pt-24 text-foreground sm:px-8 sm:pt-32 lg:px-12 lg:pt-36">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground),transparent_94%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground),transparent_94%)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-56 bg-[linear-gradient(to_bottom,var(--secondary),transparent)]" />

      <section className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-inter text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground shadow-pop-sm">
              <BookOpenCheck className="size-4 text-primary" aria-hidden="true" />
              Blync Docs
            </p>
            <h1 className="mt-5 font-game text-5xl leading-none text-foreground drop-shadow-pop-lg sm:text-6xl lg:text-7xl">
              Company Cognitive Games Guide
            </h1>
            <p className="mt-6 max-w-3xl font-inter text-base leading-8 text-muted-foreground sm:text-lg">
              Short, student-friendly documentation for Accenture, Capgemini, and
              Cognizant game practice. Use it to understand what each game trains,
              how to play, and where to start practicing.
            </p>
          </div>

          <div className="rounded-lg border-4 border-foreground bg-primary p-5 text-primary-foreground shadow-solid-lg">
            <Sparkles className="size-7" aria-hidden="true" />
            <p className="mt-4 font-game text-4xl leading-none">{totalNotes} Practice Notes</p>
            <p className="mt-3 font-inter text-sm font-semibold leading-6 text-primary-foreground/80">
              Quick guides for what each game tests, how to approach it, and
              where to begin practice.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {companies.map((company) => (
            <a
              key={company.slug}
              href={`#${company.slug}`}
              className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-pop-md transition-all hover:-translate-y-1 hover:border-primary hover:shadow-primary-lg"
            >
              <Building2 className="size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-game text-3xl leading-none text-card-foreground">
                {company.name}
              </h2>
              <p className="mt-3 font-inter text-sm leading-6 text-muted-foreground">
                {company.tagline}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl space-y-14">
        {companies.map((company) => (
          <article key={company.slug} id={company.slug} className="scroll-mt-28">
            <div className="border-y border-border py-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-4xl">
                  <p className="font-inter text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Company Details
                  </p>
                  <h2 className="mt-3 font-game text-4xl leading-none text-foreground sm:text-5xl">
                    {company.name} Games
                  </h2>
                  <p className="mt-5 font-inter text-base leading-8 text-muted-foreground">
                    {company.detail}
                  </p>
                </div>
                <p className="max-w-md rounded-lg border border-primary/35 bg-primary/10 p-4 font-inter text-sm font-medium leading-6 text-foreground">
                  {company.note}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {company.games.map((doc) => {
                const game = getGame(doc.slug);
                if (!game) return null;

                return (
                  <div
                    key={`${company.slug}-${doc.slug}`}
                    className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-pop-lg sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-primary">
                        <Gamepad2 className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-game text-3xl leading-none text-card-foreground">
                          {game.name}
                        </h3>
                        <p className="mt-2 font-inter text-sm font-semibold leading-6 text-primary">
                          Tests: {doc.skill}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 font-inter text-sm leading-7 text-muted-foreground sm:text-base">
                      {doc.description}
                    </p>

                    <div className="mt-6">
                      <div className="flex items-center gap-2 font-inter text-sm font-semibold text-card-foreground">
                        <ListChecks className="size-5 text-primary" aria-hidden="true" />
                        How to play
                      </div>
                      <ol className="mt-3 space-y-2 font-inter text-sm leading-6 text-muted-foreground">
                        {doc.steps.map((step, index) => (
                          <li key={step} className="flex gap-3">
                            <span className="font-semibold text-primary">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="mt-6 flex min-h-11 items-center">
                      <Link
                        href={seoHref(game)}
                        className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 py-2.5 font-inter text-sm font-bold text-primary-foreground shadow-solid-sm transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
                      >
                        Play practice
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

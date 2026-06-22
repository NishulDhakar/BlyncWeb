import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig, gamesConfig } from "@/config/site";
import BrainGamesCard from "@/components/games/BrainGamesCard";
import GamesCard from "@/components/games/GamesCard";
import MemoryGamesCard from "@/components/games/MemoryGamesCard";

// ── Category configuration ──────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  cognitive: {
    title: "All 6 Capgemini Cognitive Games — Free Practice 2026 | Blync",
    description:
      "Practice all 6 Capgemini cognitive ability games free. Switch, Digit, Motion, Grid, Inductive & Deductive challenges. No download, no signup. Unlimited practice for 2026 placements.",
    keywords: [
      "capgemini cognitive games",
      "aptitude games",
      "cognitive ability games free",
      "capgemini cognitive ability games",
      "cognizant game based aptitude practice",
      "free cognitive games online",
      "placement aptitude practice 2026",
      "switch challenge capgemini",
      "game based aptitude test free",
    ],
    ogTitle: "All 6 Capgemini Cognitive Games — Free Practice 2026 | Blync",
    ogDescription:
      "Practice all 6 Capgemini & Cognizant cognitive aptitude games free. No signup, unlimited attempts.",
    ogAlt: "Capgemini Cognitive Games — Blync",
    heading: "Cognitive Games",
    heroText: (count: number) => (
      <p className="relative text-sm text-muted-foreground max-w-xl leading-relaxed">
        Practice all{" "}
        <span className="text-foreground font-semibold">{count} cognitive games</span>{" "}
        used in <span className="text-foreground font-semibold">Capgemini &amp; Cognizant</span> game-based
        aptitude rounds. Free online, no download. Each game matches the real assessment format.
      </p>
    ),
    faq: [
      {
        name: "Is the Capgemini game round elimination based?",
        text: "Yes. The Capgemini game-based aptitude test is typically an elimination round. You must clear the cut-off in games like Switch Challenge and Deductive Logic to proceed to the next interview stage.",
      },
      {
        name: "How many games are in the Capgemini cognitive assessment?",
        text: "Usually 4–6 games, most commonly Switch Challenge, Grid Challenge, Digit Challenge, and Deductive/Inductive reasoning puzzles.",
      },
      {
        name: "Are Cognizant GenC games similar to Capgemini?",
        text: "Yes. Both companies often use the same assessment platform (Aon/cut-e). Practicing Switch Challenge and grid-based logic games helps you pass both.",
      },
      {
        name: "Are these cognitive games free to practice?",
        text: "Yes. All cognitive games on Blync are completely free. No payment, no download — just sign in and start practicing.",
      },
    ],
    crossLink: null,
  },
  memory: {
    title: "Memory Games Online Free — Brain Training & Recall Practice | Blync",
    description:
      "Play free online memory games to improve recall speed, working memory, and short-term retention. Memory Challenge & Recall Challenge — free brain training, no download needed.",
    keywords: [
      "memory games online free",
      "brain training memory game",
      "recall challenge free",
      "memory challenge online",
      "improve working memory game",
      "free memory brain training",
    ],
    ogTitle: "Free Memory Games Online | Blync",
    ogDescription:
      "Play free online memory games. Improve recall, working memory & retention. No download, no signup.",
    ogAlt: "Memory Games — Blync",
    heading: "Memory Games",
    heroText: (count: number) => (
      <p className="relative text-lg text-muted-foreground max-w-2xl leading-relaxed">
        Improve your{" "}
        <span className="text-foreground font-semibold">working memory, recall speed</span>, and
        short-term retention with free online memory games. No download, no payment — train your
        brain directly in the browser.
      </p>
    ),
    faq: [
      {
        name: "Do memory games actually improve memory?",
        text: "Yes. Regular practice with working memory tasks has been shown to improve short-term recall, attention span, and pattern retention — all of which help in cognitive assessments and daily tasks.",
      },
      {
        name: "What is the difference between Memory Challenge and Recall Challenge?",
        text: "Memory Challenge tests your ability to retain and reproduce sequences shown briefly. Recall Challenge focuses on episodic recall — remembering what appeared earlier in the session after a delay.",
      },
      {
        name: "Are these memory games free to play?",
        text: "Yes. All memory games on Blync are completely free. No payment, no app download — just sign in and start training your memory.",
      },
    ],
    crossLink: { label: "Also explore Cognitive Games", href: "/games/cognitive", description: "Switch, Digit, Motion & more — perfect for Capgemini &amp; Cognizant aptitude rounds." },
  },
  brain: {
    title: "Brain Games Online Free — Logic, Puzzles & Reflex Training | Blync",
    description:
      "Play free online brain games — Sudoku, Minesweeper, 15 Puzzle, Snake, Tic Tac Toe & more. Sharpen logic, strategy, reflexes, and memory. No download, no signup required.",
    keywords: [
      "brain games online free",
      "free brain training games",
      "logic puzzles online",
      "sudoku online free",
      "minesweeper online free",
      "brain teaser games",
      "puzzle games free online",
      "cognitive brain games",
      "reflex training games",
    ],
    ogTitle: "Free Brain Games Online | Blync",
    ogDescription:
      "Play free brain games — Sudoku, Minesweeper, Snake & more. Sharpen logic and reflexes. No download, no signup.",
    ogAlt: "Brain Games — Blync",
    heading: "Brain Games",
    heroText: (count: number) => (
      <p className="relative text-lg text-muted-foreground max-w-2xl leading-relaxed">
        Sharpen your{" "}
        <span className="text-foreground font-semibold">logic, strategy, reflexes</span>, and
        problem-solving skills with classic brain teasers. Sudoku, Minesweeper, Snake, and more —
        all free, instantly playable in your browser.
      </p>
    ),
    faq: [
      {
        name: "What are brain games?",
        text: "Brain games are fun interactive puzzles and challenges designed to exercise your cognitive skills — including logic, strategy, spatial reasoning, memory, and reflexes. Examples include Sudoku, Minesweeper, and sliding tile puzzles.",
      },
      {
        name: "Do brain games actually improve cognitive function?",
        text: "Research shows that regular practice with puzzles and logic games can improve problem-solving speed, working memory, and attention span. While they're not a substitute for broader cognitive training, they're an effective and enjoyable way to keep your brain sharp.",
      },
      {
        name: "Are these brain games free to play?",
        text: "Yes. All brain games on Blync are completely free. No payment, no app download — just open and play directly in your browser.",
      },
      {
        name: "Can I play these brain games on my phone?",
        text: "Yes. All games are browser-based and work on mobile, tablet, and desktop. No installation or download needed.",
      },
    ],
    crossLink: { label: "Also explore Cognitive Games", href: "/games/cognitive", description: "Switch, Digit, Motion & more — perfect for Capgemini &amp; Cognizant aptitude rounds." },
  },
} as const;

type CategoryKey = keyof typeof CATEGORY_CONFIG;
const VALID_CATEGORIES = Object.keys(CATEGORY_CONFIG) as CategoryKey[];

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const config = CATEGORY_CONFIG[category as CategoryKey];
  if (!config) return {};

  return {
    title: config.title,
    description: config.description,
    keywords: [...config.keywords],
    alternates: { canonical: `${siteConfig.url}/games/${category}` },
    openGraph: {
      title: config.ogTitle,
      description: config.ogDescription,
      url: `${siteConfig.url}/games/${category}`,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: config.ogAlt,
        },
      ],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const config = CATEGORY_CONFIG[category as CategoryKey];
  if (!config) notFound();

  const categoryGames = gamesConfig.filter((g) => g.category === category);
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faq.map((faq) => ({
      "@type": "Question",
      name: faq.name,
      acceptedAnswer: { "@type": "Answer", text: faq.text },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Games", item: `${siteConfig.url}/games` },
      { "@type": "ListItem", position: 3, name: categoryLabel, item: `${siteConfig.url}/games/${category}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="max-w-6xl mx-auto px-4 py-12 mt-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-10">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-border">/</li>
            <li>
              <Link href="/games" className="hover:text-foreground transition-colors">
                Games
              </Link>
            </li>
            <li aria-hidden className="text-border">/</li>
            <li className="text-foreground font-medium">{categoryLabel}</li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="relative mb-16">
          {category === "brain" && (
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                Fun &amp; Logic
              </span>
              <span className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-muted-foreground">
                Classic Puzzles
              </span>
              <span className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-muted-foreground">
                {categoryGames.length} Games Free
              </span>
            </div>
          )}

          {category === "memory" && (
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                Brain Training
              </span>
              <span className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-muted-foreground">
                Improve Recall Speed
              </span>
              <span className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-muted-foreground">
                {categoryGames.length} Game Free
              </span>
            </div>
          )}

          <h1 className="relative text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-[1.1]">
            {config.heading}
          </h1>

          {config.heroText(categoryGames.length)}

          {/* Quick stats */}
          {category !== "cognitive" && (
            <div className="relative flex flex-wrap gap-8 mt-8 pt-8 border-t border-border/40">
              {(category === "brain"
                ? [
                    { value: String(categoryGames.length), label: "Games" },
                    { value: "Free", label: "Always" },
                    { value: "No", label: "Download" },
                    { value: "Instant", label: "Play" },
                  ]
                : [
                    { value: String(categoryGames.length), label: "Live Now" },
                    { value: "Free", label: "Always" },
                    { value: "No", label: "Signup" },
                    { value: "Instant", label: "Results" },
                  ]
              ).map((s) => (
                <div key={s.label} className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">{s.value}</span>
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category-specific game cards */}
        {category === "brain" && <BrainGamesCard />}
        {category === "cognitive" && <GamesCard />}
        {category === "memory" && <MemoryGamesCard />}

        {/* Cross-link */}
        {config.crossLink && (
          <section className="mb-12">
            <div className="p-5 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold text-foreground mb-1">{config.crossLink.label}</p>
                <p className="text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: config.crossLink.description }}
                />
              </div>
              <Link
                href={config.crossLink.href}
                className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-border/40 bg-white/5 text-foreground/70 hover:text-foreground hover:border-border/60 transition-colors"
              >
                Explore →
              </Link>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="border-t border-border/40 pt-12">
          <h2 className="text-2xl font-semibold mb-8">Frequently Asked Questions</h2>
          <dl className="space-y-6">
            {config.faq.map((faq, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-border/50 bg-muted/20 hover:border-border/80 transition-colors"
              >
                <dt className="font-semibold text-foreground mb-2">{faq.name}</dt>
                <dd className="text-muted-foreground text-sm leading-relaxed">
                  {faq.text}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </>
  );
}

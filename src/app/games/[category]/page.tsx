import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig, gamesConfig } from "@/config/site";
import GameGrid from "@/components/games/GameGrid";
import type { GameCategory } from "@/games/types";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

// ── Category configuration ──────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  cognitive: {
    title: "All 6 Capgemini Cognitive Games — Practice & Mock Tests 2026",
    description:
      "Practice all 6 Capgemini cognitive ability games. Switch, Digit, Motion, Grid, Inductive & Deductive challenges with full mock tests & solutions on Blync Pro.",
    keywords: [
      "capgemini cognitive games",
      "aptitude games",
      "cognitive ability games",
      "capgemini cognitive ability games",
      "cognizant game based aptitude practice",
      "cognitive games online",
      "placement aptitude practice 2026",
      "switch challenge capgemini",
      "game based aptitude test",
    ],
    ogTitle: "All 6 Capgemini Cognitive Games — Practice & Prep 2026 | Blync Pro",
    ogDescription:
      "Practice all 6 Capgemini & Cognizant cognitive aptitude games with Blync Pro. Unlimited attempts & analytics.",
    ogAlt: "Capgemini Cognitive Games — Blync",
    heading: "Cognitive Games",
    heroText: (count: number) => (
      <p className="relative text-sm text-muted-foreground max-w-xl leading-relaxed">
        Practice all{" "}
        <span className="text-foreground font-semibold">{count} cognitive games</span>{" "}
        used in <span className="text-foreground font-semibold">Capgemini &amp; Cognizant</span> game-based
        aptitude rounds. Realistic exam timing, solutions, and scoring guides.
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
        text: "Free accounts can read complete game guides, rules, and strategies. The interactive challenges, mock tests, and performance analytics require Blync Pro (from ₹49/month).",
      },
    ],
    crossLink: null,
  },
  memory: {
    title: "Memory Games Online — Brain Training & Recall Practice | Blync Pro",
    description:
      "Play online memory games to improve recall speed, working memory, and short-term retention. Memory Challenge & Recall Challenge with Blync Pro.",
    keywords: [
      "memory games online",
      "brain training memory game",
      "recall challenge",
      "memory challenge online",
      "improve working memory game",
      "memory brain training",
    ],
    ogTitle: "Memory Games Online | Blync Pro",
    ogDescription:
      "Play online memory games. Improve recall, working memory & retention with Blync Pro.",
    ogAlt: "Memory Games — Blync",
    heading: "Memory Games",
    heroText: (count: number) => (
      <p className="relative text-lg text-muted-foreground max-w-2xl leading-relaxed">
        Improve your{" "}
        <span className="text-foreground font-semibold">working memory, recall speed</span>, and
        short-term retention with online memory games. Train your brain directly in the browser with Blync Pro.
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
        text: "Interactive memory challenges and performance tracking are part of Blync Pro. Free accounts have full access to memory guides and techniques.",
      },
    ],
    crossLink: { label: "Also explore Cognitive Games", href: "/games/cognitive", description: "Switch, Digit, Motion & more — perfect for Capgemini &amp; Cognizant aptitude rounds." },
  },
  brain: {
    title: "Brain Games Online — Logic, Puzzles & Reflex Training | Blync Pro",
    description:
      "Play online brain games — Sudoku, Minesweeper, 15 Puzzle, Snake, Tic Tac Toe & more. Sharpen logic, strategy, reflexes, and memory with Blync Pro.",
    keywords: [
      "brain games online",
      "brain training games",
      "logic puzzles online",
      "sudoku online",
      "minesweeper online",
      "brain teaser games",
      "puzzle games online",
      "cognitive brain games",
      "reflex training games",
    ],
    ogTitle: "Brain Games Online | Blync Pro",
    ogDescription:
      "Play brain games — Sudoku, Minesweeper, Snake & more. Sharpen logic and reflexes with Blync Pro.",
    ogAlt: "Brain Games — Blync",
    heading: "Brain Games",
    heroText: (count: number) => (
      <p className="relative text-lg text-muted-foreground max-w-2xl leading-relaxed">
        Sharpen your{" "}
        <span className="text-foreground font-semibold">logic, strategy, reflexes</span>, and
        problem-solving skills with classic brain teasers. Sudoku, Minesweeper, Snake, and more —
        playable in your browser with Blync Pro.
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
        text: "Interactive brain game rounds and leaderboard tracking are unlocked with Blync Pro.",
      },
      {
        name: "Can I play these brain games on my phone?",
        text: "Yes. All games are browser-based and work on mobile, tablet, and desktop. No installation or download needed.",
      },
    ],
    crossLink: { label: "Also explore Cognitive Games", href: "/games/cognitive", description: "Switch, Digit, Motion & more — perfect for Capgemini &amp; Cognizant aptitude rounds." },
  },
  quiz: {
    title: "Placement Assessment Practice — Technical & Debugging Rounds | Blync Pro",
    description:
      "Practice full-length placement assessments online. A 150-question Accenture technical quiz and two timed Capgemini-style debugging rounds with instant explanations on Blync Pro.",
    keywords: [
      "accenture technical assessment questions",
      "capgemini debugging questions",
      "placement assessment practice online",
      "technical round practice test",
      "debugging round questions with answers",
      "campus placement assessment 2026",
    ],
    ogTitle: "Placement Assessment Practice | Blync Pro",
    ogDescription:
      "Full-length technical and debugging assessments with timers, instant explanations and answer keys on Blync Pro.",
    ogAlt: "Placement Assessments — Blync",
    heading: "Technical & Debugging Assessments",
    heroText: (count: number) => (
      <p className="relative text-lg text-muted-foreground max-w-2xl leading-relaxed">
        Sit{" "}
        <span className="text-foreground font-semibold">{count} full-length assessments</span>{" "}
        under real exam timing — the Accenture technical quiz and two Capgemini-style debugging
        rounds. Instant explanations and section-wise answer keys with Blync Pro.
      </p>
    ),
    faq: [
      {
        name: "What is the Accenture technical assessment like?",
        text: "150 questions across ten sections in 45 minutes, covering programming fundamentals, databases, networking, operating systems, cloud and security. Our practice quiz mirrors that structure and timing.",
      },
      {
        name: "What happens in a debugging round?",
        text: "You are given nearly-correct code and asked to find the defect. The algorithms are standard; the bugs are off-by-one errors, wrong base cases and inverted conditions. You edit until the sample tests pass.",
      },
      {
        name: "Are the assessments free?",
        text: "Complete timed assessments, score diagnostics, and full solution keys are available to Blync Pro members.",
      },
    ],
    crossLink: { label: "Also practise the game rounds", href: "/games/cognitive", description: "Switch, Grid, Motion and more — the cognitive half of the same assessments." },
  },
  communication: {
    title: "Cognizant Communication Round Practice — Speaking & Grammar Tests | Blync Pro",
    description:
      "Practice all five Cognizant communication rounds online: read aloud, listen and repeat, grammar, listening comprehension and open response with Blync Pro.",
    keywords: [
      "cognizant communication round practice",
      "cognizant genc communication assessment",
      "read aloud test practice online",
      "listen and repeat test practice",
      "english communication test for placements",
      "versant test practice",
    ],
    ogTitle: "Cognizant Communication Round Practice | Blync Pro",
    ogDescription:
      "All five Cognizant communication rounds — speaking, listening, grammar and comprehension with Blync Pro.",
    ogAlt: "Communication Rounds — Blync",
    heading: "Communication Rounds",
    heroText: (count: number) => (
      <p className="relative text-lg text-muted-foreground max-w-2xl leading-relaxed">
        Work through all{" "}
        <span className="text-foreground font-semibold">{count} communication rounds</span>{" "}
        used in the Cognizant GenC assessment — speaking, listening, grammar and comprehension with Blync Pro.
      </p>
    ),
    faq: [
      {
        name: "Which rounds are in the Cognizant communication assessment?",
        text: "Five: read a sentence aloud, listen and repeat, grammar correction, listening comprehension, and an open spoken response. All five are available here.",
      },
      {
        name: "Do I need a microphone?",
        text: "For the three speaking rounds, yes. Grammar and comprehension need only audio playback. Recordings are analysed in the browser and are never uploaded.",
      },
      {
        name: "How long should an open response answer be?",
        text: "Around 45 to 60 seconds, with a clear opening statement, two supporting points and a close. Rambling costs more marks than a short, structured answer.",
      },
    ],
    crossLink: { label: "Also practise the technical rounds", href: "/games/quiz", description: "The Accenture technical quiz and two timed debugging assessments." },
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
                {categoryGames.length} Challenges Available
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
                {categoryGames.length} Challenges Available
              </span>
            </div>
          )}

          <h1 className="relative text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-[1.1]">
            {config.heading}
          </h1>

          {config.heroText(categoryGames.length)}

          {category === "cognitive" && (
            <div className="mt-6">
              <Button asChild size="sm" variant="outline" className="border-sky-500/30 hover:border-sky-500/50 hover:bg-sky-500/10 text-sky-500 gap-2">
                <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" /> Start Repo Locally
                </a>
              </Button>
            </div>
          )}

          {/* Quick stats */}
          {category !== "cognitive" && (
            <div className="relative flex flex-wrap gap-8 mt-8 pt-8 border-t border-border/40">
              {(category === "brain"
                ? [
                    { value: String(categoryGames.length), label: "Games" },
                    { value: "Pro", label: "Access" },
                    { value: "No", label: "Download" },
                    { value: "Instant", label: "Play" },
                  ]
                : [
                    { value: String(categoryGames.length), label: "Live Now" },
                    { value: "Pro", label: "Access" },
                    { value: "Full", label: "Solutions" },
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

        {/* Game cards — driven by src/games/registry.ts, so a new game
            appears here automatically instead of needing a card component. */}
        <GameGrid category={category as GameCategory} heading={`All ${config.heading}`} />

        {/* GitHub CTA Banner */}
        <div className="my-16 p-8 rounded-3xl bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-purple-500/10 border border-sky-500/20 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Start the repo locally
            </h3>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Clone the BlyncWeb repo and run it locally for free access to all games.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-2xl shadow-md transition-all duration-300 hover:scale-105 gap-2">
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5" /> Open GitHub Repo
            </a>
          </Button>
        </div>

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

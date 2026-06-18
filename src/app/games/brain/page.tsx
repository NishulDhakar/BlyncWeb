import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, gamesConfig } from "@/config/site";
import BrainGamesCard from "@/components/games/BrainGamesCard";

export const metadata: Metadata = {
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
  alternates: { canonical: `${siteConfig.url}/games/brain` },
  openGraph: {
    title: "Free Brain Games Online | Blync",
    description:
      "Play free brain games — Sudoku, Minesweeper, Snake & more. Sharpen logic and reflexes. No download, no signup.",
    url: `${siteConfig.url}/games/brain`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Brain Games — Blync",
      },
    ],
  },
};

const brainGames = gamesConfig.filter((g) => g.category === "brain");

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are brain games?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Brain games are fun interactive puzzles and challenges designed to exercise your cognitive skills — including logic, strategy, spatial reasoning, memory, and reflexes. Examples include Sudoku, Minesweeper, and sliding tile puzzles.",
      },
    },
    {
      "@type": "Question",
      name: "Do brain games actually improve cognitive function?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Research shows that regular practice with puzzles and logic games can improve problem-solving speed, working memory, and attention span. While they're not a substitute for broader cognitive training, they're an effective and enjoyable way to keep your brain sharp.",
      },
    },
    {
      "@type": "Question",
      name: "Are these brain games free to play?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All brain games on Blync are completely free. No payment, no app download — just open and play directly in your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Can I play these brain games on my phone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All games are browser-based and work on mobile, tablet, and desktop. No installation or download needed.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    { "@type": "ListItem", position: 2, name: "Games", item: `${siteConfig.url}/games` },
    { "@type": "ListItem", position: 3, name: "Brain Games", item: `${siteConfig.url}/games/brain` },
  ],
};

export default function BrainGamesPage() {
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
            <li className="text-foreground font-medium">Brain Games</li>
          </ol>
        </nav>

        {/* ── Hero ── */}
        <div className="relative mb-16">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
              Fun & Logic
            </span>
            <span className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-muted-foreground">
              Classic Puzzles
            </span>
            <span className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-muted-foreground">
              {brainGames.length} Games Free
            </span>
          </div>

          <h1 className="relative text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-[1.1]">
            Brain Games
          </h1>

          <p className="relative text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Sharpen your{" "}
            <span className="text-foreground font-semibold">logic, strategy, reflexes</span>, and
            problem-solving skills with classic brain teasers. Sudoku, Minesweeper, Snake, and more —
            all free, instantly playable in your browser.
          </p>

          {/* Quick stats */}
          <div className="relative flex flex-wrap gap-8 mt-8 pt-8 border-t border-border/40">
            {[
              { value: String(brainGames.length), label: "Games" },
              { value: "Free", label: "Always" },
              { value: "No", label: "Download" },
              { value: "Instant", label: "Play" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">{s.value}</span>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brain Game Cards */}
        <BrainGamesCard />

        {/* Cross-link */}
        <section className="mb-12">
          <div className="p-5 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold text-foreground mb-1">Also explore Cognitive Games</p>
              <p className="text-sm text-muted-foreground">
                Switch, Digit, Motion & more — perfect for Capgemini &amp; Cognizant aptitude rounds.
              </p>
            </div>
            <Link
              href="/games/cognitive"
              className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-border/40 bg-white/5 text-foreground/70 hover:text-foreground hover:border-border/60 transition-colors"
            >
              Explore →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border/40 pt-12">
          <h2 className="text-2xl font-semibold mb-8">Frequently Asked Questions</h2>
          <dl className="space-y-6">
            {faqSchema.mainEntity.map((faq, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-border/50 bg-muted/20 hover:border-border/80 transition-colors"
              >
                <dt className="font-semibold text-foreground mb-2">{faq.name}</dt>
                <dd className="text-muted-foreground text-sm leading-relaxed">
                  {faq.acceptedAnswer.text}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </>
  );
}

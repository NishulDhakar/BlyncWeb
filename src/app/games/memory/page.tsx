import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, gamesConfig } from "@/config/site";
import MemoryGamesCard from "@/components/games/MemoryGamesCard";

export const metadata: Metadata = {
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
  alternates: { canonical: `${siteConfig.url}/games/memory` },
  openGraph: {
    title: "Free Memory Games Online | Blync",
    description:
      "Play free online memory games. Improve recall, working memory & retention. No download, no signup.",
    url: `${siteConfig.url}/games/memory`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Memory Games — Blync",
      },
    ],
  },
};

const memoryGames = gamesConfig.filter((g) => g.category === "memory");

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do memory games actually improve memory?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Regular practice with working memory tasks has been shown to improve short-term recall, attention span, and pattern retention — all of which help in cognitive assessments and daily tasks.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between Memory Challenge and Recall Challenge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Memory Challenge tests your ability to retain and reproduce sequences shown briefly. Recall Challenge focuses on episodic recall — remembering what appeared earlier in the session after a delay.",
      },
    },
    {
      "@type": "Question",
      name: "Are these memory games free to play?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All memory games on Blync are completely free. No payment, no app download — just sign in and start training your memory.",
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
    { "@type": "ListItem", position: 3, name: "Memory", item: `${siteConfig.url}/games/memory` },
  ],
};

export default function MemoryGamesPage() {
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
            <li className="text-foreground font-medium">Memory</li>
          </ol>
        </nav>

        {/* ── Hero ── */}
        <div className="relative mb-16">
          {/* Ambient glow */}
          {/* <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-10 w-[500px] h-[280px] rounded-full blur-[100px] opacity-30"
            style={{ background: "radial-gradient(ellipse, #0586C8 0%, #6366F1 70%, transparent 100%)" }}
          /> */}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
              Brain Training
            </span>
            <span className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-muted-foreground">
              Improve Recall Speed
            </span>
            <span className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-muted-foreground">
              {memoryGames.length} Game Free
            </span>
          </div>

          <h1 className="relative text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-[1.1]">
            Memory Games
          </h1>

          <p className="relative text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Improve your{" "}
            <span className="text-foreground font-semibold">working memory, recall speed</span>, and
            short-term retention with free online memory games. No download, no payment — train your
            brain directly in the browser.
          </p>

          {/* Quick stats */}
          <div className="relative flex flex-wrap gap-8 mt-8 pt-8 border-t border-border/40">
            {[
              { value: String(memoryGames.length), label: "Live Now" },
              { value: "Free", label: "Always" },
              { value: "No", label: "Signup" },
              { value: "Instant", label: "Results" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">{s.value}</span>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Game Cards */}
        <MemoryGamesCard />

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

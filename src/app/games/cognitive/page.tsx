import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, gamesConfig } from "@/config/site";
import GamesCard from "@/components/games/GamesCard";

export const metadata: Metadata = {
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
  alternates: { canonical: `${siteConfig.url}/games/cognitive` },
  openGraph: {
    title: "All 6 Capgemini Cognitive Games — Free Practice 2026 | Blync",
    description:
      "Practice all 6 Capgemini & Cognizant cognitive aptitude games free. No signup, unlimited attempts.",
    url: `${siteConfig.url}/games/cognitive`,
    images: [
      {
        url: `${siteConfig.url}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: "Capgemini Cognitive Games — Blync",
      },
    ],
  },
};

const cognitiveGames = gamesConfig.filter((g) => g.category === "cognitive");

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the Capgemini game round elimination based?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Capgemini game-based aptitude test is typically an elimination round. You must clear the cut-off in games like Switch Challenge and Deductive Logic to proceed to the next interview stage.",
      },
    },
    {
      "@type": "Question",
      name: "How many games are in the Capgemini cognitive assessment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Usually 4–6 games, most commonly Switch Challenge, Grid Challenge, Digit Challenge, and Deductive/Inductive reasoning puzzles.",
      },
    },
    {
      "@type": "Question",
      name: "Are Cognizant GenC games similar to Capgemini?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Both companies often use the same assessment platform (Aon/cut-e). Practicing Switch Challenge and grid-based logic games helps you pass both.",
      },
    },
    {
      "@type": "Question",
      name: "Are these cognitive games free to practice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All cognitive games on Blync are completely free. No payment, no download — just sign in and start practicing.",
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
    {
      "@type": "ListItem",
      position: 3,
      name: "Cognitive",
      item: `${siteConfig.url}/games/cognitive`,
    },
  ],
};

export default function CognitiveGamesPage() {
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

      <main className="max-w-6xl mx-auto px-4 py-12 mt-30 overflow-hidden">
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
            <li className="text-foreground font-medium">Cognitive</li>
          </ol>
        </nav>

        {/* ── Hero ── */}
        <div className="relative mb-16">
          {/* Ambient glow */}
          {/* <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-10 w-[500px] h-[280px] rounded-full blur-[100px] opacity-30"
            style={{ background: "radial-gradient(ellipse, #FF3F8F 0%, #7C3AED 70%, transparent 100%)" }}
          /> */}

          {/* Badges */}
          {/* <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
              Placement Ready
            </span>
            <span className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-muted-foreground">
              Capgemini &amp; Cognizant
            </span>
            <span className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-border/40 bg-white/5 text-muted-foreground">
              {cognitiveGames.length} Games Free
            </span>
          </div> */}

          <h1 className="relative text-2xl md:text-3xl font-bold tracking-tight mb-5 leading-[1.1]">
            Cognitive Games
          </h1>

          <p className="relative text-sm text-muted-foreground max-w-xl leading-relaxed">
            Practice all{" "}
            <span className="text-foreground font-semibold">{cognitiveGames.length} cognitive games</span>{" "}
            used in <span className="text-foreground font-semibold">Capgemini &amp; Cognizant</span> game-based
            aptitude rounds. Free online, no download. Each game matches the real assessment format.
          </p>

          {/* Quick stats */}
          {/* <div className="relative flex flex-wrap gap-8 mt-8 pt-8 border-t border-border/40">
            {[
              { value: String(cognitiveGames.length), label: "Games" },
              // { value: "Free", label: "Always" },
              { value: "No", label: "Download" },
              { value: "Real", label: "Format" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">{s.value}</span>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>

        {/* Game Cards */}
        <GamesCard />

        {/* FAQ */}
        <section className="border-t border-border/40 pt-12 mt-4">
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

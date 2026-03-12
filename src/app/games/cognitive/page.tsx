import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, gamesConfig } from "@/config/site";
import GamesCard from "@/components/games/GamesCard";
// import GridBackground from "@/components/common/GridBackground";

export const metadata: Metadata = {
  title: "Cognitive Games — Capgemini & Cognizant Aptitude Practice | Blync",
  description:
    "Practice all 6 cognitive games used in Capgemini & Cognizant placement tests online for free. Switch, Digit, Motion, Grid, Inductive & Deductive challenges. No download needed.",
  keywords: [
    "capgemini cognitive games free",
    "cognizant game based aptitude practice",
    "free cognitive games online",
    "placement aptitude practice 2025",
    "switch challenge capgemini",
    "deductive challenge online free",
  ],
  alternates: { canonical: `${siteConfig.url}/games/cognitive` },
  openGraph: {
    title: "Cognitive Games — Free Aptitude Practice | Blync",
    description:
      "Practice Capgemini & Cognizant cognitive aptitude games online for free. 6 games, no signup needed.",
    url: `${siteConfig.url}/games/cognitive`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Cognitive Games — Blync",
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

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
          {/* <GridBackground /> */}
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/games" className="hover:underline">
                Games
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground font-medium">Cognitive</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-bold mb-4">
          Cognitive Games — Free Online Aptitude Practice
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
          Practice all {cognitiveGames.length} cognitive games used in{" "}
          <strong>Capgemini & Cognizant</strong> game-based aptitude rounds. Free online, no
          download. Each game matches the real assessment format.
        </p>

        <GamesCard />

        {/* FAQ */}
        <section className="border-t border-border pt-10">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <dl className="space-y-6">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i}>
                <dt className="font-medium mb-1">{faq.name}</dt>
                <dd className="text-muted-foreground text-sm">{faq.acceptedAnswer.text}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </>
  );
}

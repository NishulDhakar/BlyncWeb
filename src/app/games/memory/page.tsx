import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, gamesConfig } from "@/config/site";

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

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
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
            <li className="text-foreground font-medium">Memory</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-bold mb-4">Memory Games — Free Online Brain Training</h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
          Improve your working memory, recall speed, and short-term retention with{" "}
          {memoryGames.length} free online memory games. No download, no payment — train your brain
          directly in the browser.
        </p>

        {/* Game cards — no nested <a> tags */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
          {memoryGames.map((game) => (
            <li
              key={game.slug}
              className="flex flex-col p-5 rounded-xl border border-border hover:bg-accent transition-colors"
            >
              <h2 className="text-lg font-semibold mb-2">
                <Link href={`/games/memory/${game.slug}`} className="hover:underline">
                  {game.name}
                </Link>
              </h2>
              <p className="text-sm text-muted-foreground flex-1 mb-4">{game.description}</p>
              <div className="mt-auto">
                <Link
                  href={`/play/${game.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Play Free →
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {/* Cross-link to cognitive games */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Also Explore</h2>
          <Link
            href="/games/cognitive"
            className="text-sm text-primary hover:underline"
          >
            Cognitive Games — Capgemini & Cognizant aptitude practice →
          </Link>
        </section>

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

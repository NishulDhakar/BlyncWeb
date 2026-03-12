import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, gamesConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Free Cognitive Games Online — Brain Training & Aptitude Practice",
  description:
    "Play free cognitive games online. Practice memory, deductive reasoning, pattern recognition & number sequences. Perfect for Capgemini & Cognizant placement prep. Free, no download.",
  keywords: [
    "free cognitive games online",
    "memory games online free",
    "brain training games",
    "IQ test online free",
    "placement aptitude games",
    "capgemini game practice",
  ],
  alternates: { canonical: `${siteConfig.url}/games` },
  openGraph: {
    title: "Free Cognitive Games Online | Blync",
    description:
      "Play free cognitive games for Capgemini & Cognizant placement prep. Memory, deductive, pattern games.",
    url: `${siteConfig.url}/games`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Blync — Free Cognitive Games Online",
      },
    ],
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Cognitive Games Online",
  description:
    "Free online cognitive games for Capgemini & Cognizant placement aptitude test practice.",
  url: `${siteConfig.url}/games`,
  numberOfItems: gamesConfig.length,
  itemListElement: gamesConfig.map((game, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: game.name,
    url: `${siteConfig.url}/games/${game.category}/${game.slug}`,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    { "@type": "ListItem", position: 2, name: "Games", item: `${siteConfig.url}/games` },
  ],
};

const categories = [
  {
    slug: "cognitive",
    name: "Cognitive Games",
    href: "/games/cognitive",
    description:
      "Switch, Digit, Motion, Grid, Inductive & Deductive challenges used in Capgemini & Cognizant placement tests.",
    count: gamesConfig.filter((g) => g.category === "cognitive").length,
  },
  {
    slug: "memory",
    name: "Memory Games",
    href: "/games/memory",
    description:
      "Memory and Recall challenges to improve working memory, recall speed, and short-term retention.",
    count: gamesConfig.filter((g) => g.category === "memory").length,
  },
];

export default function GamesHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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
            <li className="text-foreground font-medium">Games</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-bold mb-4">Free Cognitive Games Online</h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
          Practice free online cognitive games for Capgemini, Cognizant & other placement aptitude
          tests. Train memory, logic, pattern recognition and number reasoning — no download, no
          signup required.
        </p>

        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className="block p-6 rounded-xl border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-semibold">{cat.name}</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {cat.count} games
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{cat.description}</p>
              <span className="inline-block mt-4 text-sm font-medium text-primary">
                Browse {cat.name} →
              </span>
            </Link>
          ))}
        </div>

        {/* All games list */}
        <h2 className="text-2xl font-semibold mb-6">All Games</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gamesConfig.map((game) => (
            <li key={game.slug}>
              <Link
                href={`/games/${game.category}/${game.slug}`}
                className="flex flex-col h-full p-4 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <span className="font-semibold">{game.name}</span>
                <p className="text-sm text-muted-foreground mt-1 flex-1 line-clamp-2">
                  {game.description}
                </p>
                <span className="inline-block mt-3 text-xs font-medium text-primary">
                  Play Free →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

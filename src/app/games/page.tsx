import type { Metadata } from "next";
import { siteConfig, gamesConfig } from "@/config/site";
import GamesHubClient from "@/components/games/GamesHubClient";

export const metadata: Metadata = {
  title: "Cognitive Games Hub — Aptitude Practice & Brain Training | Blync Pro",
  description:
    "Master cognitive games online. Practice memory, deductive reasoning, pattern recognition & number sequences. Tailored for Capgemini & Cognizant placement prep with Blync Pro.",
  keywords: [
    "cognitive games online",
    "memory games online",
    "brain training games",
    "IQ test online",
    "placement aptitude games",
    "capgemini game practice",
  ],
  alternates: { canonical: `${siteConfig.url}/games` },
  openGraph: {
    title: "Cognitive Games Hub — Aptitude Practice & Brain Training | Blync Pro",
    description:
      "Master cognitive games for Capgemini & Cognizant placement prep. Memory, deductive, pattern games with Blync Pro.",
    url: `${siteConfig.url}/games`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Blync — Cognitive Games Hub",
      },
    ],
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Blync Cognitive Games Suite",
  description:
    "Online cognitive games for Capgemini & Cognizant placement aptitude test practice with Blync Pro.",
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
      <GamesHubClient />
    </>
  );
}

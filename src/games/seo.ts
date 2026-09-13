import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { GameDefinition } from "./types";
import { getGame, playHref, seoHref } from "./registry";

/**
 * Metadata and structured data derived from the registry.
 *
 * Every game page used to hand-write its own `metadata` object plus an inline
 * JSON-LD blob — around 40 duplicated lines each, and several drifted (three
 * pages had no canonical, two had a stale description). These builders are the
 * only place that shape now lives.
 */

const absolute = (path: string) => `${siteConfig.url}${path}`;

/** Metadata for the indexable landing page at /games/<category>/<slug>. */
export function gameLandingMetadata(slug: string): Metadata {
  const game = getGame(slug);
  if (!game) return {};

  const url = absolute(seoHref(game));

  return {
    // No brand suffix here — the root layout's title template appends
    // "| Blync Cognitive Games" already. Adding it twice pushed titles past
    // 90 characters, well beyond what a SERP shows.
    title: game.seo.headline,
    description: game.seo.description,
    keywords: [...game.seo.keywords],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: game.seo.headline,
      description: game.seo.description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${game.name} — ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: game.seo.headline,
      description: game.seo.description,
      images: [siteConfig.ogImage],
      creator: siteConfig.creator,
    },
  };
}

/**
 * Metadata for the gameplay route. These are `noindex` on purpose — they are
 * auth-gated and thin, and the landing page is the ranking surface. The
 * canonical still points at the landing page so any link equity a /play URL
 * picks up flows to the page we want indexed.
 */
export function gamePlayMetadata(slug: string): Metadata {
  const game = getGame(slug);
  if (!game) return {};

  return {
    title: `Play ${game.name}`,
    description: game.seo.description,
    robots: { index: false, follow: true },
    alternates: { canonical: absolute(seoHref(game)) },
  };
}

// ── Structured data ─────────────────────────────────────────────────────────

const DIFFICULTY_LABEL = {
  easy: "Beginner",
  medium: "Intermediate",
  hard: "Advanced",
} as const;

/** schema.org/Game — the primary entity for a game landing page. */
export function gameSchema(game: GameDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "Game",
    name: game.name,
    description: game.seo.description,
    url: absolute(seoHref(game)),
    genre: ["Educational", "Cognitive", "Aptitude Practice"],
    gamePlatform: "Web Browser",
    playMode: "SinglePlayer",
    numberOfPlayers: { "@type": "QuantitativeValue", value: 1 },
    educationalUse: "Assessment Preparation",
    educationalLevel: DIFFICULTY_LABEL[game.difficulty],
    teaches: [...game.skills],
    timeRequired: `PT${game.duration.replace(/[^0-9-]/g, "").split("-").pop() ?? "5"}M`,
    isAccessibleForFree: !game.pro,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    offers: {
      "@type": "Offer",
      price: game.pro ? "49" : "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };
}

/** schema.org/BreadcrumbList for Home > Games > Category > Game. */
export function breadcrumbSchema(game: GameDefinition) {
  const trail = [
    { name: "Home", item: siteConfig.url },
    { name: "Games", item: absolute("/games") },
    {
      name: game.category.charAt(0).toUpperCase() + game.category.slice(1),
      item: absolute(`/games/${game.category}`),
    },
    { name: game.name, item: absolute(seoHref(game)) },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

/**
 * schema.org/FAQPage. Only emitted when the game actually has FAQ copy on the
 * page — marking up questions that are not visible violates Google's
 * structured data policy and risks a manual action.
 */
export function faqSchema(game: GameDefinition) {
  if (!game.seo.faq?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: game.seo.faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

/** schema.org/HowTo built from the game's rules — earns rich results. */
export function howToSchema(game: GameDefinition, steps: readonly string[]) {
  if (!steps.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to play ${game.name}`,
    description: game.tagline,
    totalTime: `PT${game.duration.replace(/[^0-9-]/g, "").split("-").pop() ?? "5"}M`,
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Step ${i + 1}`,
      text: step,
      url: `${absolute(seoHref(game))}#step-${i + 1}`,
    })),
  };
}

/** Convenience for the play route CTA. */
export function gamePlayUrl(slug: string): string {
  const game = getGame(slug);
  return game ? playHref(game) : `/play/${slug}`;
}

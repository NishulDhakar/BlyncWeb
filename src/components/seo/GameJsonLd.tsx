import { siteConfig } from "@/config/site";

interface GameJsonLdProps {
  name: string;
  description: string;
  url: string;
  category?: string;
  slug?: string;
  /** Pass a breadcrumb trail as [label, href] pairs */
  breadcrumbs?: Array<{ name: string; href: string }>;
}

/**
 * Server component — renders both a Game schema and BreadcrumbList schema
 * as inline <script type="application/ld+json"> tags.
 *
 * Usage:
 *   <GameJsonLd
 *     name="Switch Challenge"
 *     description="..."
 *     url={`${siteConfig.url}/games/cognitive/switch-challenge`}
 *     breadcrumbs={[
 *       { name: "Home", href: siteConfig.url },
 *       { name: "Games", href: `${siteConfig.url}/games` },
 *       { name: "Cognitive", href: `${siteConfig.url}/games/cognitive` },
 *       { name: "Switch Challenge", href: `${siteConfig.url}/games/cognitive/switch-challenge` },
 *     ]}
 *   />
 */
export default function GameJsonLd({
  name,
  description,
  url,
  breadcrumbs,
}: GameJsonLdProps) {
  const gameSchema = {
    "@context": "https://schema.org",
    "@type": "Game",
    name,
    description,
    url,
    genre: ["Educational", "Cognitive", "Brain Training"],
    operatingSystem: "Web Browser",
    applicationCategory: "Game",
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1000",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const breadcrumbSchema = breadcrumbs
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          item: crumb.href,
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  );
}

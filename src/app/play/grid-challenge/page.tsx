import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import GridGame from "./GridGame";

export const metadata: Metadata = {
  title: "Grid Challenge — Capgemini Memory & Symmetry Game | Blync",
  description:
    "Practice Grid Challenge for Capgemini placement tests. Memorize dot positions, solve symmetry puzzles, and recall sequences. Free, no signup required.",
  alternates: {
    canonical: `${siteConfig.url}/play/grid-challenge`,
  },
  openGraph: {
    title: "Grid Challenge | Blync Cognitive Games",
    description:
      "Memory + symmetry game for Capgemini aptitude tests. Blink, decide, recall.",
    url: `${siteConfig.url}/play/grid-challenge`,
    images: [
      {
        url: `${siteConfig.url}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: "Grid Challenge — Blync Cognitive Games",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Grid Challenge",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  url: `${siteConfig.url}/play/grid-challenge`,
  description:
    "Memory and symmetry pattern game for Capgemini game-based aptitude test preparation.",
};

export default function GridChallengePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <GridGame />
    </>
  );
}

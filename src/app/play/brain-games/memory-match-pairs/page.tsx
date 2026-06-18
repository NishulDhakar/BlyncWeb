import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "Memory Match Pairs — Free Online Memory Game | Blync",
  description:
    "Flip cards and find matching pairs. Improve memory, focus, and recall speed. Free online brain game, no download.",
  alternates: { canonical: `${siteConfig.url}/play/brain-games/memory-match-pairs` },
  openGraph: {
    title: "Memory Match Pairs | Blync Brain Games",
    description: "Play Memory Match Pairs free online — classic card matching memory game.",
    url: `${siteConfig.url}/play/brain-games/memory-match-pairs`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Memory Match Pairs — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Memory Match Pairs",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/brain-games/memory-match-pairs`,
  description: "Classic card matching memory game — free online brain training.",
};

export default function MemoryMatchPairsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BrainGamePlayer
        title="Memory Match Pairs"
        iframeUrl="https://lakshyapachkhede.github.io/brain-games/memoryMatchPairs/index.html"
        description="Flip two cards at a time. Remember their positions and find all matching pairs in the fewest moves possible."
      />
    </>
  );
}

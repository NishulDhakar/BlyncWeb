import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "15 Puzzle — Free Online Sliding Tile Game | Blync",
  description:
    "Solve the classic 15 sliding tile puzzle online. Arrange numbered tiles in order. Free brain game, no download.",
  alternates: { canonical: `${siteConfig.url}/play/brain-games/15-puzzle` },
  openGraph: {
    title: "15 Puzzle | Blync Brain Games",
    description: "Play the 15 Puzzle free online — classic sliding tile brain game.",
    url: `${siteConfig.url}/play/brain-games/15-puzzle`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "15 Puzzle — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "15 Puzzle",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/brain-games/15-puzzle`,
  description: "Classic 15 sliding tile puzzle — free online spatial reasoning game.",
};

export default function FifteenPuzzlePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BrainGamePlayer
        title="15 Puzzle"
        iframeUrl="https://lakshyapachkhede.github.io/brain-games/15puzzle/index.html"
        description="Slide the numbered tiles into the empty space to arrange them in order from 1 to 15. Race against the timer!"
      />
    </>
  );
}

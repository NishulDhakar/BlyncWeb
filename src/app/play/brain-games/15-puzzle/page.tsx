import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "15 Puzzle — Online Sliding Tile Challenge | Blync Pro",
  description:
    "Solve the classic 15 sliding tile puzzle online. Arrange numbered tiles in order. Train spatial reasoning with Blync Pro.",
  alternates: { canonical: `${siteConfig.url}/games/brain/15-puzzle` },
  openGraph: {
    title: "15 Puzzle | Blync Pro Brain Games",
    description: "Play the 15 Puzzle online — classic sliding tile brain game with Blync Pro.",
    url: `${siteConfig.url}/games/brain/15-puzzle`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "15 Puzzle — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "15 Puzzle",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "49", priceCurrency: "INR" },
  url: `${siteConfig.url}/games/brain/15-puzzle`,
  description: "Classic 15 sliding tile puzzle — online spatial reasoning game on Blync Pro.",
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

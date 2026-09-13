import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "Minesweeper — Deductive Logic Challenge | Blync Pro",
  description:
    "Play Minesweeper online. Use deductive logic to uncover safe cells and flag mines with Blync Pro.",
  alternates: { canonical: `${siteConfig.url}/games/brain/minesweeper` },
  openGraph: {
    title: "Minesweeper | Blync Pro Brain Games",
    description: "Play Minesweeper online — classic logic deduction game with Blync Pro.",
    url: `${siteConfig.url}/games/brain/minesweeper`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Minesweeper — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Minesweeper",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "49", priceCurrency: "INR" },
  url: `${siteConfig.url}/games/brain/minesweeper`,
  description: "Classic Minesweeper logic game — online brain training with Blync Pro.",
};

export default function MinesweeperPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BrainGamePlayer
        title="Minesweeper"
        iframeUrl="https://lakshyapachkhede.github.io/brain-games/minesweeper/index.html"
        description="Click to uncover cells. Numbers reveal how many mines are adjacent. Flag the mines, clear the board. One wrong click and it's game over!"
      />
    </>
  );
}

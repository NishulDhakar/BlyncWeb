import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "Minesweeper — Free Online Logic Game | Blync",
  description:
    "Play Minesweeper free online. Use deductive logic to uncover safe cells and flag mines. Classic brain game, no download.",
  alternates: { canonical: `${siteConfig.url}/play/brain-games/minesweeper` },
  openGraph: {
    title: "Minesweeper | Blync Brain Games",
    description: "Play Minesweeper free online — classic logic deduction game.",
    url: `${siteConfig.url}/play/brain-games/minesweeper`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Minesweeper — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Minesweeper",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/brain-games/minesweeper`,
  description: "Classic Minesweeper logic game — free online brain training.",
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

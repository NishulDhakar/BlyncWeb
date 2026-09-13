import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "Tic Tac Toe — Strategy & Logic Challenge | Blync Pro",
  description:
    "Play Tic Tac Toe online against the computer. Classic strategy brain game with Blync Pro.",
  alternates: { canonical: `${siteConfig.url}/games/brain/tic-tac-toe` },
  openGraph: {
    title: "Tic Tac Toe | Blync Pro Brain Games",
    description: "Play Tic Tac Toe online — classic strategy game with Blync Pro.",
    url: `${siteConfig.url}/games/brain/tic-tac-toe`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Tic Tac Toe — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tic Tac Toe",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "49", priceCurrency: "INR" },
  url: `${siteConfig.url}/games/brain/tic-tac-toe`,
  description: "Classic Tic Tac Toe strategy game — online brain training with Blync Pro.",
};

export default function TicTacToePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BrainGamePlayer
        title="Tic Tac Toe"
        iframeUrl="https://lakshyapachkhede.github.io/brain-games/tic_tac_toe/index.html"
        description="Take turns placing X's and O's. Get three in a row — horizontally, vertically, or diagonally — to win!"
      />
    </>
  );
}

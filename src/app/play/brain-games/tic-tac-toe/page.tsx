import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "Tic Tac Toe — Free Online Strategy Game | Blync",
  description:
    "Play Tic Tac Toe free online against the computer. Classic strategy brain game. No download needed.",
  alternates: { canonical: `${siteConfig.url}/play/brain-games/tic-tac-toe` },
  openGraph: {
    title: "Tic Tac Toe | Blync Brain Games",
    description: "Play Tic Tac Toe free online — classic strategy game.",
    url: `${siteConfig.url}/play/brain-games/tic-tac-toe`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Tic Tac Toe — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tic Tac Toe",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/brain-games/tic-tac-toe`,
  description: "Classic Tic Tac Toe strategy game — free online brain training.",
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

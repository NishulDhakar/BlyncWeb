import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "Sudoku — Free Online Brain Puzzle | Blync",
  description:
    "Play classic Sudoku puzzles free online. Fill the 9×9 grid using logic and deduction. Free brain game, no download.",
  alternates: { canonical: `${siteConfig.url}/play/brain-games/sudoku` },
  openGraph: {
    title: "Sudoku | Blync Brain Games",
    description: "Play Sudoku free online — classic 9×9 number logic puzzle.",
    url: `${siteConfig.url}/play/brain-games/sudoku`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Sudoku — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sudoku",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/brain-games/sudoku`,
  description: "Classic 9×9 Sudoku number logic puzzle — free online brain training.",
};

export default function SudokuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BrainGamePlayer
        title="Sudoku"
        iframeUrl="https://lakshyapachkhede.github.io/brain-games/sudoku/index.html"
        description="Fill the 9×9 grid so that every row, column, and 3×3 box contains the digits 1–9. Use logic — no guessing needed."
      />
    </>
  );
}

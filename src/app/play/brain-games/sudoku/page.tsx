import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "Sudoku — 9×9 Number Logic Challenge | Blync Pro",
  description:
    "Play classic Sudoku puzzles online. Fill the 9×9 grid using logic and deduction with Blync Pro.",
  alternates: { canonical: `${siteConfig.url}/games/brain/sudoku` },
  openGraph: {
    title: "Sudoku | Blync Pro Brain Games",
    description: "Play Sudoku online — classic 9×9 number logic puzzle with Blync Pro.",
    url: `${siteConfig.url}/games/brain/sudoku`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Sudoku — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sudoku",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "49", priceCurrency: "INR" },
  url: `${siteConfig.url}/games/brain/sudoku`,
  description: "Classic 9×9 Sudoku number logic puzzle — online brain training with Blync Pro.",
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

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "Snake — Reflex & Strategy Challenge | Blync Pro",
  description:
    "Play the classic Snake game online. Navigate the growing snake to eat food while avoiding collisions with Blync Pro.",
  alternates: { canonical: `${siteConfig.url}/games/brain/snake` },
  openGraph: {
    title: "Snake | Blync Pro Brain Games",
    description: "Play Snake online — classic reflex and spatial awareness game with Blync Pro.",
    url: `${siteConfig.url}/games/brain/snake`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Snake — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Snake",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "49", priceCurrency: "INR" },
  url: `${siteConfig.url}/games/brain/snake`,
  description: "Classic Snake game — online reflex and spatial awareness training with Blync Pro.",
};

export default function SnakePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BrainGamePlayer
        title="Snake"
        iframeUrl="https://lakshyapachkhede.github.io/brain-games/snake/index.html"
        description="Use arrow keys to navigate the snake. Eat the food to grow longer. Don't hit the walls or yourself!"
      />
    </>
  );
}

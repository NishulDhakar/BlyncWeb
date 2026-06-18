import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "Snake — Free Online Reflex & Strategy Game | Blync",
  description:
    "Play the classic Snake game free online. Navigate the growing snake to eat food while avoiding collisions. Free brain game.",
  alternates: { canonical: `${siteConfig.url}/play/brain-games/snake` },
  openGraph: {
    title: "Snake | Blync Brain Games",
    description: "Play Snake free online — classic reflex and spatial awareness game.",
    url: `${siteConfig.url}/play/brain-games/snake`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Snake — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Snake",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/brain-games/snake`,
  description: "Classic Snake game — free online reflex and spatial awareness training.",
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

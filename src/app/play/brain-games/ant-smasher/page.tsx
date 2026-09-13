import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "Ant Smasher — Reflex & Coordination Challenge | Blync Pro",
  description:
    "Smash the ants before they escape! Test reflexes and hand-eye coordination with Blync Pro.",
  alternates: { canonical: `${siteConfig.url}/games/brain/ant-smasher` },
  openGraph: {
    title: "Ant Smasher | Blync Pro Brain Games",
    description: "Play Ant Smasher online — fast-paced reflex game with Blync Pro.",
    url: `${siteConfig.url}/games/brain/ant-smasher`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Ant Smasher — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Ant Smasher",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "49", priceCurrency: "INR" },
  url: `${siteConfig.url}/games/brain/ant-smasher`,
  description: "Fast-paced ant smashing reflex game — online brain training with Blync Pro.",
};

export default function AntSmasherPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BrainGamePlayer
        title="Ant Smasher"
        iframeUrl="https://lakshyapachkhede.github.io/brain-games/antSmasher/index.html"
        description="Tap or click the ants as fast as you can before they escape the screen. Watch out — speed increases over time!"
      />
    </>
  );
}

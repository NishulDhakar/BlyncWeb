import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "Ant Smasher — Free Online Reflex Game | Blync",
  description:
    "Smash the ants before they escape! Test reflexes and hand-eye coordination. Free online brain game.",
  alternates: { canonical: `${siteConfig.url}/play/brain-games/ant-smasher` },
  openGraph: {
    title: "Ant Smasher | Blync Brain Games",
    description: "Play Ant Smasher free online — fast-paced reflex game.",
    url: `${siteConfig.url}/play/brain-games/ant-smasher`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Ant Smasher — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Ant Smasher",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/brain-games/ant-smasher`,
  description: "Fast-paced ant smashing reflex game — free online brain training.",
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

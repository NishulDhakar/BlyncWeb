import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "Dice Roller — Free Online Probability Game | Blync",
  description:
    "Roll virtual dice for board games, math practice, or probability experiments. Free online, instant results.",
  alternates: { canonical: `${siteConfig.url}/play/brain-games/dice-roller` },
  openGraph: {
    title: "Dice Roller | Blync Brain Games",
    description: "Roll virtual dice free online — great for board games and math.",
    url: `${siteConfig.url}/play/brain-games/dice-roller`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Dice Roller — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Dice Roller",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/brain-games/dice-roller`,
  description: "Virtual dice roller — free online for board games and probability.",
};

export default function DiceRollerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BrainGamePlayer
        title="Dice Roller"
        iframeUrl="https://lakshyapachkhede.github.io/brain-games/dice/index.html"
        description="Click to roll the dice. Great for board games, math experiments, or just having fun with randomness."
      />
    </>
  );
}

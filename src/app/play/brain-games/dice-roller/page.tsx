import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrainGamePlayer from "@/components/games/BrainGamePlayer";

export const metadata: Metadata = {
  title: "Dice Roller — Probability & Math Challenge | Blync Pro",
  description:
    "Roll virtual dice for board games, math practice, or probability experiments with Blync Pro.",
  alternates: { canonical: `${siteConfig.url}/games/brain/dice-roller` },
  openGraph: {
    title: "Dice Roller | Blync Pro Brain Games",
    description: "Roll virtual dice online — probability challenge with Blync Pro.",
    url: `${siteConfig.url}/games/brain/dice-roller`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Dice Roller — Blync" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Dice Roller",
  operatingSystem: "Web",
  applicationCategory: "GameApplication",
  offers: { "@type": "Offer", price: "49", priceCurrency: "INR" },
  url: `${siteConfig.url}/games/brain/dice-roller`,
  description: "Virtual dice roller — online board game and probability utility on Blync Pro.",
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

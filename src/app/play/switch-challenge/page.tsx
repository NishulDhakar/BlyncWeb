import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import SwitchGame from "./SwitchGame";

export const metadata: Metadata = {
  title: "Switch Challenge — Capgemini Game-Based Aptitude Practice",
  description:
    "Practice Switch Challenge puzzles used in Capgemini placement tests. Master symbol operator permutations with timed, level-scaled sessions. Free.",
  alternates: {
    canonical: `${siteConfig.url}/play/switch-challenge`,
  },
  openGraph: {
    title: "Switch Challenge | Blync Cognitive Games",
    description:
      "Practice Switch Challenge for Capgemini game-based aptitude tests. Symbol permutation puzzles with real exam timing.",
    url: `${siteConfig.url}/play/switch-challenge`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Switch Challenge — Blync Cognitive Games",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Switch Challenge",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/switch-challenge`,
  description:
    "Symbol operator permutation practice for Capgemini placement tests.",
};

export default function SwitchChallengePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <SwitchGame />
    </>
  );
}
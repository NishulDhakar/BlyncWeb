import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import MotionGame from "./MotionGame";
import ProGate from "@/components/subscription/ProGate";

export const metadata: Metadata = {
  title: "Motion Challenge — Pattern Movement Aptitude Practice",
  description:
    "Practice Motion Challenge used in Capgemini game-based aptitude rounds. Identify movement patterns across 4-minute sessions with level-based difficulty scaling. Free.",
  alternates: {
    canonical: `${siteConfig.url}/play/motion-challenge`,
  },
  openGraph: {
    title: "Motion Challenge | Blync Cognitive Games",
    description:
      "Practice Motion Challenge for Capgemini placement tests. Pattern movement puzzles with 4-minute timed sessions.",
    url: `${siteConfig.url}/play/motion-challenge`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Motion Challenge — Blync Cognitive Games",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Motion Challenge",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/motion-challenge`,
  description:
    "Movement pattern recognition practice for Capgemini placement tests.",
};

export default function MotionChallengePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProGate gameSlug="motion-challenge"><MotionGame /></ProGate>
    </>
  );
}

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import DeductiveGame from "./DeductiveGame";

export const metadata: Metadata = {
  title: "Deductive Challenge — Logical Reasoning Aptitude Practice",
  description:
    "Master Deductive Challenge used in Capgemini assessments. Solve symbol-based logic puzzles with 20-second timers and difficulty scaling. Free placement prep for 2025.",
  alternates: {
    canonical: `${siteConfig.url}/play/deductive-challenge`,
  },
  openGraph: {
    title: "Deductive Challenge | Blync Cognitive Games",
    description:
      "Practice Deductive Challenge for Capgemini placement tests. Symbol logic puzzles with 20-second timers.",
    url: `${siteConfig.url}/play/deductive-challenge`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Deductive Challenge — Blync Cognitive Games",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Deductive Challenge",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/deductive-challenge`,
  description:
    "Symbol-based logical reasoning practice for Capgemini placement tests.",
};

export default function DeductiveChallengePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <DeductiveGame />
    </>
  );
}

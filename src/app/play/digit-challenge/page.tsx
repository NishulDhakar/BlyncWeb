import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getCachedSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserIsPro } from "@/lib/subscription";
import DigitGame from "./DigitGame";

export const metadata: Metadata = {
  title: "Digit Challenge — Number Sequence Aptitude Practice",
  description:
    "Solve Digit Challenge number sequence puzzles from Capgemini & Cognizant game-based aptitude tests. Fill missing digits under time pressure. 3 lives, unlimited levels. Free.",
  alternates: {
    canonical: `${siteConfig.url}/play/digit-challenge`,
  },
  openGraph: {
    title: "Digit Challenge | Blync Cognitive Games",
    description:
      "Practice Digit Challenge for Capgemini & Cognizant placement tests. Number sequence puzzles with 30-second timers and live scoring.",
    url: `${siteConfig.url}/play/digit-challenge`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Digit Challenge — Blync Cognitive Games",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Digit Challenge",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/digit-challenge`,
  description:
    "Number sequence puzzle practice for Capgemini and Cognizant placement tests.",
};

export default async function DigitChallengePage() {
  const session = await getCachedSession();

  if (!session) redirect("/register?redirect=/play/digit-challenge");

  const isPro = await getUserIsPro(session.user.id);
  if (!isPro) redirect("/pricing?from=digit-challenge");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <DigitGame />
    </>
  );
}

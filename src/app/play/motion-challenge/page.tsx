import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getCachedSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserIsPro } from "@/lib/subscription";
import MotionGame from "./MotionGame";

export const metadata: Metadata = {
  title: "Motion Challenge — Pattern Movement Aptitude Practice",
  description:
    "Practice Motion Challenge used in Capgemini game-based aptitude rounds. Identify movement patterns across 4-minute sessions with level-based difficulty scaling.",
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

export default async function MotionChallengePage() {
  const session = await getCachedSession();

  if (!session) redirect("/register?redirect=/play/motion-challenge");

  const isPro = await getUserIsPro(session.user.id);
  if (!isPro) redirect("/pricing?from=motion-challenge");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <MotionGame />
    </>
  );
}

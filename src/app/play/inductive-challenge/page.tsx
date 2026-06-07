import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserIsPro } from "@/lib/subscription";
import InductiveGame from "./InductiveGame";

export const metadata: Metadata = {
  title: "Inductive Challenge | Visual Pattern Reasoning | Blync Cognitive Games",
  description:
    "Practice inductive reasoning for Capgemini & Cognizant placement tests. Find which figures follow the same rule — pattern recognition under time pressure.",
  alternates: {
    canonical: `${siteConfig.url}/play/inductive-challenge`,
  },
  openGraph: {
    title: "Inductive Challenge | Blync Cognitive Games",
    description:
      "Visual reasoning game for Capgemini placement prep. Find pairs of figures that follow the same pattern rule.",
    url: `${siteConfig.url}/play/inductive-challenge`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Inductive Challenge — Blync Cognitive Games",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Inductive Challenge",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/inductive-challenge`,
  description:
    "Visual inductive reasoning game for Capgemini and Cognizant placement test practice.",
};

export default async function InductiveChallengePage() {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    if (error instanceof Error && ((error as any).digest === "DYNAMIC_SERVER_USAGE" || error.message?.includes("Dynamic server usage"))) {
      throw error;
    }
    console.error("[InductiveChallengePage] Session fetch failed:", error);
  }

  if (!session) redirect("/register?redirect=/play/inductive-challenge");

  const isPro = await getUserIsPro(session.user.id);
  if (!isPro) redirect("/pricing?from=inductive-challenge");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <InductiveGame />
    </>
  );
}

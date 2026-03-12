import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grid Challenge — Coming Soon | Blync Cognitive Games",
  description:
    "Grid Challenge practice for Capgemini game-based aptitude tests is coming soon. Practice Switch, Digit, and Deductive Challenges in the meantime.",
  alternates: {
    canonical: `${siteConfig.url}/play/grid-challenge`,
  },
  openGraph: {
    title: "Grid Challenge — Coming Soon | Blync",
    description:
      "Grid Challenge is coming soon. Practice other Capgemini placement games now.",
    url: `${siteConfig.url}/play/grid-challenge`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Grid Challenge — Blync Cognitive Games",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Grid Challenge",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${siteConfig.url}/play/grid-challenge`,
  description: "Grid pattern logic practice for Capgemini placement tests.",
};

export default function GridChallengePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="flex mt-60 flex-col items-center justify-center px-4 text-center font-game">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          More Games Coming Soon!
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8">
          We have added only 3 games so far:
        </p>
        <ul className="text-sm sm:text-2xl md:text-3xl space-y-2 mb-12">
          <li>Switch Challenge</li>
          <li>Deductive Challenge</li>
          <li>Digit Challenge</li>
        </ul>
        <p className="text-lg sm:text-xl md:text-2xl">
          Stay tuned for more exciting challenges! {">.<"}
        </p>
        <div className="mt-12">
          <Link
            href="/games/cognitive"
            className="rounded-xl border border-black font-semibold transition-all duration-200 hover:bg-zinc-100 hover:text-black hover:shadow-md p-4"
          >
            Go Back to Games
          </Link>
        </div>
      </div>
    </>
  );
}

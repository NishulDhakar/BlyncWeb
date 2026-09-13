import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Metadata carrier for /iq-tests.
 *
 * The page itself is a client component and so cannot export `metadata`.
 * Without this layout the page inherited the root layout's metadata wholesale —
 * the homepage title, the homepage description, and a canonical pointing at
 * "/". That last one told Google this URL was a duplicate of the homepage,
 * which keeps it out of the index entirely.
 */
export const metadata: Metadata = {
  title: "Online IQ Assessment & Cognitive Breakdown | Blync Pro",
  description:
    "Take an in-depth IQ-style test measuring logical reasoning, pattern recognition and spatial ability. Timed rounds, instant scoring, and percentile metrics with Blync Pro.",
  keywords: ["iq test online", "iq test with results", "logical reasoning test online", "pattern recognition iq test", "cognitive test"],
  alternates: { canonical: `${siteConfig.url}/iq-tests` },
  openGraph: {
    title: "Online IQ Assessment & Cognitive Breakdown | Blync Pro",
    description:
      "Take an in-depth IQ-style test measuring logical reasoning, pattern recognition and spatial ability. Timed rounds, instant scoring, and percentile metrics with Blync Pro.",
    url: `${siteConfig.url}/iq-tests`,
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Online IQ Assessment & Cognitive Breakdown — Blync Pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online IQ Assessment & Cognitive Breakdown | Blync Pro",
    description:
      "Take an in-depth IQ-style test measuring logical reasoning, pattern recognition and spatial ability. Timed rounds, instant scoring, and percentile metrics with Blync Pro.",
    images: [siteConfig.ogImage],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

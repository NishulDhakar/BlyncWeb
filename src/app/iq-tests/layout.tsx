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
  title: "Free Online IQ Test — Measure Reasoning & Pattern Skills",
  description:
    "Take a free online IQ-style test measuring logical reasoning, pattern recognition and spatial ability. Instant scoring, no signup, no download.",
  keywords: ["iq test online free", "free iq test with results", "logical reasoning test online", "pattern recognition iq test"],
  alternates: { canonical: `${siteConfig.url}/iq-tests` },
  openGraph: {
    title: "Free Online IQ Test — Measure Reasoning & Pattern Skills | Blync",
    description:
      "Take a free online IQ-style test measuring logical reasoning, pattern recognition and spatial ability. Instant scoring, no signup, no download.",
    url: `${siteConfig.url}/iq-tests`,
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Free Online IQ Test — Measure Reasoning & Pattern Skills — Blync",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online IQ Test — Measure Reasoning & Pattern Skills | Blync",
    description:
      "Take a free online IQ-style test measuring logical reasoning, pattern recognition and spatial ability. Instant scoring, no signup, no download.",
    images: [siteConfig.ogImage],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

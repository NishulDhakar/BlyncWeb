import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Metadata carrier for /about.
 *
 * The page itself is a client component and so cannot export `metadata`.
 * Without this layout the page inherited the root layout's metadata wholesale —
 * the homepage title, the homepage description, and a canonical pointing at
 * "/". That last one told Google this URL was a duplicate of the homepage,
 * which keeps it out of the index entirely.
 */
export const metadata: Metadata = {
  title: "About Blync — Free Game-Based Aptitude Practice for Placements",
  description:
    "Blync is a free platform for practising the game-based cognitive aptitude rounds used by Capgemini, Cognizant and Accenture. Learn who builds it and why it stays free.",
  keywords: ["about blync", "cognitive games platform", "free aptitude practice platform", "game based aptitude test website"],
  alternates: { canonical: `${siteConfig.url}/about` },
  openGraph: {
    title: "About Blync — Free Game-Based Aptitude Practice for Placements | Blync",
    description:
      "Blync is a free platform for practising the game-based cognitive aptitude rounds used by Capgemini, Cognizant and Accenture. Learn who builds it and why it stays free.",
    url: `${siteConfig.url}/about`,
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "About Blync — Free Game-Based Aptitude Practice for Placements — Blync",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Blync — Free Game-Based Aptitude Practice for Placements | Blync",
    description:
      "Blync is a free platform for practising the game-based cognitive aptitude rounds used by Capgemini, Cognizant and Accenture. Learn who builds it and why it stays free.",
    images: [siteConfig.ogImage],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

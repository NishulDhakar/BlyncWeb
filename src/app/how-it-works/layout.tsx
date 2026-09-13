import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Metadata carrier for /how-it-works.
 *
 * The page itself is a client component and so cannot export `metadata`.
 * Without this layout the page inherited the root layout's metadata wholesale —
 * the homepage title, the homepage description, and a canonical pointing at
 * "/". That last one told Google this URL was a duplicate of the homepage,
 * which keeps it out of the index entirely.
 */
export const metadata: Metadata = {
  title: "How Blync Works — Practising Game-Based Aptitude Rounds",
  description:
    "How to use Blync for placement prep: pick a company round, play under real exam timing, read the score breakdown, and track progress on the leaderboard.",
  keywords: ["how game based aptitude tests work", "capgemini game round explained", "how to prepare for aptitude games", "cognitive assessment practice guide"],
  alternates: { canonical: `${siteConfig.url}/how-it-works` },
  openGraph: {
    title: "How Blync Works — Practising Game-Based Aptitude Rounds | Blync",
    description:
      "How to use Blync for placement prep: pick a company round, play under real exam timing, read the score breakdown, and track progress on the leaderboard.",
    url: `${siteConfig.url}/how-it-works`,
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "How Blync Works — Practising Game-Based Aptitude Rounds — Blync",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Blync Works — Practising Game-Based Aptitude Rounds | Blync",
    description:
      "How to use Blync for placement prep: pick a company round, play under real exam timing, read the score breakdown, and track progress on the leaderboard.",
    images: [siteConfig.ogImage],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

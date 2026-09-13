import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Metadata carrier for /feedback.
 *
 * The page itself is a client component and so cannot export `metadata`.
 * Without this layout the page inherited the root layout's metadata wholesale —
 * the homepage title, the homepage description, and a canonical pointing at
 * "/". That last one told Google this URL was a duplicate of the homepage,
 * which keeps it out of the index entirely.
 */
export const metadata: Metadata = {
  title: "Send Feedback — Help Shape Blync's Aptitude Games",
  description:
    "Tell us which placement rounds to add next, what felt off in a game, or what would make Blync more useful for your interview prep.",
  keywords: ["blync feedback", "suggest a game", "aptitude practice feedback"],
  alternates: { canonical: `${siteConfig.url}/feedback` },
  openGraph: {
    title: "Send Feedback — Help Shape Blync's Aptitude Games | Blync",
    description:
      "Tell us which placement rounds to add next, what felt off in a game, or what would make Blync more useful for your interview prep.",
    url: `${siteConfig.url}/feedback`,
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Send Feedback — Help Shape Blync's Aptitude Games — Blync",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Send Feedback — Help Shape Blync's Aptitude Games | Blync",
    description:
      "Tell us which placement rounds to add next, what felt off in a game, or what would make Blync more useful for your interview prep.",
    images: [siteConfig.ogImage],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

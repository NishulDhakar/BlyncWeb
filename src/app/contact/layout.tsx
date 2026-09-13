import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Metadata carrier for /contact.
 *
 * The page itself is a client component and so cannot export `metadata`.
 * Without this layout the page inherited the root layout's metadata wholesale —
 * the homepage title, the homepage description, and a canonical pointing at
 * "/". That last one told Google this URL was a duplicate of the homepage,
 * which keeps it out of the index entirely.
 */
export const metadata: Metadata = {
  title: "Contact Blync — Support for Aptitude Game Practice",
  description:
    "Get help with Blync cognitive games, report a bug, ask about a specific placement round, or suggest a new game. We reply to every message.",
  keywords: ["contact blync", "cognitive games support", "aptitude practice help"],
  alternates: { canonical: `${siteConfig.url}/contact` },
  openGraph: {
    title: "Contact Blync — Support for Aptitude Game Practice | Blync",
    description:
      "Get help with Blync cognitive games, report a bug, ask about a specific placement round, or suggest a new game. We reply to every message.",
    url: `${siteConfig.url}/contact`,
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Contact Blync — Support for Aptitude Game Practice — Blync",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Blync — Support for Aptitude Game Practice | Blync",
    description:
      "Get help with Blync cognitive games, report a bug, ask about a specific placement round, or suggest a new game. We reply to every message.",
    images: [siteConfig.ogImage],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

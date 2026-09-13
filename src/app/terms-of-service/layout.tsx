import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Metadata carrier for /terms-of-service.
 *
 * The page itself is a client component and so cannot export `metadata`.
 * Without this layout the page inherited the root layout's metadata wholesale —
 * the homepage title, the homepage description, and a canonical pointing at
 * "/". That last one told Google this URL was a duplicate of the homepage,
 * which keeps it out of the index entirely.
 */
export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing use of Blync cognitive games, accounts, subscriptions and content.",
  keywords: ["blync terms of service"],
  alternates: { canonical: `${siteConfig.url}/terms-of-service` },
  // Legal boilerplate — useful to users, not a search target.
  robots: { index: false, follow: true },
  openGraph: {
    title: "Terms of Service | Blync",
    description:
      "The terms governing use of Blync cognitive games, accounts, subscriptions and content.",
    url: `${siteConfig.url}/terms-of-service`,
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Terms of Service — Blync",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Blync",
    description:
      "The terms governing use of Blync cognitive games, accounts, subscriptions and content.",
    images: [siteConfig.ogImage],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

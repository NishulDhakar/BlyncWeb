import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Metadata carrier for /privacy-policy.
 *
 * The page itself is a client component and so cannot export `metadata`.
 * Without this layout the page inherited the root layout's metadata wholesale —
 * the homepage title, the homepage description, and a canonical pointing at
 * "/". That last one told Google this URL was a duplicate of the homepage,
 * which keeps it out of the index entirely.
 */
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Blync collects, uses and stores your data, what third-party services are involved, and how to request deletion of your account and scores.",
  keywords: ["blync privacy policy"],
  alternates: { canonical: `${siteConfig.url}/privacy-policy` },
  // Legal boilerplate — useful to users, not a search target.
  robots: { index: false, follow: true },
  openGraph: {
    title: "Privacy Policy | Blync",
    description:
      "How Blync collects, uses and stores your data, what third-party services are involved, and how to request deletion of your account and scores.",
    url: `${siteConfig.url}/privacy-policy`,
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Privacy Policy — Blync",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Blync",
    description:
      "How Blync collects, uses and stores your data, what third-party services are involved, and how to request deletion of your account and scores.",
    images: [siteConfig.ogImage],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

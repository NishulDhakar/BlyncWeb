import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import CapgeminiClient from "./CapgeminiClient";

export const metadata: Metadata = {
  title: "Capgemini Game Based Aptitude Test 2026 — Free Practice | Blync",
  description:
    "Complete guide to Capgemini's game-based aptitude test. Practice all 6 cognitive games free — Switch, Grid, Digit, Motion, Inductive & Deductive. 5,000+ students prepared. No signup required.",
  keywords: [
    "capgemini game based aptitude test",
    "capgemini game based aptitude",
    "capgemini cognitive ability games",
    "capgemini games",
    "capgemini gaming round",
    "game based aptitude test capgemini",
    "capgemini game based aptitude test 2026",
    "capgemini cognitive games free"
  ],
  alternates: {
    canonical: `${siteConfig.url}/capgemini`,
  },
  openGraph: {
    title: "Capgemini Game Based Aptitude Test 2026 — Free Practice | Blync",
    description:
      "Practice all 6 Capgemini cognitive games free. Complete guide with tips, strategies & unlimited attempts.",
    url: `${siteConfig.url}/capgemini`,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: "Capgemini Game Based Aptitude Test Practice — Blync",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capgemini Game Based Aptitude Test 2026 — Free Practice",
    description: "Practice all 6 Capgemini cognitive games free. No signup required.",
    images: [`${siteConfig.url}/og-logo.png`],
  },
};

export default function CapgeminiPage() {
  return <CapgeminiClient />;
}

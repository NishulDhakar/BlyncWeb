import type { Metadata } from "next";
import About from "@/components/Landing/About";
import FAQ, { faqData } from "@/components/Landing/FAQ";
import Hero from "@/components/Landing/Hero";
import WhyUs from "@/components/Landing/WhyUs";
import LogoMarquee from "@/components/Landing/LogoMarquee";
import HowItWorks from "@/components/Landing/Howitwork";
import NumbersSpeak from "@/components/Landing/NumbersSpeak";
import Testimonial from "@/components/Landing/Testimonial";
import GamesSection from "@/components/Landing/GamesSection";
import CtaBanner from "@/components/Landing/CtaBanner";
import { siteConfig } from "@/config/site";
import Script from "next/script";

// Generate FAQPage schema for AI search engine citation
const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqData.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};

export const metadata: Metadata = {
  title: "Capgemini Cognitive Games Practice 2026 | Blync",
  description:
    "Master all 6 Capgemini cognitive games. Switch, Grid, Digit, Motion, Inductive & Deductive challenge drills. Trusted by 6,400+ candidates for 2026 placement prep.",
  keywords: [
    "capgemini cognitive games",
    "capgemini game based aptitude",
    "capgemini cognitive ability games",
    "game based aptitude test",
    "aptitude games",
    "cognitive ability test practice",
    "switch challenge practice",
    "digit challenge practice",
    "grid challenge practice",
    "motion challenge practice",
    "capgemini placement 2026",
    "game based aptitude test practice"
  ],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "Capgemini Cognitive Games Practice 2026 | Blync",
    description: "6,400+ candidates practicing. All 6 Capgemini games and cognitive assessment drills. Start now.",
    url: siteConfig.url,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: "Blync – Capgemini Cognitive Games Practice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capgemini Cognitive Games Practice 2026 | Blync",
    description: "Master all 6 Capgemini cognitive games. Comprehensive placement assessment drills for 2026.",
    images: [`${siteConfig.url}/og-logo.png`],
  },
};

export default function Home() {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <div>
        <Hero />
        <WhyUs />
        <LogoMarquee />
        <About />
        <NumbersSpeak />
        {/* <GamesSection /> */}
        <HowItWorks />
        <Testimonial />
        <FAQ />
        <CtaBanner />
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Container from "@/components/common/Container";
import About from "@/components/Landing/About";
import FAQ from "@/components/Landing/FAQ";
import Hero from "@/components/Landing/Hero";
import HowItWorks from "@/components/Landing/Howitwork";
import Testimonial from "@/components/Landing/Testimonial";
import { siteConfig } from "@/config/site";
import Script from "next/script";

// FAQ Data for schema
const faqData = [
  {
    question: "What are Capgemini Cognitive Ability Games?",
    answer:
      "These are game-based assessments used by Capgemini during placements to test logical reasoning, problem-solving, memory, and pattern recognition skills."
  },
  {
    question: "Can I practice the exact same games here?",
    answer:
      "We provide practice challenges inspired by the real Capgemini Cognitive Ability Games. While not identical, they are designed to mimic the logic, difficulty, and format closely."
  },
  {
    question: "Do I need to create an account to practice?",
    answer:
      "No account is required to try out basic games. However, creating a free account allows you to track your progress and revisit your practice history."
  },
  {
    question: "How should I prepare for the actual Capgemini assessment?",
    answer:
      "Regularly practice puzzles, focus on improving speed and accuracy, and review different challenge types such as Switch, Grid, Inductive, and Deductive Challenges."
  },
  {
    question: "Is this platform free to use?",
    answer:
      "Yes! All core Capgemini practice games are free to access. We aim to help students prepare effectively without barriers."
  },
  {
    question: "Will practicing here really improve my chances?",
    answer:
      "Yes. Consistent practice builds confidence, improves reaction time, and strengthens your logical problem-solving skills — all of which are essential for clearing Capgemini's games."
  },
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Blync Cognitive Games",
  url: siteConfig.url,
  logo: `${siteConfig.url}/og-logo.png`,
  description: "Free game-based aptitude practice platform for Capgemini & Cognizant placements",
  sameAs: [siteConfig.links.twitter, siteConfig.links.github],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "5000",
    bestRating: "5",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
  },
};

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
  title: "Free Capgemini Cognitive Games Practice 2026 | Blync",
  description:
    "Master all 6 Capgemini cognitive games free. Switch, Grid, Digit, Motion, Inductive & Deductive challenges — no signup required. Trusted by 5,000+ students for 2026 placement prep.",
  keywords: [
    "capgemini cognitive games",
    "capgemini game based aptitude",
    "capgemini cognitive ability games",
    "game based aptitude test",
    "aptitude games",
    "cognitive ability test free",
    "switch challenge practice",
    "digit challenge practice",
    "grid challenge practice",
    "motion challenge practice",
    "capgemini placement 2026",
    "game based aptitude test free practice"
  ],
  alternates: {
    canonical: `${siteConfig.url}/`,
  },
  openGraph: {
    title: "Free Capgemini Cognitive Games Practice 2026 | Blync",
    description: "5,000+ students practicing. All 6 Capgemini games free. No signup required. Start now.",
    url: `${siteConfig.url}/`,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: "Blync – Free Capgemini Cognitive Games Practice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Capgemini Cognitive Games Practice 2026 | Blync",
    description: "Master all 6 Capgemini cognitive games free. No signup. 5,000+ students preparing.",
    images: [`${siteConfig.url}/og-logo.png`],
  },
};

export default function Home() {
  return (
    <>
      <Script
        id="org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <div>
        <Hero />
        <About />
        <HowItWorks />
        <Testimonial />
        <FAQ />
      </div>
    </>
  );
}

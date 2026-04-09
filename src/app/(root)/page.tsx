import type { Metadata } from "next";
import Container from "@/components/common/Container";
import About from "@/components/Landing/About";
import FAQ from "@/components/Landing/FAQ";
import Hero from "@/components/Landing/Hero";
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
  title: "Capgemini & Cognizant Game-Based Aptitude Practice",
  description:
    "Master Capgemini and Cognizant cognitive ability games. Free practice for Switch, Digit, Grid, Motion, and other game-based assessments with expert strategies and solutions.",
  keywords: [
    "Capgemini cognitive games",
    "Cognizant placement games",
    "game-based aptitude test",
    "switch challenge practice",
    "grid challenge",
    "pattern recognition",
    "cognitive ability test",
    "placement preparation"
  ],
  alternates: {
    canonical: `${siteConfig.url}/`,
  },
  openGraph: {
    title: "Master Capgemini & Cognizant Cognitive Games | Blync",
    description: "Free game-based aptitude practice for campus placements. Master Switch, Grid, Digit, Motion & more.",
    url: `${siteConfig.url}/`,
    type: "website",
  }
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
        <About />
        <Testimonial />
        <FAQ />
      </div>
    </>
  );
}

import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import CognizantGamesClient from "./client";

export const metadata: Metadata = {
    title: "Cognizant GenC Game Based Aptitude Test 2026 | Pattern & Puzzle Practice",
    description:
        "Prepare for the Cognizant GenC Elevate game based round. Practice the exact puzzle, spatial, deductive logic, and memory challenges used in 2026 placements. Free, no signup.",
    keywords: [
        "cognizant game based aptitude test",
        "cognizant genc elevate game round",
        "cognizant puzzle round",
        "cognizant cognitive ability test",
        "cognizant placement 2026",
        "cognizant aptitude games",
        "game based aptitude test cognizant",
        "cognizant genc game round practice",
        "cognizant deductive logic game",
        "cognizant grid challenge"
    ],
    alternates: {
        canonical: `${siteConfig.url}/cognizant-games`,
    },
    openGraph: {
        title: "Cognizant GenC Game Based Aptitude Test 2026 | Blync",
        description: "Practice Cognizant GenC Elevate game round — deductive logic, grid puzzles, spatial reasoning. Free, no signup. 2026 placement prep.",
        url: `${siteConfig.url}/cognizant-games`,
        type: "website",
        images: [
            {
                url: `${siteConfig.url}/og-logo.png`,
                width: 1200,
                height: 630,
                alt: "Cognizant GenC Game Based Aptitude Practice — Blync",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Cognizant GenC Game Based Aptitude Test 2026 | Blync",
        description: "Practice Cognizant game round free. Deductive, grid, and spatial challenges for 2026 placements.",
        images: [`${siteConfig.url}/og-logo.png`],
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What games are asked in the Cognizant GenC Elevate assessment?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "The Cognizant game round typically includes deductive logic puzzles, grid challenges, spatial reasoning, and memory-based games similar to those provided by Aon/cut-e.",
            },
        },
        {
            "@type": "Question",
            name: "Is the Cognizant puzzle round an elimination stage?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, the cognitive game-based aptitude test is a crucial filtering stage. High accuracy and speed are required to progress to the technical interview rounds.",
            },
        },
        {
            "@type": "Question",
            name: "How can I prepare for the Cognizant game-based aptitude test?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "The best way is to practice actual placement-style games simulating exactly how the UI behaves. You can practice our deductive, inductive, and grid challenges to build your pattern recognition speed.",
            },
        },
    ],
};

const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Blync Cognizant GenC Prep",
    operatingSystem: "Web",
    applicationCategory: "EducationalApplication",
    aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.8,
        reviewCount: 921,
    },
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
    },
};

export default function CognizantGamesPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
            />
            <CognizantGamesClient />
        </>
    );
}

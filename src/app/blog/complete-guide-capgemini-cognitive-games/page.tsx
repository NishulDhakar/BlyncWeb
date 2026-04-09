import type { Metadata } from "next";
import Script from "next/script";
import { siteConfig } from "@/config/site";
import CapgeminiGuidePageContent from "./content";

export const metadata: Metadata = {
    title: "Complete Guide to Capgemini Cognitive Ability Games",
    description:
        "Everything you need to know about Capgemini's game-based aptitude tests, including detailed breakdowns of each game type, scoring strategies, and preparation tips.",
    keywords: [
        "Capgemini cognitive games",
        "game-based aptitude test",
        "placement preparation",
        "switch challenge guide",
        "grid challenge tips",
        "Capgemini placement games guide"
    ],
    alternates: {
        canonical: `${siteConfig.url}/blog/complete-guide-capgemini-cognitive-games`,
    },
    openGraph: {
        title: "Complete Guide to Capgemini Cognitive Ability Games",
        description: "Master Capgemini cognitive games with strategies, tips, and preparation plan.",
        url: `${siteConfig.url}/blog/complete-guide-capgemini-cognitive-games`,
        type: "article",
        authors: ["Blync"],
        publishedTime: new Date("2026-02-04").toISOString(),
    }
};

const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Complete Guide to Capgemini Cognitive Ability Games",
    description: "Everything you need to know about Capgemini's game-based aptitude tests, including detailed breakdowns of each game type, scoring strategies, and preparation tips.",
    datePublished: "2026-02-04",
    dateModified: new Date().toISOString().split('T')[0],
    author: {
        "@type": "Organization",
        name: "Blync",
        url: siteConfig.url
    },
    publisher: {
        "@type": "Organization",
        name: "Blync",
        logo: {
            "@type": "ImageObject",
            url: `${siteConfig.url}/logo.png`
        }
    },
    mainEntity: {
        "@type": "Article",
        image: siteConfig.ogImage,
        keywords: "Capgemini cognitive games, game-based aptitude test, placement preparation"
    }
};

export default function CapgeminiGuidePage() {
    return (
        <>
            <Script
                id="article-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <CapgeminiGuidePageContent />
        </>
    );
}

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
        modifiedTime: new Date().toISOString(),
        images: [
            {
                url: `${siteConfig.url}/og-logo.png`,
                width: 1200,
                height: 630,
                alt: "Complete Guide to Capgemini Cognitive Ability Games — Blync",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Complete Guide to Capgemini Cognitive Ability Games | Blync",
        description: "Everything about Capgemini's game-based aptitude tests — strategies, game breakdowns, and 2026 prep plan.",
        images: [`${siteConfig.url}/og-logo.png`],
    },
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
    image: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/og-logo.png`,
        width: 1200,
        height: 630,
    },
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/blog/complete-guide-capgemini-cognitive-games`,
    },
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
        { "@type": "ListItem", position: 3, name: "Complete Guide to Capgemini Cognitive Games", item: `${siteConfig.url}/blog/complete-guide-capgemini-cognitive-games` },
    ],
};

export default function CapgeminiGuidePage() {
    return (
        <>
            <Script
                id="article-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <Script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <CapgeminiGuidePageContent />
        </>
    );
}

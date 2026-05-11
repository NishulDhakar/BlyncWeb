import type { Metadata } from "next";
import Script from "next/script";
import { siteConfig } from "@/config/site";
import PatternRecognitionPageContent from "./content";

export const metadata: Metadata = {
    title: "10 Strategies to Master Pattern Recognition in Cognitive Tests",
    description:
        "Learn proven techniques to identify patterns faster and more accurately in cognitive ability tests. These strategies will boost your scores and transform your pattern recognition skills.",
    keywords: [
        "pattern recognition strategies",
        "cognitive test preparation",
        "aptitude test tips",
        "pattern recognition techniques",
        "cognitive games strategy"
    ],
    alternates: {
        canonical: `${siteConfig.url}/blog/master-pattern-recognition`,
    },
    openGraph: {
        title: "10 Strategies to Master Pattern Recognition in Cognitive Tests",
        description: "Proven techniques from top performers to master pattern recognition.",
        url: `${siteConfig.url}/blog/master-pattern-recognition`,
        type: "article",
        authors: ["Blync"],
        publishedTime: new Date("2026-02-03").toISOString(),
        modifiedTime: new Date().toISOString(),
        images: [
            {
                url: `${siteConfig.url}/og-logo.png`,
                width: 1200,
                height: 630,
                alt: "10 Strategies to Master Pattern Recognition — Blync",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "10 Strategies to Master Pattern Recognition in Cognitive Tests | Blync",
        description: "Proven techniques to boost pattern recognition speed and accuracy in Capgemini & Cognizant aptitude tests.",
        images: [`${siteConfig.url}/og-logo.png`],
    },
};

const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "10 Strategies to Master Pattern Recognition in Cognitive Tests",
    description: "Learn proven techniques to identify patterns faster and more accurately in cognitive ability tests.",
    datePublished: "2026-02-03",
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
        "@id": `${siteConfig.url}/blog/master-pattern-recognition`,
    },
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
        { "@type": "ListItem", position: 3, name: "10 Strategies to Master Pattern Recognition", item: `${siteConfig.url}/blog/master-pattern-recognition` },
    ],
};

export default function PatternRecognitionPage() {
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
            <PatternRecognitionPageContent />
        </>
    );
}

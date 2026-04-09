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
    }
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
    }
};

export default function PatternRecognitionPage() {
    return (
        <>
            <Script
                id="article-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <PatternRecognitionPageContent />
        </>
    );
}

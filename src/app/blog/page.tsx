import type { Metadata } from "next";
import Script from "next/script";
import { siteConfig } from "@/config/site";
import BlogPageContent from "./content";

// Breadcrumb schema for better AI search visibility
const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url
        },
        {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${siteConfig.url}/blog`
        }
    ]
};

// Blog collection schema
const blogCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Cognitive Games Blog",
    description: "Expert insights, strategies, and success stories about cognitive ability games and placement preparation.",
    url: `${siteConfig.url}/blog`,
    blogPosts: [
        {
            "@type": "BlogPosting",
            headline: "Complete Guide to Capgemini Cognitive Ability Games",
            description: "Everything you need to know about Capgemini's game-based aptitude tests.",
            datePublished: new Date("2026-02-04").toISOString(),
            url: `${siteConfig.url}/blog/complete-guide-capgemini-cognitive-games`,
            timeToRead: "12 min read",
        },
        {
            "@type": "BlogPosting",
            headline: "10 Strategies to Master Pattern Recognition in Cognitive Tests",
            description: "Learn proven techniques to identify patterns faster and more accurately.",
            datePublished: new Date("2026-02-03").toISOString(),
            url: `${siteConfig.url}/blog/master-pattern-recognition`,
            timeToRead: "10 min read",
        },
        {
            "@type": "BlogPosting",
            headline: "How Cognitive Games Improve Your Problem-Solving Skills",
            description: "Discover the science behind cognitive training.",
            datePublished: new Date("2026-02-02").toISOString(),
            url: `${siteConfig.url}/blog/cognitive-games-problem-solving`,
            timeToRead: "8 min read",
        }
    ]
};

export const metadata: Metadata = {
    title: "Blog - Cognitive Games & Placement Prep Insights",
    description:
        "Read expert articles on Capgemini cognitive games, placement strategies, and cognitive ability test preparation. Learn proven tips and techniques.",
    keywords: [
        "cognitive games blog",
        "placement preparation tips",
        "pattern recognition strategies",
        "cognitive ability test guide",
        "Capgemini games strategy"
    ],
    alternates: {
        canonical: `${siteConfig.url}/blog`,
    },
    openGraph: {
        title: "Cognitive Games Blog - Placement Prep & Strategies",
        description: "Expert insights and strategies for mastering cognitive ability games.",
        url: `${siteConfig.url}/blog`,
        type: "website",
    }
};

export default function BlogPage() {
    return (
        <>
            <Script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Script
                id="blog-collection-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionSchema) }}
            />
            <BlogPageContent />
        </>
    );
}

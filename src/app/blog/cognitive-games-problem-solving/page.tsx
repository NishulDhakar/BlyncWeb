import type { Metadata } from "next";
import Script from "next/script";
import { siteConfig } from "@/config/site";
import CognitiveGamesProblemSolvingContent from "./content";

export const metadata: Metadata = {
  title: "How Cognitive Games Improve Your Problem-Solving Skills | Blync",
  description:
    "Discover the neuroscience and cognitive psychology behind game-based training. Learn how playing cognitive games enhances problem solving, fluid intelligence, and placement aptitude test scores.",
  keywords: [
    "cognitive games problem solving",
    "brain training aptitude tests",
    "neuroscience cognitive games",
    "problem solving skills improvement",
    "cognitive ability preparation",
    "capgemini cognitive tests"
  ],
  alternates: {
    canonical: `${siteConfig.url}/blog/cognitive-games-problem-solving`,
  },
  openGraph: {
    title: "How Cognitive Games Improve Your Problem-Solving Skills | Blync",
    description: "Discover how targeted cognitive games boost working memory, fluid intelligence, and problem-solving speed.",
    url: `${siteConfig.url}/blog/cognitive-games-problem-solving`,
    type: "article",
    authors: ["Blync"],
    publishedTime: new Date("2026-02-02").toISOString(),
    modifiedTime: new Date().toISOString(),
    images: [
      {
        url: `${siteConfig.url}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: "How Cognitive Games Improve Problem-Solving — Blync",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Cognitive Games Improve Your Problem-Solving Skills",
    description: "Learn how targeted cognitive exercises improve executive function and assessment performance.",
    images: [`${siteConfig.url}/og-logo.png`],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "How Cognitive Games Improve Your Problem-Solving Skills",
  description: "Discover how regular cognitive training enhances fluid reasoning, executive function, and assessment success.",
  datePublished: "2026-02-02",
  dateModified: new Date().toISOString().split("T")[0],
  author: {
    "@type": "Organization",
    name: "Blync",
    url: siteConfig.url,
  },
  publisher: {
    "@type": "Organization",
    name: "Blync",
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/logo.png`,
    },
  },
  image: {
    "@type": "ImageObject",
    url: `${siteConfig.url}/og-logo.png`,
    width: 1200,
    height: 630,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${siteConfig.url}/blog/cognitive-games-problem-solving`,
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
    {
      "@type": "ListItem",
      position: 3,
      name: "How Cognitive Games Improve Problem-Solving",
      item: `${siteConfig.url}/blog/cognitive-games-problem-solving`,
    },
  ],
};

export default function CognitiveGamesProblemSolvingPage() {
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
      <CognitiveGamesProblemSolvingContent />
    </>
  );
}

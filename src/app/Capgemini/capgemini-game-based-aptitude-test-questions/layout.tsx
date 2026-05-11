import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    title: "Capgemini Game Based Aptitude Test Questions & Answers 2026",
    description:
        "Get familiar with the Capgemini Game Based Aptitude Test Questions for 2026. Review previous year questions, placement papers, and free mock test patterns.",
    keywords: [
        "capgemini game based aptitude test questions",
        "capgemini aptitude test questions",
        "capgemini game based aptitude questions pdf",
        "capgemini assessment test questions and answers pdf",
        "capgemini previous year questions",
        "capgemini online test papers with answers",
        "capgemini test questions",
        "capgemini placement papers",
        "aptitude questions for capgemini",
        "capgemini questions",
        "capgemini assessment test questions",
        "capgemini game based aptitude 2026"
    ],
    alternates: {
        canonical: `${siteConfig.url}/Capgemini/capgemini-game-based-aptitude-test-questions`,
    },
    openGraph: {
        title: "Capgemini Game Based Aptitude Test Questions & Answers 2026 | Blync",
        description: "Practice Capgemini game based aptitude test questions. Previous year papers, mock tests, and free prep for 2026 placements.",
        url: `${siteConfig.url}/Capgemini/capgemini-game-based-aptitude-test-questions`,
        type: "website",
        images: [
            {
                url: `${siteConfig.url}/og-logo.png`,
                width: 1200,
                height: 630,
                alt: "Capgemini Game Based Aptitude Test Questions — Blync",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Capgemini Game Based Aptitude Test Questions 2026 | Blync",
        description: "Free practice for Capgemini game based aptitude test. Previous year questions and mock tests.",
        images: [`${siteConfig.url}/og-logo.png`],
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

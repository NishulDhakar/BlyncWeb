import { siteConfig } from "./site";
import { liveGames, seoHref } from "@/games/registry";

/**
 * Navigation configuration for the app header and footer.
 */
export const mainNavItems = [
    { label: "Home", href: "/" },
    { label: "Games", href: "/games" },
    { label: "Memory Games", href: "/games/memory" },
    { label: "IQ Tests", href: "/iq-tests" },
    { label: "Blog", href: "/blog" },
    
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "How It Works", href: "/how-it-works" },
] as const;

export const footerNavItems = {
    /**
     * Footer game links point at the indexable /games/<category>/<slug> pages,
     * not at /play/*. The play routes are noindex and auth-gated, so linking to
     * them from every page in the site spent crawl budget on URLs Google is
     * told to ignore, and passed no internal link equity to the pages that
     * actually rank. Derived from the registry so the list never goes stale.
     */
    games: liveGames()
        .filter((game) => game.company === "capgemini" && game.category === "cognitive")
        .slice(0, 8)
        .map((game) => ({ label: game.name, href: seoHref(game) })),

    /** Company/category hubs — the second tier of the internal link graph. */
    hubs: [
        { label: "Capgemini Games", href: "/games/cognitive" },
        { label: "Accenture Games", href: "/games/cognitive" },
        { label: "Assessments & Quizzes", href: "/games/quiz" },
        { label: "Communication Rounds", href: "/games/communication" },
        { label: "Memory Games", href: "/games/memory" },
        { label: "Brain Games", href: "/games/brain" },
    ],

    resources: [
        { label: "Game Guide", href: "/docs" },
        { label: "Rules & Guides", href: "/rules/switch-challenge" },
        { label: "Capgemini Prep", href: "/games/cognitive" },
        { label: "Cognizant Prep", href: "/cognizant-games" },
        { label: "Blog", href: "/blog" },
        { label: "About", href: "/about" },
        { label: "How It Works", href: "/how-it-works" },
    ],
    legal: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms-of-service" },
        { label: "Contact", href: "/contact" },
        { label: "Feedback", href: "/feedback" },
    ],
    social: [
        { label: "Twitter", href: siteConfig.links.twitter },
        { label: "GitHub", href: siteConfig.links.github },
    ],
};

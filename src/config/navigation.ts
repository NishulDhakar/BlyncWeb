import { siteConfig } from "./site";

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
    games: [
        { label: "Switch Challenge", href: "/play/switch-challenge" },
        { label: "Grid Challenge", href: "/play/grid-challenge" },
        { label: "Digit Challenge", href: "/play/digit-challenge" },
        { label: "Motion Challenge", href: "/play/motion-challenge" },
        { label: "Inductive Challenge", href: "/play/inductive-challenge" },
        { label: "Deductive Challenge", href: "/play/deductive-challenge" },
    ],
    resources: [
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
} as const;

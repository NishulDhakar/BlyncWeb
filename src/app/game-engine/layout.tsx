import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * /game-engine had neither a canonical nor a robots directive, so it was
 * indexable with the homepage's inherited metadata. Given it is a standalone
 * marketing page rather than a search target, a self-canonical keeps it from
 * competing with /games for the same queries.
 */
export const metadata: Metadata = {
    title: "Blync Game Engine",
    description:
        "The engine behind Blync's cognitive games: shared game shell, per-game modules, and consistent scoring across every placement round.",
    alternates: { canonical: `${siteConfig.url}/game-engine` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-[#0f0c29] min-h-screen text-white/90 selection:bg-cyan-500 selection:text-black font-sans relative z-10">
            {children}
        </div>
    )
}

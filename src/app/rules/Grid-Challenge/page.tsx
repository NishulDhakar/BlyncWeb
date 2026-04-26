import RulePage from "@/components/common/RulePage";
import { gridChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grid Challenge Practice Free 2026 — Capgemini Game Guide | Blync",
  description: "Practice Grid Challenge for Capgemini placement. Free unlimited attempts, spatial reasoning tips & complete strategy guide. 1,000+ students improved. Start now!",
  keywords: [
    "grid challenge",
    "grid challenge game",
    "grid challenge practice",
    "grid challenge capgemini",
    "capgemini grid challenge online",
    "grid challenge test",
    "capgemini game based aptitude test",
    "spatial reasoning game free",
    "grid challenge free"
  ],
  alternates: {
    canonical: "https://www.cognitivegames.me/rules/Grid-Challenge",
  },
  openGraph: {
    title: "Grid Challenge Practice Free 2026 — Capgemini Game Guide",
    description: "Free Grid Challenge practice for Capgemini placement. Unlimited attempts, expert tips & spatial reasoning guide.",
    url: "https://www.cognitivegames.me/rules/Grid-Challenge",
    type: "article",
  },
};

export default function Page() {
  return <RulePage data={gridChallengeRules} />;
}

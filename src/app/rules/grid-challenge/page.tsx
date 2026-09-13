import RulePage from "@/components/common/RulePage";
import { gridChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grid Challenge Practice Guide 2026 — Capgemini Game Guide | Blync",
  description: "Practice Grid Challenge for Capgemini placement. Spatial reasoning tips, rules & complete strategy guide with Blync Pro. 1,000+ students improved.",
  keywords: [
    "grid challenge",
    "grid challenge game",
    "grid challenge practice",
    "grid challenge capgemini",
    "capgemini grid challenge online",
    "grid challenge test",
    "capgemini game based aptitude test",
    "spatial reasoning game",
    "grid challenge rules"
  ],
  alternates: {
    canonical: "https://www.cognitivegames.me/rules/grid-challenge",
  },
  openGraph: {
    title: "Grid Challenge Practice Guide 2026 — Capgemini Game Guide",
    description: "Grid Challenge practice guide for Capgemini placement. Expert tips & spatial reasoning mock tests with Blync Pro.",
    url: "https://www.cognitivegames.me/rules/grid-challenge",
    type: "article",
  },
};

export default function Page() {
  return <RulePage data={gridChallengeRules} />;
}

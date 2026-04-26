import RulePage from "@/components/common/RulePage";
import { SwitchChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Switch Challenge Practice Free 2026 — Capgemini Test Prep | Blync",
  description: "Master Switch Challenge for Capgemini cognitive test. Free practice games, pattern recognition tips & expert strategies. 1,000+ students prepared. Practice unlimited!",
  keywords: [
    "switch challenge",
    "switch challenge practice",
    "capgemini switch challenge",
    "switch challenge free",
    "switch test capgemini",
    "cognitive flexibility game",
    "capgemini game based aptitude test",
    "switch challenge online"
  ],
  alternates: {
    canonical: "https://www.cognitivegames.me/rules/switch-challenge",
  },
  openGraph: {
    title: "Switch Challenge Practice Free 2026 — Capgemini Test Prep",
    description: "Free Switch Challenge practice for Capgemini placement. Pattern recognition tips, unlimited attempts.",
    url: "https://www.cognitivegames.me/rules/switch-challenge",
    type: "article",
  },
};

export default function Page() {
  return <RulePage data={SwitchChallengeRules} />;
}

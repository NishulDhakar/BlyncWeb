import RulePage from "@/components/common/RulePage";
import { SwitchChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Switch Challenge Practice Guide 2026 — Capgemini Test Prep | Blync",
  description: "Master Switch Challenge for Capgemini cognitive test. Rules, pattern recognition tips & expert strategies. Practice unlimited with Blync Pro!",
  keywords: [
    "switch challenge",
    "switch challenge practice",
    "capgemini switch challenge",
    "switch challenge rules",
    "switch test capgemini",
    "cognitive flexibility game",
    "capgemini game based aptitude test",
    "switch challenge online"
  ],
  alternates: {
    canonical: "https://www.cognitivegames.me/rules/switch-challenge",
  },
  openGraph: {
    title: "Switch Challenge Practice Guide 2026 — Capgemini Test Prep",
    description: "Switch Challenge rules and practice guide for Capgemini placement. Pattern recognition tips, mock tests with Blync Pro.",
    url: "https://www.cognitivegames.me/rules/switch-challenge",
    type: "article",
  },
};

export default function Page() {
  return <RulePage data={SwitchChallengeRules} />;
}

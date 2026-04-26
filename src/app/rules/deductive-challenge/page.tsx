import RulePage from "@/components/common/RulePage";
import { deductiveChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deductive Challenge Practice Free 2026 — Capgemini Prep | Blync",
  description: "Master Deductive Challenge for Capgemini cognitive test. Free practice games, logic reasoning tips & complete guide. Improve deductive thinking fast. Start now!",
  keywords: [
    "deductive challenge",
    "deductive challenge practice",
    "capgemini deductive challenge",
    "deductive reasoning game free",
    "deductive challenge capgemini",
    "logical reasoning game",
    "capgemini game based aptitude test",
    "deductive challenge free"
  ],
  alternates: {
    canonical: "https://www.cognitivegames.me/rules/deductive-challenge",
  },
  openGraph: {
    title: "Deductive Challenge Practice Free 2026 — Capgemini Prep",
    description: "Free Deductive Challenge practice for Capgemini placement. Logic tips & unlimited attempts.",
    url: "https://www.cognitivegames.me/rules/deductive-challenge",
    type: "article",
  },
};

export default function Page() {
  return <RulePage data={deductiveChallengeRules} />;
}

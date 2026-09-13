import RulePage from "@/components/common/RulePage";
import { deductiveChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deductive Challenge Practice Guide 2026 — Capgemini Prep | Blync",
  description: "Master Deductive Challenge for Capgemini cognitive test. Logic reasoning tips, rules & complete strategy guide with Blync Pro. Improve deductive thinking fast.",
  keywords: [
    "deductive challenge",
    "deductive challenge practice",
    "capgemini deductive challenge",
    "deductive reasoning game",
    "deductive challenge capgemini",
    "logical reasoning game",
    "capgemini game based aptitude test",
    "deductive challenge rules"
  ],
  alternates: {
    canonical: "https://www.cognitivegames.me/rules/deductive-challenge",
  },
  openGraph: {
    title: "Deductive Challenge Practice Guide 2026 — Capgemini Prep",
    description: "Deductive Challenge practice guide for Capgemini placement. Logic tips & mock tests with Blync Pro.",
    url: "https://www.cognitivegames.me/rules/deductive-challenge",
    type: "article",
  },
};

export default function Page() {
  return <RulePage data={deductiveChallengeRules} />;
}

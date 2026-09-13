import RulePage from "@/components/common/RulePage";
import { inductiveChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inductive Challenge Practice Guide 2026 — Capgemini Prep | Blync",
  description: "Master Inductive Challenge for Capgemini cognitive test. Abstract reasoning practice, pattern tips, rules & expert guide with Blync Pro.",
  keywords: [
    "inductive challenge",
    "inductive challenge practice",
    "capgemini inductive challenge",
    "abstract reasoning game",
    "inductive reasoning game",
    "pattern recognition test",
    "capgemini game based aptitude test",
    "inductive challenge rules"
  ],
  alternates: {
    canonical: "https://www.cognitivegames.me/rules/inductive-challenge",
  },
  openGraph: {
    title: "Inductive Challenge Practice Guide 2026 — Capgemini Prep",
    description: "Inductive Challenge practice guide for Capgemini placement. Abstract reasoning tips & mock tests with Blync Pro.",
    url: "https://www.cognitivegames.me/rules/inductive-challenge",
    type: "article",
  },
};

export default function Page() {
  return <RulePage data={inductiveChallengeRules} />;
}

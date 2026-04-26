import RulePage from "@/components/common/RulePage";
import { inductiveChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inductive Challenge Practice Free 2026 — Capgemini Prep | Blync",
  description: "Master Inductive Challenge for Capgemini cognitive test. Free abstract reasoning practice, pattern tips & expert guide. 1,000+ students prepared. Practice now!",
  keywords: [
    "inductive challenge",
    "inductive challenge practice",
    "capgemini inductive challenge",
    "abstract reasoning game free",
    "inductive reasoning game",
    "pattern recognition test",
    "capgemini game based aptitude test",
    "inductive challenge free"
  ],
  alternates: {
    canonical: "https://www.cognitivegames.me/rules/inductive-challenge",
  },
  openGraph: {
    title: "Inductive Challenge Practice Free 2026 — Capgemini Prep",
    description: "Free Inductive Challenge practice for Capgemini placement. Abstract reasoning tips & unlimited attempts.",
    url: "https://www.cognitivegames.me/rules/inductive-challenge",
    type: "article",
  },
};

export default function Page() {
  return <RulePage data={inductiveChallengeRules} />;
}

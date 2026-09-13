import RulePage from "@/components/common/RulePage";
import { motionChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motion Challenge Practice Guide 2026 — Capgemini Game Prep | Blync",
  description: "Master Motion Challenge for Capgemini cognitive test. Motion pattern tips, rules & complete strategy guide. Practice with Blync Pro!",
  keywords: [
    "motion challenge",
    "motion challenge practice",
    "capgemini motion challenge",
    "motion challenge rules",
    "motion pattern game",
    "motion challenge capgemini",
    "capgemini game based aptitude test",
    "motion challenge online"
  ],
  alternates: {
    canonical: "https://www.cognitivegames.me/rules/motion-challenge",
  },
  openGraph: {
    title: "Motion Challenge Practice Guide 2026 — Capgemini Game Prep",
    description: "Motion Challenge practice guide for Capgemini placement. Expert tips, pattern strategies & mock tests with Blync Pro.",
    url: "https://www.cognitivegames.me/rules/motion-challenge",
    type: "article",
  },
};

export default function Page() {
  return <RulePage data={motionChallengeRules} />;
}

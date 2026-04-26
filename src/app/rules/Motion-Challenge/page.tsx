import RulePage from "@/components/common/RulePage";
import { motionChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motion Challenge Practice Free 2026 — Capgemini Game Guide | Blync",
  description: "Master Motion Challenge for Capgemini cognitive test. Free practice, motion pattern tips & complete strategy guide. Top-ranked resource. Start practicing now!",
  keywords: [
    "motion challenge",
    "motion challenge practice",
    "capgemini motion challenge",
    "motion challenge free",
    "motion pattern game",
    "motion challenge capgemini",
    "capgemini game based aptitude test",
    "motion challenge online"
  ],
  alternates: {
    canonical: "https://www.cognitivegames.me/rules/Motion-Challenge",
  },
  openGraph: {
    title: "Motion Challenge Practice Free 2026 — Capgemini Game Guide",
    description: "Free Motion Challenge practice for Capgemini placement. Expert tips, pattern strategies & unlimited attempts.",
    url: "https://www.cognitivegames.me/rules/Motion-Challenge",
    type: "article",
  },
};

export default function Page() {
  return <RulePage data={motionChallengeRules} />;
}

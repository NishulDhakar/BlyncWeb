import RulePage from "@/components/common/RulePage";
import { DigitChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digit Challenge Practice Guide 2026 — Capgemini Test Prep | Blync",
  description: "Master Digit Challenge for Capgemini cognitive test. Practice guide, expert tips, rules & winning strategies with Blync Pro.",
  keywords: [
    "digit challenge",
    "digit challenge practice",
    "capgemini digit challenge",
    "number sequence game",
    "capgemini game based aptitude test",
    "digit memory test",
    "digit challenge rules",
    "capgemini digit challenge online"
  ],
  alternates: {
    canonical: "https://www.cognitivegames.me/rules/digit-challenge",
  },
  openGraph: {
    title: "Digit Challenge Practice Guide 2026 — Capgemini Test Prep",
    description: "Digit Challenge practice guide for Capgemini placement. Expert tips, number sequence strategies & mock tests with Blync Pro.",
    url: "https://www.cognitivegames.me/rules/digit-challenge",
    type: "article",
  },
};

export default function Page() {
  return <RulePage data={DigitChallengeRules} />;
}

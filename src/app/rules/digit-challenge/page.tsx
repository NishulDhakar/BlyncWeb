import RulePage from "@/components/common/RulePage";
import { DigitChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digit Challenge Practice Free 2026 — Capgemini Test Prep | Blync",
  description: "Master Digit Challenge for Capgemini cognitive test. Free practice, expert tips & winning strategies. 1,000+ students passed. Start practicing digit sequences now!",
  keywords: [
    "digit challenge",
    "digit challenge practice",
    "capgemini digit challenge",
    "number sequence game",
    "capgemini game based aptitude test",
    "digit memory test",
    "digit challenge free",
    "capgemini digit challenge online"
  ],
  alternates: {
    canonical: "https://www.cognitivegames.me/rules/digit-challenge",
  },
  openGraph: {
    title: "Digit Challenge Practice Free 2026 — Capgemini Test Prep",
    description: "Free Digit Challenge practice for Capgemini placement. Expert tips, strategies & unlimited attempts.",
    url: "https://www.cognitivegames.me/rules/digit-challenge",
    type: "article",
  },
};

export default function Page() {
  return <RulePage data={DigitChallengeRules} />;
}

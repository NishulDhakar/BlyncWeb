import RulePage from "@/components/common/RulePage";
import { DigitChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digit Challenge Memory Test | Strategy, Rules & Free Practice",
  description: "Boost your short-term memory capacity. Read our guide to mastering the Digit span challenge commonly used by major tech companies.",
  keywords: [
    "digit challenge",
    "capgemini digit challenge",
    "number sequence game",
    "capgemini game based aptitude test",
    "digit memory test"
  ]
};

export default function Page() {
  return <RulePage data={DigitChallengeRules} />;
}

import RulePage from "@/components/common/RulePage";
import { inductiveChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inductive Reasoning Test Guide | Tips, Rules & Mock Practice",
  description: "Ace the Inductive logic reasoning test. Discover patterns, understand the rules, and practice with our placement-focused mock tests.",
};

export default function Page() {
  return <RulePage data={inductiveChallengeRules} />;
}

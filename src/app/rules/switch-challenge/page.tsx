import RulePage from "@/components/common/RulePage";
import { SwitchChallengeRules } from "@/data/rules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Pass the Capgemini Switch Challenge (2025 Guide & Practice)",
  description: "Learn the exact rules, logic, and patterns to master the Switch Challenge cognitive game. Includes free mock test practice for placements.",
};

export default function Page() {
  return <RulePage data={SwitchChallengeRules} />;
}

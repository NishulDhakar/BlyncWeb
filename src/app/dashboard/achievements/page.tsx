import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "Achievements", robots: { index: false } };

export default function AchievementsPage() {
  return (
    <ComingSoon
      title="Achievements are coming soon"
      description="Badges and milestones for streaks, scores and companies mastered."
    />
  );
}

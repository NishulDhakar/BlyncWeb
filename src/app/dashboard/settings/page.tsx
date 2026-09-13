import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "Settings", robots: { index: false } };

export default function SettingsPage() {
  return (
    <ComingSoon
      title="Settings are coming soon"
      description="Account, notification and privacy controls are on the way."
    />
  );
}

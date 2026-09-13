import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "Mock Tests", robots: { index: false } };

export default function MockTestsPage() {
  return (
    <ComingSoon
      title="Mock Tests are coming soon"
      description="Full-length, timed mock tests that mirror the real assessment format are on the way."
    />
  );
}

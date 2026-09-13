import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "Bookmarks", robots: { index: false } };

export default function BookmarksPage() {
  return (
    <ComingSoon
      title="Bookmarks are coming soon"
      description="Save games and companies to come back to later."
    />
  );
}

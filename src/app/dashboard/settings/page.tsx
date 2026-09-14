import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSettingsData } from "@/features/settings/actions";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = {
  title: "Settings & Preferences | Blync Cognitive Practice",
  description: "Candidate profile settings, assessment preferences, streak reminders, and account security controls.",
  robots: { index: false },
};

export default async function SettingsPage() {
  const data = await getSettingsData();

  if (!data) {
    redirect("/register");
  }

  return <SettingsClient initialData={data} />;
}

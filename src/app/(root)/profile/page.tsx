import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
// All features are free — no need to check subscription status
import { headers } from "next/headers";
import { getProfileStats } from "@/features/profile/actions";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Profile",
  robots: { index: false },
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/register");

  // All features are free — everyone gets full access
  const stats = await getProfileStats(session.user.id);

  return <ProfileClient user={{ ...session.user }} stats={stats} />;
}

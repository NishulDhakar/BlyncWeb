import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
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

  const [dbUser] = await db
    .select({ isPro: users.isPro })
    .from(users)
    .where(eq(users.id, session.user.id));

  const isPro = dbUser?.isPro ?? false;
  const stats = await getProfileStats(session.user.id, isPro);

  return <ProfileClient user={{ ...session.user, isPro }} stats={stats} />;
}

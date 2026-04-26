import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getProfileStats } from "@/features/profile/actions";
import ProfileClient from "./ProfileClient";
import { getUserIsPro } from "@/lib/subscription";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export const metadata: Metadata = {
  title: "My Profile",
  robots: { index: false },
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/register");

  const isPro = await getUserIsPro(session.user.id);

  const [activeSub] = isPro
    ? await db
        .select({ planType: subscriptions.planType, expiresAt: subscriptions.expiresAt })
        .from(subscriptions)
        .where(and(eq(subscriptions.userId, session.user.id), eq(subscriptions.status, "active")))
        .limit(1)
    : [];

  const stats = await getProfileStats(session.user.id);

  return (
    <ProfileClient
      user={{ ...session.user, isPro }}
      stats={stats}
      subscription={activeSub ?? null}
    />
  );
}

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export type AdminRole = "super_admin" | "admin" | "support";

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: AdminRole;
  status: string;
}

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  support: 1,
  admin: 2,
  super_admin: 3,
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function getCurrentAdmin(): Promise<AdminSession | null> {
  try {
    const h = await headers();
    const session = await auth.api.getSession({ headers: h });
    if (!session?.user?.id || !session?.user?.email) return null;

    const [dbUser] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        image: users.image,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!dbUser) return null;
    if (dbUser.status === "suspended") return null;

    // Direct super_admin assignment if matches ADMIN_EMAIL
    let role: AdminRole | null = null;
    if (ADMIN_EMAIL && dbUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      role = "super_admin";
    } else if (
      dbUser.role === "super_admin" ||
      dbUser.role === "admin" ||
      dbUser.role === "support"
    ) {
      role = dbUser.role as AdminRole;
    }

    if (!role) return null;

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name ?? "Administrator",
      image: dbUser.image,
      role,
      status: dbUser.status ?? "active",
    };
  } catch (error) {
    console.error("[getCurrentAdmin] Auth error:", error);
    return null;
  }
}

export async function requireAdmin(
  requiredRole: AdminRole = "support"
): Promise<AdminSession> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("UNAUTHORIZED: Administrator credentials required");
  }

  const userLevel = ROLE_HIERARCHY[admin.role];
  const reqLevel = ROLE_HIERARCHY[requiredRole];

  if (userLevel < reqLevel) {
    throw new Error(
      `FORBIDDEN: Requires ${requiredRole} privileges, you are ${admin.role}`
    );
  }

  return admin;
}

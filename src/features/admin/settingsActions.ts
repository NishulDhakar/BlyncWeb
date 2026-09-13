"use server";

import { db } from "@/lib/db";
import { auditLogs, systemSettings, users } from "@/lib/schema";
import { requireAdmin, type AdminRole } from "./auth";
import { logAdminAction } from "./audit";
import { eq, desc, inArray, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAuditLogsList(page = 1, pageSize = 30) {
  await requireAdmin("support");

  const offset = (page - 1) * pageSize;

  return await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(pageSize)
    .offset(offset);
}

export async function getSystemSettings() {
  await requireAdmin("support");

  const rows = await db.select().from(systemSettings);
  const settingsMap: Record<string, any> = {};
  for (const r of rows) {
    settingsMap[r.key] = r.value;
  }
  return settingsMap;
}

export async function updateSystemSettings(key: string, value: Record<string, any>) {
  const admin = await requireAdmin("admin");

  await db
    .insert(systemSettings)
    .values({
      key,
      value,
      updatedBy: admin.email,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: systemSettings.key,
      set: {
        value,
        updatedBy: admin.email,
        updatedAt: new Date(),
      },
    });

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: `settings.${key}_updated`,
    targetType: "setting",
    targetId: key,
    metadata: value,
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function getAdminUsersList() {
  await requireAdmin("admin");

  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(inArray(users.role, ["super_admin", "admin", "support"]))
    .orderBy(users.name);
}

export async function updateAdminRole(userId: string, newRole: AdminRole | "user") {
  const admin = await requireAdmin("super_admin");

  const [targetUser] = await db
    .select({ email: users.email, role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!targetUser) throw new Error("User not found");

  await db
    .update(users)
    .set({
      role: newRole,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "admin.role_changed",
    targetType: "user",
    targetId: userId,
    metadata: {
      email: targetUser.email,
      previousRole: targetUser.role,
      newRole,
    },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function assignAdminByEmail(email: string, role: AdminRole) {
  const admin = await requireAdmin("super_admin");

  const [targetUser] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.email, email.trim()))
    .limit(1);

  if (!targetUser) {
    throw new Error(`No user found with email "${email}". The user must register first.`);
  }

  await db
    .update(users)
    .set({
      role,
      updatedAt: new Date(),
    })
    .where(eq(users.id, targetUser.id));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "admin.assigned",
    targetType: "user",
    targetId: targetUser.id,
    metadata: { email: targetUser.email, role },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

import { db } from "@/lib/db";
import { auditLogs } from "@/lib/schema";
import { randomUUID } from "crypto";

export interface LogAdminActionParams {
  adminId: string;
  adminEmail: string;
  adminName?: string | null;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
}

export async function logAdminAction(params: LogAdminActionParams) {
  try {
    await db.insert(auditLogs).values({
      id: randomUUID(),
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      adminName: params.adminName ?? null,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      metadata: params.metadata ?? null,
      ipAddress: params.ipAddress ?? null,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("[logAdminAction] Failed to write audit log:", err);
  }
}

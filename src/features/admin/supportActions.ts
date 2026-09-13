"use server";

import { db } from "@/lib/db";
import { supportTickets } from "@/lib/schema";
import { requireAdmin } from "./auth";
import { logAdminAction } from "./audit";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function getSupportTickets(filterStatus = "all") {
  await requireAdmin("support");

  if (filterStatus !== "all") {
    return await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.status, filterStatus))
      .orderBy(desc(supportTickets.createdAt));
  }

  return await db
    .select()
    .from(supportTickets)
    .orderBy(desc(supportTickets.createdAt));
}

export async function updateTicketStatus(
  id: string,
  status: "open" | "in_progress" | "resolved" | "closed",
  notes?: string
) {
  const admin = await requireAdmin("support");

  await db
    .update(supportTickets)
    .set({
      status,
      notes: notes !== undefined ? notes : undefined,
      updatedAt: new Date(),
    })
    .where(eq(supportTickets.id, id));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "support_ticket.status_updated",
    targetType: "support_ticket",
    targetId: id,
    metadata: { status, notes },
  });

  revalidatePath("/admin/support");
  return { success: true };
}

// Public submission action for /feedback and /contact
export async function submitPublicSupportTicket(data: {
  name: string;
  email: string;
  type?: "feedback" | "bug" | "report" | "contact";
  subject: string;
  message: string;
  rating?: number;
}) {
  const id = `ticket-${randomUUID().slice(0, 8)}`;

  await db.insert(supportTickets).values({
    id,
    name: data.name,
    email: data.email,
    type: data.type || "feedback",
    subject: data.subject,
    message: data.message,
    rating: data.rating ?? null,
    status: "open",
    priority: "medium",
  });

  revalidatePath("/admin/support");
  return { success: true, id };
}

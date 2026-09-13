"use server";

import { db } from "@/lib/db";
import { contentItems } from "@/lib/schema";
import { requireAdmin } from "./auth";
import { logAdminAction } from "./audit";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function getContentItemsList() {
  await requireAdmin("support");

  return await db
    .select()
    .from(contentItems)
    .orderBy(desc(contentItems.createdAt));
}

export async function createContentItem(data: {
  title: string;
  type: string;
  content: string;
  gameSlug?: string;
  companySlug?: string;
}) {
  const admin = await requireAdmin("admin");
  const id = `content-${randomUUID().slice(0, 8)}`;

  await db.insert(contentItems).values({
    id,
    title: data.title,
    type: data.type,
    content: data.content,
    gameSlug: data.gameSlug || null,
    companySlug: data.companySlug || null,
    status: "published",
  });

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "content.created",
    targetType: "content",
    targetId: id,
    metadata: { title: data.title, type: data.type },
  });

  revalidatePath("/admin/content");
  return { success: true, id };
}

export async function updateContentItem(
  id: string,
  data: {
    title?: string;
    type?: string;
    content?: string;
    gameSlug?: string;
    companySlug?: string;
    status?: string;
  }
) {
  const admin = await requireAdmin("admin");

  await db
    .update(contentItems)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(contentItems.id, id));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "content.updated",
    targetType: "content",
    targetId: id,
    metadata: data,
  });

  revalidatePath("/admin/content");
  return { success: true };
}

export async function deleteContentItem(id: string) {
  const admin = await requireAdmin("admin");

  await db.delete(contentItems).where(eq(contentItems.id, id));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "content.deleted",
    targetType: "content",
    targetId: id,
  });

  revalidatePath("/admin/content");
  return { success: true };
}

"use server";

import { db } from "@/lib/db";
import { users, broadcasts, broadcastRecipients } from "@/lib/schema";
import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

async function getSessionUser() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  return session?.user ?? null;
}

function isAdmin(email: string | undefined | null) {
  return ADMIN_EMAIL && email === ADMIN_EMAIL;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send in small batches to avoid SMTP rate limits
async function sendBatch(
  emails: { recipientId: string; email: string }[],
  subject: string,
  text: string,
  attachments: nodemailer.SendMailOptions["attachments"]
) {
  const results: { recipientId: string; ok: boolean; error?: string }[] = [];

  for (const { recipientId, email } of emails) {
    try {
      await transporter.sendMail({
        from: `"Blync" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        text,
        attachments,
      });
      results.push({ recipientId, ok: true });
    } catch (err) {
      results.push({ recipientId, ok: false, error: String(err) });
    }
    // Small delay between sends to respect SMTP rate limits
    await new Promise((r) => setTimeout(r, 120));
  }

  return results;
}

export async function sendBroadcast({
  subject,
  message,
  imageBase64,
  imageName,
}: {
  subject: string;
  message: string;
  imageBase64?: string;
  imageName?: string;
}) {
  const user = await getSessionUser();
  if (!isAdmin(user?.email)) return { success: false, error: "Unauthorized" };

  const allUsers = await db.select({ id: users.id, email: users.email }).from(users);
  if (allUsers.length === 0) return { success: false, error: "No users found." };

  // Create broadcast record
  const broadcastId = randomUUID();
  await db.insert(broadcasts).values({
    id: broadcastId,
    subject,
    message,
    imageName: imageName ?? null,
    totalCount: allUsers.length,
    sentCount: 0,
    failedCount: 0,
  });

  // Insert pending recipient rows
  const recipientRows = allUsers.map((u) => ({
    id: randomUUID(),
    broadcastId,
    userId: u.id,
    email: u.email,
    status: "pending" as const,
  }));
  await db.insert(broadcastRecipients).values(recipientRows);

  const attachments: nodemailer.SendMailOptions["attachments"] = imageBase64
    ? [{ filename: imageName ?? "image.png", content: Buffer.from(imageBase64, "base64") }]
    : [];

  // Send and update status per recipient
  const results = await sendBatch(
    recipientRows.map((r) => ({ recipientId: r.id, email: r.email })),
    subject,
    message,
    attachments
  );

  let sentCount = 0;
  let failedCount = 0;

  for (const result of results) {
    if (result.ok) {
      sentCount++;
      await db
        .update(broadcastRecipients)
        .set({ status: "sent", sentAt: new Date() })
        .where(eq(broadcastRecipients.id, result.recipientId));
    } else {
      failedCount++;
      await db
        .update(broadcastRecipients)
        .set({ status: "failed", error: result.error })
        .where(eq(broadcastRecipients.id, result.recipientId));
    }
  }

  await db
    .update(broadcasts)
    .set({ sentCount, failedCount })
    .where(eq(broadcasts.id, broadcastId));

  return { success: true, broadcastId, sentCount, failedCount, total: allUsers.length };
}

export async function retryFailed(broadcastId: string) {
  const user = await getSessionUser();
  if (!isAdmin(user?.email)) return { success: false, error: "Unauthorized" };

  const broadcast = await db
    .select()
    .from(broadcasts)
    .where(eq(broadcasts.id, broadcastId))
    .limit(1);
  if (!broadcast[0]) return { success: false, error: "Broadcast not found." };

  const failed = await db
    .select()
    .from(broadcastRecipients)
    .where(
      and(
        eq(broadcastRecipients.broadcastId, broadcastId),
        eq(broadcastRecipients.status, "failed")
      )
    );

  if (failed.length === 0) return { success: true, sentCount: 0, failedCount: 0 };

  const results = await sendBatch(
    failed.map((r) => ({ recipientId: r.id, email: r.email })),
    broadcast[0].subject,
    broadcast[0].message,
    []
  );

  let sentCount = 0;
  let failedCount = 0;

  for (const result of results) {
    if (result.ok) {
      sentCount++;
      await db
        .update(broadcastRecipients)
        .set({ status: "sent", sentAt: new Date(), error: null })
        .where(eq(broadcastRecipients.id, result.recipientId));
    } else {
      failedCount++;
      await db
        .update(broadcastRecipients)
        .set({ error: result.error })
        .where(eq(broadcastRecipients.id, result.recipientId));
    }
  }

  await db
    .update(broadcasts)
    .set({
      sentCount: broadcast[0].sentCount + sentCount,
      failedCount: broadcast[0].failedCount - sentCount,
    })
    .where(eq(broadcasts.id, broadcastId));

  return { success: true, sentCount, failedCount };
}

export async function getBroadcastHistory() {
  const user = await getSessionUser();
  if (!isAdmin(user?.email)) return { success: false, error: "Unauthorized", data: [] };

  const rows = await db
    .select()
    .from(broadcasts)
    .orderBy(broadcasts.createdAt);

  return { success: true, data: rows.reverse() };
}

export async function getUserCount() {
  const user = await getSessionUser();
  if (!isAdmin(user?.email)) return { success: false, error: "Unauthorized" };

  const result = await db.select({ email: users.email }).from(users);
  return { success: true, count: result.length };
}

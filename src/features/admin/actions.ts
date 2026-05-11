"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { sendWelcomeEmail } from "@/lib/mailer";
import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

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
  if (!isAdmin(user?.email)) {
    return { success: false, error: "Unauthorized" };
  }

  const allUsers = await db.select({ email: users.email, name: users.name }).from(users);
  const recipients = allUsers.filter((u) => u.email);

  if (recipients.length === 0) {
    return { success: false, error: "No users found." };
  }

  const emails = recipients.map((u) => u.email);

  const attachments = imageBase64
    ? [{ filename: imageName ?? "image.png", content: Buffer.from(imageBase64, "base64") }]
    : [];

  await transporter.sendMail({
    from: `"Blync" <${process.env.SMTP_USER}>`,
    bcc: emails,
    subject,
    text: message,
    attachments,
  });

  return { success: true, count: emails.length };
}

export async function getUserCount() {
  const user = await getSessionUser();
  if (!isAdmin(user?.email)) return { success: false, error: "Unauthorized" };

  const result = await db.select({ email: users.email }).from(users);
  return { success: true, count: result.length };
}

"use server";

import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

/**
 * Send a broadcast email to all registered users.
 * Admin-only action.
 */
export async function sendBroadcast({
  subject,
  message,
}: {
  subject: string;
  message: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const allUsers = await db.select({ email: users.email }).from(users);
    const emails = allUsers.map((u) => u.email).filter(Boolean);

    if (emails.length === 0) {
      return { success: false, error: "No users found to send email to." };
    }

    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      bcc: emails,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
    };

    await transporter.sendMail(mailOptions as any);

    return { success: true, count: emails.length };
  } catch (error) {
    console.error("Error sending broadcast:", error);
    return { success: false, error: String(error) };
  }
}

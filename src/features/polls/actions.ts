"use server";

import { db } from "@/lib/db";
import { polls, pollOptions } from "@/lib/schema";
import { eq, desc, asc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

/**
 * Get the most recent active poll with its options.
 * Creates a default poll if none exists (first-run seed).
 */
export async function getPoll() {
  try {
    const [poll] = await db
      .select()
      .from(polls)
      .where(eq(polls.isActive, true))
      .orderBy(desc(polls.createdAt))
      .limit(1);

    if (!poll) {
      const pollId = randomUUID();
      const now = new Date();

      await db.insert(polls).values({
        id: pollId,
        question: "Which company assessment games should we add next?",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });

      await db.insert(pollOptions).values([
        { id: randomUUID(), label: "Accenture Critical Thinking & Attention", votes: 0, isInput: false, pollId },
        { id: randomUUID(), label: "Deloitte Reasoning & Versant", votes: 0, isInput: false, pollId },
        { id: randomUUID(), label: "TCS NQT Cognitive Puzzles", votes: 0, isInput: false, pollId },
        { id: randomUUID(), label: "Suggest another company / game", isInput: true, votes: 0, pollId },
      ]);

      const options = await db
        .select()
        .from(pollOptions)
        .where(eq(pollOptions.pollId, pollId))
        .orderBy(asc(pollOptions.label));

      return { ...{ id: pollId, question: "Which game you want next?", isActive: true, createdAt: now, updatedAt: now }, options };
    }

    const options = await db
      .select()
      .from(pollOptions)
      .where(eq(pollOptions.pollId, poll.id))
      .orderBy(asc(pollOptions.label));

    return { ...poll, options };
  } catch (error) {
    console.error("Error fetching poll:", error);
    return null;
  }
}

/**
 * Submit a vote for a poll option.
 */
export async function submitVote(optionId: string, suggestion?: string) {
  try {
    await db
      .update(pollOptions)
      .set({ votes: sql`${pollOptions.votes} + 1` })
      .where(eq(pollOptions.id, optionId));

    if (suggestion) {
      console.log("New game suggestion:", suggestion);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error submitting vote:", error);
    return { success: false, error: "Failed to submit vote" };
  }
}

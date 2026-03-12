import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { gameScores } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export const GET = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scores = await db
      .select()
      .from(gameScores)
      .where(eq(gameScores.userId, session.user.id))
      .orderBy(desc(gameScores.score))
      .limit(10);

    return NextResponse.json(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { gameId, score } = body;

    if (!gameId || typeof score !== "number") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const [newScore] = await db
      .insert(gameScores)
      .values({ id: randomUUID(), userId: session.user.id, gameId, score })
      .returning();

    return NextResponse.json(newScore);
  } catch (error) {
    console.error("Error saving score:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

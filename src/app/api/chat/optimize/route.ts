import { NextRequest, NextResponse } from "next/server";
import { optimizePrompt } from "@/lib/chatbot/optimizer";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const result = await optimizePrompt(prompt, groqKey);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Optimize prompt error:", error);
    return NextResponse.json(
      { error: "Failed to optimize prompt" },
      { status: 500 }
    );
  }
}

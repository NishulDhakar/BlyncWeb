import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, userStreaks, gameScores } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { retrieveKnowledge } from "@/lib/chatbot/knowledge";
import { searchWebForPlacementInfo } from "@/lib/chatbot/search";

// In-memory rate limiting: 45 requests per minute per IP
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 45;

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;
  return "127.0.0.1";
}

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  clientData.count++;
  return true;
}

// Candidate Groq models in prioritized order
const GROQ_CANDIDATE_MODELS = [
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "groq/compound",
  "groq/compound-mini",
];

// Generate contextual follow-up chips based on message topics
function generateContextualSuggestions(query: string, replyText: string): string[] {
  const q = query.toLowerCase();

  if (q.includes("switch")) {
    return [
      "How to eliminate wrong branches in Switch Challenge?",
      "What is the time limit per level?",
      "Upgrade to Blync Pro (₹49)",
    ];
  }
  if (q.includes("digit")) {
    return [
      "Shortcuts for large target numbers in Digit Challenge",
      "Which math operators are allowed?",
      "Start practice with Pro",
    ];
  }
  if (q.includes("capgemini")) {
    return [
      "Which 4 games are tested in Capgemini?",
      "Capgemini Pseudocode round tips",
      "Take mock assessment (Pro)",
    ];
  }
  if (q.includes("accenture")) {
    return [
      "Accenture Cognitive vs Technical breakdown",
      "Accenture Coding round languages & cutoff",
      "How Blync games help Accenture test",
    ];
  }
  if (q.includes("tcs")) {
    return [
      "TCS NQT Foundation vs Advanced syllabus",
      "TCS Digital coding question difficulty",
      "Cognitive agility games for TCS",
    ];
  }
  if (q.includes("price") || q.includes("pro") || q.includes("cost") || q.includes("free")) {
    return [
      "Which 26+ games are unlocked with Pro?",
      "How do I subscribe for ₹49?",
      "Can I view game rules for free?",
    ];
  }

  return [
    "Capgemini Game Round Guide",
    "What is included in Blync Pro (₹49)?",
    "Best cognitive games for campus placement",
  ];
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  if (!checkRateLimit(clientIP)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please slow down!" }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { message?: string; history?: Array<{ role: "user" | "bot" | "assistant"; text: string }> };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  const userMessage = body.message?.trim() || "";
  if (!userMessage) {
    return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
  }

  // 1. RAG Retrieval for Platform & Company Round Data (top 2 most relevant items to keep context lean)
  const ragContext = retrieveKnowledge(userMessage, 2);
  const ragContextText = ragContext
    .map((k) => `### ${k.title} (${k.category})\n${k.content}`)
    .join("\n\n");

  // 2. Web Search for Recent Hiring Updates
  const webResults = await searchWebForPlacementInfo(userMessage);
  const webResultsText = webResults.snippets.length > 0
    ? `\n### LIVE WEB SEARCH RESULTS (Query: "${webResults.query}")\n` +
      webResults.snippets.map((s, i) => `${i + 1}. ${s}`).join("\n")
    : "";

  // 3. User Personalization: Fetch authenticated candidate profile, Pro status, streak & game history
  let userProfileContext = "";
  try {
    const h = await headers();
    const session = await auth.api.getSession({ headers: h }).catch(() => null);
    if (session?.user) {
      const userId = session.user.id;
      const [userRecord] = await db
        .select({
          name: users.name,
          email: users.email,
          isPro: users.isPro,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      const [streak] = await db
        .select({
          currentStreak: userStreaks.currentStreak,
        })
        .from(userStreaks)
        .where(eq(userStreaks.userId, userId))
        .limit(1);

      const fullName = userRecord?.name?.trim() || session.user.name?.trim() || "Candidate";
      const firstName = fullName.split(" ")[0] || "there";
      const isPro = Boolean(userRecord?.isPro);
      const streakDays = streak?.currentStreak ?? 0;

      userProfileContext = `
### CANDIDATE PROFILE:
- Name: ${fullName} (address as "${firstName}")
- Subscription: ${isPro ? "Blync Pro Active" : "Free Tier"}
- Streak: ${streakDays > 0 ? `${streakDays} days` : "None"}
- Personalization Guideline: Keep response strictly point-wise and under 80 words. If mentioning Pro (₹49/mo), keep it to a single concise bullet point only when relevant.`;
    }
  } catch (err) {
    console.warn("Could not fetch user profile for chat personalization:", err);
  }

  // 4. Prepare System Prompt with Strict Brevity & Point-Wise Formatting Rules
  const systemPrompt = `You are BlyncBot, the fast, point-wise AI mentor for Blync (BlyncWeb).
Blync is India's premier cognitive aptitude and game-based assessment preparation platform for campus placements (Capgemini, Accenture, TCS, Cognizant, Infosys, Wipro).

CRITICAL FORMATTING RULES (STRICTLY ENFORCED):
1. ALWAYS REPLY IN SHORT, CONCISE, POINT-WISE BULLETS.
2. STRICT LIMIT: Output 2 to 4 short bullet points only.
3. STRICT LENGTH: Maximum 50 to 80 words total. Never exceed 90 words.
4. NO LONG TEXT: Absolutely no long paragraphs, no essays, and no conversational filler.
5. GET STRAIGHT TO THE POINT: Answer immediately without preamble or repetitive greetings.
6. BULLET FORMAT: Each bullet must be 1 to 2 lines max, beginning with a bold takeaway (e.g., "• **Key Trick:** ...", "• **Round Pattern:** ...", "• **Price:** ...").

STRICT SCOPE:
- Answer ONLY questions about Blync platform (games, mock tests, rules, Blync Pro ₹49) and corporate placement recruitment rounds/interviews.
- If the user asks an off-topic question, deflect in 1 short bullet: "• **Placement Focus:** I specialize only in placement tests and cognitive game rounds 🧠. Let's focus on mastering the Capgemini or Accenture rounds!"

GROUND TRUTH PLATFORM FACTS:
- Blync Pro is EXACTLY ₹49/month.
- Are there free games? NO. All 26+ games and mock tests require Blync Pro.
- Rules & strategy guides are 100% free to read at /rules/*.
- Capgemini tests 4 games out of 6 (Switch Challenge, Digit Challenge, Grid Challenge, Motion Challenge, Inductive Reasoning, Deductive Reasoning).
- Never invent nonexistent URLs, fake discounts, or fabricated company rounds.

${userProfileContext}

REFERENCE KNOWLEDGE (Extract ONLY what directly answers the user's query in 2-4 bullets):
${ragContextText}
${webResultsText}`;

  // Format conversation history for OpenAI-compatible endpoint
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  if (Array.isArray(body.history)) {
    for (const h of body.history.slice(-6)) {
      messages.push({
        role: h.role === "user" ? "user" : "assistant",
        content: h.text,
      });
    }
  }

  messages.push({ role: "user", content: userMessage });

  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return streamFallbackResponse(userMessage, webResults.searched);
  }

  // Iterate through available Groq candidate models with auto-fallback
  let successfulResponse: Response | null = null;
  let lastErrorMsg = "";

  for (const model of GROQ_CANDIDATE_MODELS) {
    try {
      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.4,
          max_tokens: 220,
          stream: true,
        }),
      });

      if (groqResponse.ok) {
        successfulResponse = groqResponse;
        break;
      }

      const errBody = await groqResponse.text();
      console.warn(`Groq model ${model} failed (${groqResponse.status}):`, errBody);
      lastErrorMsg = `Groq ${model} (${groqResponse.status})`;
    } catch (err: any) {
      console.warn(`Groq request error on model ${model}:`, err?.message || err);
      lastErrorMsg = err?.message || "Connection error";
    }
  }

  if (successfulResponse) {
    return pipeGroqStream(successfulResponse, userMessage, webResults.searched);
  }

  console.error("All Groq models failed. Serving resilient knowledge fallback. Error:", lastErrorMsg);
  return streamFallbackResponse(userMessage, webResults.searched);
}

/**
 * Pipes Groq's SSE stream directly to the client with SSE encapsulation
 */
function pipeGroqStream(groqResponse: Response, userMessage: string, searchedWeb: boolean) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = groqResponse.body?.getReader();

  if (!reader) {
    throw new Error("No readable body in Groq response");
  }

  let accumulatedReply = "";

  const stream = new ReadableStream({
    async start(controller) {
      // Send metadata first if web search was used
      if (searchedWeb) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ searchedWeb: true })}\n\n`));
      }

      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const payload = trimmed.slice(6);
            if (payload === "[DONE]") continue;

            try {
              const parsed = JSON.parse(payload);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulatedReply += delta;
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: delta })}\n\n`)
                );
              }
            } catch {
              // Ignore partial JSON
            }
          }
        }

        // Finalize with suggestions
        const suggestions = generateContextualSuggestions(userMessage, accumulatedReply);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true, suggestions })}\n\n`)
        );
      } catch (err) {
        console.error("Stream reading error:", err);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

/**
 * Resilient fallback stream grounded in platform knowledge
 */
function streamFallbackResponse(userMessage: string, searchedWeb: boolean) {
  const suggestions = generateContextualSuggestions(userMessage, "");
  const encoder = new TextEncoder();
  const q = userMessage.toLowerCase();

  let text = "";
  if (q.includes("switch")) {
    text = `🧠 **Switch Challenge Strategy:**\n\n• **Core Goal:** Find the 4-digit operator changing initial to final pattern.\n• **Speed Trick:** Test position 1 and 4 first to eliminate 3 of 4 options instantly.\n• **Practice:** Timed drills on **Blync Pro (₹49/mo)** at [/games/cognitive](/games/cognitive).`;
  } else if (q.includes("digit")) {
    text = `🔢 **Digit Challenge Strategy:**\n\n• **Core Goal:** Reach target number using available digits and operations (+, -, ×, ÷).\n• **Speed Hack:** Work backwards from factors, then adjust with + or -.\n• **Practice:** Timed simulations on **Blync Pro (₹49/mo)**.`;
  } else if (q.includes("capgemini")) {
    text = `🏢 **Capgemini Hiring Process:**\n\n• **Round 1:** Pseudocode (30m) + English Communication (30m).\n• **Round 2 (Elimination):** Game-Based Cognitive Test (4 random games out of 6).\n• **Round 3 & 4:** Spoken English Assessment (AI) followed by Technical/HR Interview.\n• **Drills:** Practice all 6 simulated games on **Blync Pro (₹49/mo)**.`;
  } else if (q.includes("accenture")) {
    text = `💼 **Accenture Assessment Pattern:**\n\n• **Cognitive Round:** Critical reasoning, abstract logic, and numerical puzzles.\n• **Technical Round:** Pseudocode, cloud basics, and networking.\n• **Coding Round:** 2 questions (C++, Java, or Python).\n• **Preparation:** Sharpen speed and accuracy at [/games/cognitive](/games/cognitive).`;
  } else if (q.includes("price") || q.includes("pro") || q.includes("cost") || q.includes("buy")) {
    text = `👑 **Blync Pro Details:**\n\n• **Price:** Exactly **₹49 / month**.\n• **Includes:** Unlimited practice for all **26+ placement games**, official timers & solutions.\n• **Upgrade:** Subscribe instantly at [/pricing](/pricing).`;
  } else {
    text = `⚡ **Blync AI Placement Mentor:**\n\n• **Focus:** Campus placement tests & cognitive games (Capgemini, Accenture, TCS, Cognizant).\n• **Quick Help:** Ask about *"Capgemini game rounds"*, *"Switch Challenge tips"*, or *"Blync Pro (₹49)"*.\n• **Practice:** Explore interactive games at [/games/cognitive](/games/cognitive).`;
  }

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text, searchedWeb })}\n\n`));
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, suggestions })}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
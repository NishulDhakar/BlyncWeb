import { NextRequest } from "next/server";
import { retrieveKnowledge } from "@/lib/chatbot/knowledge";
import { searchWebForPlacementInfo } from "@/lib/chatbot/search";

// In-memory rate limiting: 30 requests per minute per IP
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;

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

  // 1. RAG Retrieval for Platform & Company Round Data
  const ragContext = retrieveKnowledge(userMessage, 3);
  const ragContextText = ragContext
    .map((k) => `### ${k.title} (${k.category})\n${k.content}`)
    .join("\n\n");

  // 2. Web Search for Recent Hiring Updates
  const webResults = await searchWebForPlacementInfo(userMessage);
  const webResultsText = webResults.snippets.length > 0
    ? `\n### LIVE WEB SEARCH RESULTS (Query: "${webResults.query}")\n` +
      webResults.snippets.map((s, i) => `${i + 1}. ${s}`).join("\n")
    : "";

  // 3. Prepare System Prompt with Strict Grounding, Concise Formatting & Witty Persona
  const systemPrompt = `You are BlyncBot, the elite, quick-witted, and encouraging AI placement mentor for Blync (BlyncWeb).
Blync is India's premier cognitive aptitude and game-based assessment preparation platform for campus & corporate hiring.

STRICT CONTEXTUAL SCOPE (CRITICAL):
1. You ONLY answer questions related to:
   - Blync platform (games, mock tests, rules, leaderboards, Blync Pro subscription, analytics).
   - Corporate placement recruitment rounds, gamified aptitude tests, and interview processes (Capgemini, Accenture, TCS, Cognizant, Infosys, Wipro, Amazon, etc.).
2. OFF-TOPIC REDIRECTION:
   - If the user asks off-topic questions (e.g., writing poems, sports, movie plots, cooking recipes, geopolitics, general coding unconnected to hiring rounds), POLITELY AND WITTILY DEFLECT back to placement prep and cognitive games!
   - Example deflection: "My neural circuits are calibrated strictly for cracking campus placements and sharpening cognitive reflexes 🧠⚡. Let's redirect that creative energy into mastering the Capgemini Switch Challenge or Digit Challenge — your offer letter will thank you!"

GROUND TRUTH PLATFORM FACTS (NEVER HALLUCINATE):
- Blync Pro is EXACTLY ₹49/month.
- Are there free games to play? NO. All 26+ games, mock tests, and practice sessions require Blync Pro.
- Rules, guides, and strategy breakdown articles are 100% free to read at /rules/*.
- Blync has 26+ games across Cognitive, Memory, Brain, Quiz, and Communication categories.
- Capgemini tests 4 games out of 6 (Switch Challenge, Digit Challenge, Grid Challenge, Motion Challenge, Inductive Reasoning, Deductive Reasoning).
- Never invent nonexistent URLs, fake discounts, or fabricated company rounds.

TONE & STYLE:
- Short, concise, punchy! Avoid walls of text.
- Use clear markdown: bold highlights, short bullet points, and concise advice.
- Infuse tasteful, clever humor about placement anxiety, HR algorithms, and engineering life (e.g. "Because getting stumped by a 4-digit switch while an HR recruiter watches is a canon event we must prevent 🤖").
- Maximum length: 120 to 180 words.

GROUNDED RAG KNOWLEDGE:
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

  // Fallback if GROQ_API_KEY is not configured yet
  if (!groqApiKey) {
    const fallbackText = `⚡ **BlyncBot is in Preview Mode!**

To activate full Groq **Llama 3.3 (70B)** reasoning at 300 tokens/second, please add your Groq API key to your \`.env\` file:
\`\`\`env
GROQ_API_KEY="gsk_..."
\`\`\`

Here is what you need to know right now:
- **Blync Pro**: Exactly **₹49/month** unlocks all 26+ cognitive & placement games.
- **Capgemini Games**: Full practice simulators for Switch, Digit, Grid, and Motion challenges with full solution explanations!
- **Free Game Rules**: You can read complete game guides and test rules for free at our Rules section.

Ask me about any company round or game rules! 🧠`;

    const suggestions = generateContextualSuggestions(userMessage, fallbackText);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send fallback chunks
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: fallbackText, searchedWeb: webResults.searched })}\n\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, suggestions })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  }

  // Call Groq API via Streaming
  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.6,
        max_tokens: 600,
        stream: true,
      }),
    });

    if (!groqResponse.ok) {
      const errBody = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errBody);

      // Try fallback to llama-3.1-8b-instant if 70b was rate limited or overloaded
      const retryResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages,
          temperature: 0.6,
          max_tokens: 600,
          stream: true,
        }),
      });

      if (!retryResponse.ok) {
        throw new Error(`Groq API failed: ${groqResponse.status}`);
      }

      return pipeGroqStream(retryResponse, userMessage, webResults.searched);
    }

    return pipeGroqStream(groqResponse, userMessage, webResults.searched);
  } catch (error) {
    console.error("Error in Groq chat pipeline:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response from Groq AI" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
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
      "Connection": "keep-alive",
    },
  });
}
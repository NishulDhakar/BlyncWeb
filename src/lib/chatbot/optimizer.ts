/**
 * Blync AI Prompt Optimizer
 * Transforms rough user inputs into high-precision, placement-focused queries.
 */

interface OptimizeResult {
  optimizedPrompt: string;
  category: string;
}

const COMMON_REWRITES: Record<string, string> = {
  "switch": "What are the rules, time constraints, and winning strategies for the Capgemini Switch Challenge on Blync?",
  "switch challenge": "What are the rules, time constraints, and winning strategies for the Capgemini Switch Challenge on Blync?",
  "digit": "How does the Capgemini Digit Challenge work and what are the fastest mental arithmetic tricks to reach the target number?",
  "digit challenge": "How does the Capgemini Digit Challenge work and what are the fastest mental arithmetic tricks to reach the target number?",
  "grid": "What are the best dual-task memory techniques to ace the Capgemini Grid Challenge?",
  "grid challenge": "What are the best dual-task memory techniques to ace the Capgemini Grid Challenge?",
  "motion": "How do I solve the Capgemini Motion Challenge in the minimum moves without hitting obstacles?",
  "motion challenge": "How do I solve the Capgemini Motion Challenge in the minimum moves without hitting obstacles?",
  "capgemini": "Can you explain the entire Capgemini recruitment selection process and breakdown the 4 game rounds tested?",
  "capgemini rounds": "Can you explain the entire Capgemini recruitment selection process and breakdown the 4 game rounds tested?",
  "accenture": "What is the complete round-by-round assessment pattern for Accenture, and how can I prepare for the cognitive assessment?",
  "accenture rounds": "What is the complete round-by-round assessment pattern for Accenture, and how can I prepare for the cognitive assessment?",
  "tcs": "What are the sections in TCS NQT (Foundation vs Advanced) and what are the qualifying cutoffs?",
  "tcs nqt": "What are the sections in TCS NQT (Foundation vs Advanced) and what are the qualifying cutoffs?",
  "cognizant": "What are the test stages for Cognizant GenC and GenC Elevate, and how is the communication round evaluated?",
  "cognizant rounds": "What are the test stages for Cognizant GenC and GenC Elevate, and how is the communication round evaluated?",
  "infosys": "Explain the Infosys online test structure, especially the puzzle-solving and reasoning sections.",
  "wipro": "What is the latest exam pattern for Wipro Elite NLTH, and what coding topics are tested?",
  "price": "What is included in Blync Pro for ₹49/month and how does it help me pass campus placements?",
  "pricing": "What is included in Blync Pro for ₹49/month and how does it help me pass campus placements?",
  "pro": "What features and games are unlocked when I subscribe to Blync Pro for ₹49/month?",
  "free": "Are any games free to play on Blync, and what practice materials are available?",
  "games": "Which 26+ cognitive, memory, and aptitude games are available on Blync?",
  "all games": "Give me a full breakdown of the 26+ games on Blync categorized by placement relevance.",
};

export async function optimizePrompt(rawInput: string, groqApiKey?: string): Promise<OptimizeResult> {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      optimizedPrompt: "What games are on Blync and how can I prepare for placement rounds?",
      category: "general"
    };
  }

  const lower = trimmed.toLowerCase();

  // Instant dictionary match
  if (COMMON_REWRITES[lower]) {
    return {
      optimizedPrompt: COMMON_REWRITES[lower],
      category: "rule-match"
    };
  }

  // If Groq key is available, run a micro-prompt via Groq for custom rewrite
  if (groqApiKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "You are a prompt enhancer for Blync, an Indian campus placement cognitive test prep platform. Rewrite the user's prompt to be a razor-sharp, articulate question about campus placement tests, cognitive games (Switch, Digit, Grid, Motion), or platform prep. Output ONLY the rewritten prompt without quotes, explanations, or prefixes. Keep it under 25 words."
            },
            {
              role: "user",
              content: trimmed
            }
          ],
          max_tokens: 60,
          temperature: 0.3,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rewritten = data.choices?.[0]?.message?.content?.trim();
        if (rewritten && rewritten.length > 5) {
          return {
            optimizedPrompt: rewritten.replace(/^["']|["']$/g, ""),
            category: "ai-groq"
          };
        }
      }
    } catch {
      // Fallback below
    }
  }

  // Smart heuristic expansion
  if (lower.includes("switch")) {
    return {
      optimizedPrompt: `What is the optimal strategy and sequence logic to solve the Switch Challenge under exam pressure?`,
      category: "heuristic"
    };
  }
  if (lower.includes("digit")) {
    return {
      optimizedPrompt: `What are the step-by-step arithmetic shortcuts to beat the target in the Digit Challenge?`,
      category: "heuristic"
    };
  }
  if (lower.includes("grid")) {
    return {
      optimizedPrompt: `How do I train my spatial memory and symmetry judgment for the Grid Challenge?`,
      category: "heuristic"
    };
  }
  if (lower.includes("motion")) {
    return {
      optimizedPrompt: `How do I calculate shortest bounce paths in the Motion Challenge without wasting moves?`,
      category: "heuristic"
    };
  }
  if (lower.includes("round") || lower.includes("company") || lower.includes("placement")) {
    return {
      optimizedPrompt: `Explain the full round structure, elimination criteria, and how Blync cognitive games map to this company's test.`,
      category: "heuristic"
    };
  }

  return {
    optimizedPrompt: `How can I practice and master "${trimmed}" to maximize my placement test scores on Blync?`,
    category: "expanded"
  };
}

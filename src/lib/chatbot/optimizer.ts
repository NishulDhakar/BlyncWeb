/**
 * Blync AI Prompt Optimizer
 * Transforms rough user inputs into high-precision, placement-focused queries.
 */

interface OptimizeResult {
  optimizedPrompt: string;
  category: string;
}

const COMMON_REWRITES: Record<string, string> = {
  "switch": "What is the winning strategy for the Capgemini Switch Challenge?",
  "switch challenge": "What is the winning strategy for the Capgemini Switch Challenge?",
  "digit": "What are the fastest calculation tricks for Digit Challenge?",
  "digit challenge": "What are the fastest calculation tricks for Digit Challenge?",
  "grid": "What are the best tips to clear Capgemini Grid Challenge?",
  "grid challenge": "What are the best tips to clear Capgemini Grid Challenge?",
  "motion": "How to solve the Motion Challenge in minimum moves?",
  "motion challenge": "How to solve the Motion Challenge in minimum moves?",
  "capgemini": "What are the rounds and game tests in Capgemini recruitment?",
  "capgemini rounds": "What are the rounds and game tests in Capgemini recruitment?",
  "accenture": "What is the assessment pattern for Accenture recruitment?",
  "accenture rounds": "What is the assessment pattern for Accenture recruitment?",
  "tcs": "What are the test sections and pattern for TCS NQT?",
  "tcs nqt": "What are the test sections and pattern for TCS NQT?",
  "cognizant": "What is the recruitment assessment pattern for Cognizant?",
  "cognizant rounds": "What is the recruitment assessment pattern for Cognizant?",
  "infosys": "What is the online test structure for Infosys recruitment?",
  "wipro": "What is the exam pattern for Wipro Elite recruitment?",
  "price": "What is included in Blync Pro for ₹49/month?",
  "pricing": "What is included in Blync Pro for ₹49/month?",
  "pro": "What features are unlocked with Blync Pro (₹49/month)?",
  "free": "Are any games free on Blync, and what can I access?",
  "games": "Which cognitive and aptitude games are available on Blync?",
  "all games": "Which cognitive and aptitude games are available on Blync?",
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
          model: "qwen/qwen3.8-27b",
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

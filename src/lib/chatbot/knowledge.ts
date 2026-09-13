/**
 * Blync AI Knowledge Base & RAG Retrieval Engine
 * Strictly grounds the chatbot on platform features, games, pricing, and corporate recruitment rounds.
 */

export interface KnowledgeItem {
  id: string;
  category: "platform" | "game" | "pricing" | "company_round" | "tips";
  keywords: string[];
  title: string;
  content: string;
}

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  // ─── PLATFORM OVERVIEW ─────────────────────────────────────────────────────
  {
    id: "platform-overview",
    category: "platform",
    keywords: ["blync", "platform", "what is", "about", "features", "website", "who are you"],
    title: "About Blync",
    content: `Blync is India's premier cognitive aptitude and game-based assessment preparation platform.
Built specifically to help engineering and college students crack gamified aptitude tests conducted by top IT & product companies like Capgemini, Cognizant, Accenture, and TCS.
Features:
- 26+ interactive games across Cognitive, Memory, Brain, Quiz, and Communication categories.
- Real exam-mode timers and official test simulations (e.g. Capgemini Switch Challenge, Digit Challenge).
- Step-by-step solution breakdowns and algorithmic logic explanations.
- Cognitive performance trajectory tracking, speed analytics, and percentile scoring.
- Global competitive leaderboards.
- Detailed rulebooks and free strategy guides for all games.`
  },

  // ─── PRICING & SUBSCRIPTION (STRICT GROUNDING) ─────────────────────────────
  {
    id: "pricing-pro",
    category: "pricing",
    keywords: ["price", "cost", "pro", "plan", "free", "subscription", "buy", "pay", "49", "₹49", "rupees"],
    title: "Blync Pricing & Blync Pro",
    content: `Pricing Policy (Strict & Factual):
- Blync Pro costs exactly ₹49 / month (all-inclusive).
- Are there free games to play? NO. All 26+ interactive games, mock tests, and practice simulators require Blync Pro.
- What is free on Blync? Reading comprehensive game rulebooks, strategic walkthroughs, placement guides at /rules/*, and public leaderboards.
- What does Blync Pro (₹49/month) unlock?
  1. Instant access to all 26+ cognitive & brain games.
  2. Unlimited practice sessions with real exam-style countdown timers.
  3. Official step-by-step solution explanations and logic breakdowns.
  4. Accuracy and response-time trajectory analytics.
  5. Global competitive leaderboard ranking.
- How to upgrade: Visit /pricing to subscribe via UPI, NetBanking, or Cards.`
  },

  // ─── CAPGEMINI GAME-BASED ROUND (CRITICAL RAG) ─────────────────────────────
  {
    id: "company-capgemini",
    category: "company_round",
    keywords: ["capgemini", "capg", "game round", "assessment", "selection process", "hiring pattern"],
    title: "Capgemini Recruitment Process & Game-Based Assessment",
    content: `Capgemini Recruitment Process (4 Stages):
1. Technical Assessment:
   - Pseudocode Round (30 questions, 30 minutes) - Bitwise operators, looping, arrays, recursion.
   - English Communication Assessment (30 questions, 30 minutes) - Grammar, sentence correction, reading comprehension.
2. Game-Based Cognitive Assessment (Elimination Round!):
   - 4 games randomly assigned out of 6 standard games:
     a) Switch Challenge (Logical deductive sequencing)
     b) Digit Challenge (Mental math target calculation with operators)
     c) Grid Challenge (Working memory + spatial rotation)
     d) Motion Challenge (Shortest path obstacle ball rolling)
     e) Inductive Reasoning Challenge (Pattern completion from matrix)
     f) Deductive Reasoning Challenge (Sudoku-style grid deduction)
   - Duration: ~24 to 30 minutes (5-6 minutes per game).
   - Blync maps to 100% of these 6 games!
3. Spoken English Assessment (AI-Based):
   - AI-driven speech evaluation (reading aloud, repeating sentences, speech grammar).
4. Technical & HR Interview:
   - Final evaluation of project work, core CS fundamentals, and culture fit.`
  },

  // ─── CAPGEMINI GAMES BREAKDOWN ON BLYNC ────────────────────────────────────
  {
    id: "game-switch-challenge",
    category: "game",
    keywords: ["switch", "switch challenge", "symbols", "operators", "funnel"],
    title: "Switch Challenge (Capgemini)",
    content: `Switch Challenge on Blync:
- Objective: Decode a 4-digit transposition/operator code that transforms an initial set of 4 shapes/symbols into a target set.
- Skill Tested: Logical deduction, pattern transposition, working memory under pressure.
- Pro Tip: Compare the initial sequence and final sequence position-by-position. Eliminate impossible operator branches immediately rather than testing all permutations.
- Practice on Blync: Full exam simulator with timed levels available in Blync Pro.`
  },
  {
    id: "game-digit-challenge",
    category: "game",
    keywords: ["digit", "digit challenge", "numbers", "math", "target sum"],
    title: "Digit Challenge (Capgemini)",
    content: `Digit Challenge on Blync:
- Objective: Reach a target number using available digits (1-9) and mathematical operators (+, -, ×, /) within strict time limits.
- Skill Tested: Quantitative speed, mental arithmetic, computational agility.
- Pro Tip: Work backwards from the target number. If target is large, look for multiplication anchors first.
- Practice on Blync: Timed interactive challenges available in Blync Pro.`
  },
  {
    id: "game-grid-challenge",
    category: "game",
    keywords: ["grid", "grid challenge", "dots", "symmetry", "spatial"],
    title: "Grid Challenge (Capgemini)",
    content: `Grid Challenge on Blync:
- Objective: Memorize dot sequences while simultaneously judging whether alternating geometric shapes are symmetrical.
- Skill Tested: Dual-task working memory, spatial orientation, cognitive load endurance.
- Pro Tip: Verbalize the dot positions in your head (e.g., 'top-right, center, bottom-left') while quickly glancing at the symmetry test.
- Practice on Blync: Full simulator included in Blync Pro.`
  },
  {
    id: "game-motion-challenge",
    category: "game",
    keywords: ["motion", "motion challenge", "ball", "maze", "obstacles", "steps"],
    title: "Motion Challenge (Capgemini)",
    content: `Motion Challenge on Blync:
- Objective: Guide a ball through an obstacle maze to a goal hole in the MINIMUM number of moves.
- Skill Tested: Spatial planning, prospective problem solving, impulse inhibition.
- Pro Tip: Do not slide on instinct. Trace the rebound trajectory backward from the goal before making your first swipe.
- Practice on Blync: Available in Blync Pro.`
  },
  {
    id: "game-inductive-deductive",
    category: "game",
    keywords: ["inductive", "deductive", "reasoning", "matrix", "patterns"],
    title: "Inductive & Deductive Reasoning Challenges",
    content: `Inductive & Deductive Challenges on Blync:
- Inductive: Identify evolving geometric rules across 3x3 matrices (rotation, shading, number of sides).
- Deductive: Fill grids where no symbol or digit repeats in any row or column (Mini-Sudoku logic).
- Tested By: Capgemini, Cognizant, Accenture, SHL, Aon Hewitt.
- Practice on Blync: Both challenges available with complete solution steps in Blync Pro.`
  },

  // ─── ACCENTURE RECRUITMENT ROUNDS ──────────────────────────────────────────
  {
    id: "company-accenture",
    category: "company_round",
    keywords: ["accenture", "accenture rounds", "cognitive", "technical", "versant"],
    title: "Accenture Recruitment Process",
    content: `Accenture Selection Process (4 Stages):
1. Cognitive & Technical Assessment (90 Questions, 90 Minutes):
   - Cognitive: English Ability (17 Qs), Critical Thinking & Problem Solving (18 Qs), Abstract Reasoning (15 Qs).
   - Technical: Common Application & MS Office (12 Qs), Pseudocode (18 Qs), Fundamentals of Cloud & Network Security (10 Qs).
   - Elimination Round: Immediate score calculation determines eligibility for Coding.
2. Coding Assessment (45 Minutes, 2 Questions):
   - Languages allowed: C, C++, Java, Python, .NET. Questions focus on arrays, strings, and hash maps.
3. AI Communication Assessment (Versant / Aspiring Minds):
   - 20 minutes testing pronunciation, fluency, sentence mastery, vocabulary, and story retelling.
4. Technical & HR Combined Interview:
   - Behavioral questions based on STAR methodology and technical discussion on projects.`
  },

  // ─── TCS RECRUITMENT ROUNDS (NQT / DIGITAL / PRIME) ────────────────────────
  {
    id: "company-tcs",
    category: "company_round",
    keywords: ["tcs", "nqt", "digital", "prime", "ninja", "tcs rounds"],
    title: "TCS NQT / Digital / Prime Assessment Pattern",
    content: `TCS Recruitment Structure (NQT Pattern):
1. Foundation Section (75 Minutes, 65 Questions):
   - Numerical Ability (20 Qs, 25 mins)
   - Verbal Ability (25 Qs, 25 mins)
   - Reasoning Ability (20 Qs, 25 mins)
2. Advanced Section (For Digital & Prime roles - 40 Minutes):
   - Advanced Quantitative (10-15 Qs)
   - Advanced Reasoning (10-15 Qs)
3. Advanced Coding (90 Minutes, 2 Problems):
   - Problem 1: Basic to medium DSA (strings/arrays).
   - Problem 2: Medium to hard DSA (graphs, dynamic programming, trees).
4. Interviews:
   - Technical, Managerial, and HR rounds.`
  },

  // ─── COGNIZANT (GENC / ELEVATE / NEXT) ──────────────────────────────────────
  {
    id: "company-cognizant",
    category: "company_round",
    keywords: ["cognizant", "genc", "genc next", "genc elevate", "cts"],
    title: "Cognizant Recruitment Process",
    content: `Cognizant Recruitment Process:
1. Communication Assessment (Amcat Voice / AI Speech Analyzer):
   - Sentence completion, listening comprehension, fluency.
2. Aptitude & Reasoning Assessment:
   - Quantitative, Logical Reasoning, and English Comprehension.
3. Skill-Based Assessment / Coding:
   - GenC: Foundational coding & debugging.
   - GenC Next / Elevate: Advanced DSA, SQL, DBMS, web/cloud problem solving.
4. Technical & HR Interview:
   - Resume review, project architecture, problem-solving mindset.`
  },

  // ─── INFOSYS RECRUITMENT ROUNDS ───────────────────────────────────────────
  {
    id: "company-infosys",
    category: "company_round",
    keywords: ["infosys", "infy", "specialist programmer", "digital specialist engineer", "dse"],
    title: "Infosys Selection Process",
    content: `Infosys Assessment Process:
1. Online Test (5 Sections, 100 Minutes, 54 Questions):
   - Reasoning Ability (15 Qs, 25 mins) - Syllogisms, data sufficiency, visual puzzles.
   - Mathematical Ability (10 Qs, 35 mins) - Permutations, probability, speed & distance.
   - Verbal Ability (20 Qs, 20 mins) - Sentence correction, comprehension.
   - Pseudocode (5 Qs, 10 mins).
   - Puzzle Solving (4 Qs, 10 mins) - Gamified reasoning and visual logic tests.
2. Technical & HR Interview:
   - Coding, OOPs, DBMS, project discussion.`
  },

  // ─── WIPRO RECRUITMENT ROUNDS ─────────────────────────────────────────────
  {
    id: "company-wipro",
    category: "company_round",
    keywords: ["wipro", "elite", "turbo", "nlth"],
    title: "Wipro Elite NLTH Selection Process",
    content: `Wipro Elite NLTH Assessment (3 Sections, 128 Minutes):
1. Aptitude Test (48 mins):
   - Quantitative, Logical, and Verbal Ability.
2. Written Communication Test (20 mins):
   - Essay writing (evaluated on grammar, structure, vocabulary, and coherence).
3. Online Programming Test (60 mins):
   - 2 coding problems in C/C++/Java/Python.
4. Technical & HR Interview.`
  },

  // ─── AMAZON & PRODUCT COMPANIES ───────────────────────────────────────────
  {
    id: "company-amazon",
    category: "company_round",
    keywords: ["amazon", "product", "faang", "oa", "online assessment", "work simulation"],
    title: "Amazon & Product Company Assessment Rounds",
    content: `Amazon Software Engineer Online Assessment (3 Parts):
1. OA1: Code Debugging / Reasoning (Find and fix bugs in given code under 20 mins).
2. OA2: Coding & Work Simulation (2 DSA problems in 70 mins + Amazon Work Simulation).
3. OA3: Work Style Assessment (Evaluation of Amazon's 16 Leadership Principles).
4. Technical Virtual Onsite Rounds:
   - Data structures, system design, LP behavioral questions.`
  },

  // ─── BLYNC COMPLETE GAMES CATALOG ─────────────────────────────────────────
  {
    id: "all-games-catalog",
    category: "game",
    keywords: ["all games", "list games", "games catalog", "how many games", "26"],
    title: "Blync Complete 26+ Games Catalog",
    content: `All Games Available on Blync (Unlocked via Blync Pro):
1. Cognitive Placement Games:
   - Switch Challenge (Capgemini)
   - Digit Challenge (Capgemini)
   - Grid Challenge (Capgemini)
   - Motion Challenge (Capgemini)
   - Inductive Reasoning
   - Deductive Reasoning
   - Spacio Challenge
2. Memory & Brain Agility Games:
   - Memory Match Pairs
   - Recall Challenge
   - Memory Challenge
   - 15-Puzzle
   - Sudoku
   - Minesweeper
   - Snake
   - Ant Smasher
   - Dice Roller
   - Tic Tac Toe
3. Assessment & Quizzes:
   - Comprehensive IQ Test & Cognitive Breakdown
   - Logical Reasoning Quizzes
   - Placement Aptitude Simulators`
  }
];

/**
 * Fast keyword-based RAG retriever
 */
export function retrieveKnowledge(query: string, maxItems: number = 3): KnowledgeItem[] {
  const normalizedQuery = query.toLowerCase();
  const tokens = normalizedQuery.split(/[\s,?.!]+/).filter(t => t.length > 2);

  const scored = KNOWLEDGE_BASE.map(item => {
    let score = 0;
    
    // Check keyword matches
    for (const kw of item.keywords) {
      if (normalizedQuery.includes(kw.toLowerCase())) {
        score += 8;
      }
    }

    // Check token overlap
    for (const token of tokens) {
      if (item.title.toLowerCase().includes(token)) {
        score += 5;
      }
      if (item.content.toLowerCase().includes(token)) {
        score += 2;
      }
    }

    // Boost company queries
    if (
      (normalizedQuery.includes("capgemini") && item.id.includes("capgemini")) ||
      (normalizedQuery.includes("accenture") && item.id.includes("accenture")) ||
      (normalizedQuery.includes("tcs") && item.id.includes("tcs")) ||
      (normalizedQuery.includes("cognizant") && item.id.includes("cognizant")) ||
      (normalizedQuery.includes("infosys") && item.id.includes("infosys")) ||
      (normalizedQuery.includes("wipro") && item.id.includes("wipro")) ||
      (normalizedQuery.includes("amazon") && item.id.includes("amazon"))
    ) {
      score += 20;
    }

    // Boost pricing queries
    if (
      (normalizedQuery.includes("price") || normalizedQuery.includes("cost") || normalizedQuery.includes("pro") || normalizedQuery.includes("free")) &&
      item.id === "pricing-pro"
    ) {
      score += 25;
    }

    return { item, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map(s => s.item);
}

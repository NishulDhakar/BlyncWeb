import type { CompanySlug, GameCategory, GameDefinition } from "./types";

/**
 * THE GAME REGISTRY — single source of truth.
 *
 * Adding a game means:
 *   1. one entry here,
 *   2. a module folder at src/games/<slug>/,
 *   3. a lazy entry in src/games/loaders.ts.
 *
 * Everything else derives from this array: the /games hubs, the SEO landing
 * pages at /games/<category>/<slug>, sitemap.xml, JSON-LD, the footer link
 * blocks, and the "more challenges" nav inside GameShell. Nothing about a game
 * should be hardcoded anywhere else.
 *
 * SEO note: `seo.keywords[0]` is the primary target for the page. It is what
 * lands in the H1, the <title>, and the opening sentence, so keep it the exact
 * phrase people search — not a paraphrase.
 */
const RAW_GAMES: readonly GameDefinition[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // CAPGEMINI — cognitive game-based aptitude round
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: "switch-challenge",
    name: "Switch Challenge",
    category: "cognitive",
    company: "capgemini",
    kind: "react",
    tagline: "Work out which operator turned the input row into the output row.",
    difficulty: "medium",
    duration: "3-5 min",
    skills: ["Cognitive flexibility", "Working memory", "Rule inference"],
    hasRulesPage: true,
    seo: {
      headline: "Switch Challenge — Free Capgemini Game-Based Aptitude Practice",
      description:
        "Practice the Capgemini Switch Challenge free online. Deduce the operator that maps each input row to its output, with real 3-minute exam timing. No signup, unlimited attempts.",
      keywords: [
        "capgemini switch challenge",
        "switch challenge practice",
        "capgemini game based aptitude test",
        "cognitive flexibility game online free",
      ],
      related: ["shape-switch-challenge", "digit-challenge", "deductive-challenge"],
      faq: [
        {
          question: "What is the Switch Challenge in the Capgemini assessment?",
          answer:
            "You are shown an input row of symbols and an output row. One or two hidden operators rearranged the input. You pick the operator that produced the output. Later levels stack two operators and widen the row from four symbols to five.",
        },
        {
          question: "How long is the Switch Challenge round?",
          answer:
            "Roughly three minutes in total, with about 20 seconds per question. Our practice session uses the same budget so the pacing matches the real round.",
        },
        {
          question: "How do I get faster at Switch Challenge questions?",
          answer:
            "Read the operator as a mapping, not a number: '3241' means the first output slot takes the third input symbol. Check one position rather than rebuilding the whole row, and you can eliminate most options in a single glance.",
        },
      ],
    },
  },
  {
    slug: "shape-switch-challenge",
    name: "Shape Switch Challenge",
    category: "cognitive",
    company: "capgemini",
    kind: "react",
    tagline: "The funnel-and-shapes variant of Switch, as it appears in newer papers.",
    difficulty: "easy",
    duration: "1-3 min",
    skills: ["Cognitive flexibility", "Visual mapping", "Speed"],
    seo: {
      headline: "Shape Switch Challenge — Capgemini Switch Round 2 Practice",
      description:
        "Practice the shape-based Switch Challenge used in recent Capgemini and Cognizant papers. Pick the operator that funnels the input shapes into the output row. Free, no download.",
      keywords: [
        "capgemini switch challenge round 2",
        "shape switch challenge",
        "switch challenge shapes operator",
        "capgemini gaming round practice",
      ],
      related: ["switch-challenge", "quick-math", "grid-challenge"],
      faq: [
        {
          question: "How is the shape variant different from the classic Switch Challenge?",
          answer:
            "The logic is identical — a permutation operator maps input positions to output positions. Only the presentation changes: coloured shapes travel through a funnel instead of letters sitting in a row, which makes position tracking harder under time pressure.",
        },
        {
          question: "What does an operator like 3241 mean?",
          answer:
            "Each digit says where that output slot's shape came from. '3241' fills output slot 1 from input 3, slot 2 from input 2, slot 3 from input 4, and slot 4 from input 1.",
        },
      ],
    },
  },
  {
    slug: "digit-challenge",
    name: "Digit Challenge",
    category: "cognitive",
    company: "capgemini",
    kind: "react",
    tagline: "Build the target value using each supplied digit exactly once.",
    difficulty: "medium",
    duration: "3-5 min",
    skills: ["Numerical reasoning", "Mental arithmetic", "Planning"],
    hasRulesPage: true,
    seo: {
      headline: "Digit Challenge — Free Capgemini Number Reasoning Practice",
      description:
        "Solve Digit Challenge number puzzles from the Capgemini and Cognizant aptitude rounds. Reach the target using each digit once, against the clock. Free online practice, no signup.",
      keywords: [
        "capgemini digit challenge",
        "digit challenge practice",
        "number sequence game aptitude",
        "capgemini numerical reasoning test",
      ],
      related: ["quick-math", "bubble-math", "switch-challenge"],
      faq: [
        {
          question: "What does the Digit Challenge test?",
          answer:
            "Mental arithmetic under time pressure, plus the planning needed to pick an order of operations that reaches the target. It is the numerical half of the Capgemini cognitive battery.",
        },
        {
          question: "Can I use a digit twice?",
          answer:
            "No. Every digit shown must be used exactly once, which is what makes the puzzle a search problem rather than plain arithmetic.",
        },
      ],
    },
  },
  {
    slug: "grid-challenge",
    name: "Grid Challenge",
    category: "cognitive",
    company: "capgemini",
    kind: "react",
    tagline: "Memorise blinking dots, answer a symmetry question, then recall the order.",
    difficulty: "hard",
    duration: "3-5 min",
    skills: ["Spatial memory", "Attention switching", "Symmetry detection"],
    hasRulesPage: true,
    seo: {
      headline: "Grid Challenge — Free Capgemini Spatial Memory Practice",
      description:
        "Practice the Capgemini Grid Challenge free online. Memorise blinking dot positions, judge mirror symmetry between two grids, then recall the dots in order. Dual-task memory training.",
      keywords: [
        "capgemini grid challenge",
        "grid challenge test",
        "grid challenge practice online",
        "spatial reasoning game free",
      ],
      related: ["grid-puzzle", "motion-challenge", "inductive-challenge"],
      faq: [
        {
          question: "Why does the Grid Challenge interrupt me with a symmetry question?",
          answer:
            "That is the point of the test. Holding a dot sequence in working memory while solving an unrelated visual problem measures interference resistance, which is what employers are screening for.",
        },
        {
          question: "How many dots do I need to remember?",
          answer:
            "It starts at three and grows to eight as levels advance, while the display time shrinks from two seconds to under one.",
        },
      ],
    },
  },
  {
    slug: "motion-challenge",
    name: "Motion Challenge",
    category: "cognitive",
    company: "capgemini",
    kind: "react",
    tagline: "Slide blocks clear of the exit path without breaking the movement rules.",
    difficulty: "hard",
    duration: "5-10 min",
    skills: ["Spatial planning", "Sequencing", "Forward search"],
    hasRulesPage: true,
    seo: {
      headline: "Motion Challenge — Free Capgemini Spatial Planning Practice",
      description:
        "Practice the Capgemini Motion Challenge free online. Move each block along its permitted axis to clear a route to the exit in as few moves as possible. Free puzzle practice, no download.",
      keywords: [
        "capgemini motion challenge",
        "motion challenge practice",
        "capgemini game based aptitude motion",
        "block sliding puzzle aptitude test",
      ],
      related: ["motion-challenge-advanced", "path-finder", "grid-challenge"],
      faq: [
        {
          question: "What is the Motion Challenge asking me to do?",
          answer:
            "Each piece can only travel along a fixed axis. You clear a path to the exit by moving obstructing pieces out of the way, in an order that does not create a new blockage.",
        },
        {
          question: "Is there a move limit?",
          answer:
            "Levels have a target move count. You can exceed it, but the score rewards solutions that hit the target, which is how the real assessment separates planners from trial-and-error solvers.",
        },
      ],
    },
  },
  {
    slug: "motion-challenge-advanced",
    name: "Motion Challenge — Advanced Rounds",
    category: "cognitive",
    company: "capgemini",
    kind: "react",
    tagline: "The extended Motion Challenge ladder: more pieces, tighter move budgets.",
    difficulty: "hard",
    duration: "10-20 min",
    skills: ["Spatial planning", "Multi-step lookahead", "Constraint reasoning"],
    seo: {
      headline: "Motion Challenge Advanced Rounds — Hard Capgemini Puzzle Practice",
      description:
        "Play the advanced Motion Challenge rounds used in later Capgemini assessment stages. More pieces, mixed movement axes, and tighter move budgets than the standard round. Free practice.",
      keywords: [
        "capgemini motion challenge advanced",
        "motion challenge hard levels",
        "capgemini gaming round difficult questions",
        "block puzzle aptitude practice",
      ],
      related: ["motion-challenge", "key-and-door", "path-finder"],
      faq: [
        {
          question: "How do the advanced rounds differ from the standard Motion Challenge?",
          answer:
            "More pieces on a larger board, a mix of horizontal-only, vertical-only and free-moving blocks, and move targets tight enough that a greedy first move usually fails.",
        },
      ],
    },
  },
  {
    slug: "deductive-challenge",
    name: "Deductive Challenge",
    category: "cognitive",
    company: "capgemini",
    kind: "react",
    tagline: "Fill the blank so no symbol repeats in its row or column.",
    difficulty: "medium",
    duration: "3-5 min",
    skills: ["Deductive reasoning", "Elimination", "Constraint checking"],
    hasRulesPage: true,
    seo: {
      headline: "Deductive Challenge — Free Capgemini Logical Reasoning Practice",
      description:
        "Practice Capgemini Deductive Challenge puzzles free online. Work out the missing symbol in a Latin-square grid where no row or column may repeat. Timed logical reasoning practice.",
      keywords: [
        "capgemini deductive challenge",
        "deductive challenge practice",
        "capgemini logical reasoning test",
        "latin square logic puzzle aptitude",
      ],
      related: ["gap-challenge", "inductive-challenge", "grid-puzzle"],
      faq: [
        {
          question: "What rule governs the Deductive Challenge grid?",
          answer:
            "It is a Latin square: every symbol appears exactly once in each row and each column. The target cell has exactly one symbol that satisfies both constraints.",
        },
        {
          question: "How do I solve it quickly?",
          answer:
            "Scan the target's row and column, list which symbols already appear, and the answer is whatever is left. With a 3x3 or 4x4 grid that is faster than reasoning about the grid as a whole.",
        },
      ],
    },
  },
  // {
  //   slug: "gap-challenge",
  //   name: "Gap Challenge",
  //   category: "cognitive",
  //   company: "capgemini",
  //   kind: "react",
  //   tagline: "Multiple blanks, one unique solution — the harder deductive round.",
  //   difficulty: "hard",
  //   duration: "3-5 min",
  //   skills: ["Deductive reasoning", "Constraint propagation", "Elimination"],
  //   seo: {
  //     headline: "Gap Challenge — Capgemini Deductive Round 2 Practice Free",
  //     description:
  //       "Practice the Capgemini Gap Challenge, the harder deductive round with several blanks per grid and only one consistent answer. Free timed logic practice with 3x3 to 5x5 grids.",
  //     keywords: [
  //       "capgemini gap challenge",
  //       "gap challenge deductive round",
  //       "capgemini deductive challenge hard",
  //       "logic grid puzzle placement test",
  //     ],
  //     related: ["deductive-challenge", "inductive-challenge", "quick-math"],
  //     faq: [
  //       {
  //         question: "How is Gap Challenge harder than the Deductive Challenge?",
  //         answer:
  //           "Several cells are hidden at once, including cells in the target's own row and column. You cannot read the answer straight off the visible symbols; you have to propagate constraints from elsewhere in the grid.",
  //       },
  //       {
  //         question: "Is every Gap Challenge puzzle solvable without guessing?",
  //         answer:
  //           "Yes. Each generated grid is verified to have exactly one symbol consistent with the visible clues before it is shown, so guessing is never required.",
  //       },
  //     ],
  //   },
  // },
  // {
  //   slug: "quick-math",
  //   name: "Quick Math",
  //   category: "cognitive",
  //   company: "capgemini",
  //   kind: "react",
  //   tagline: "Fill the missing digits so the equation balances, before the clock runs out.",
  //   difficulty: "medium",
  //   duration: "3-5 min",
  //   skills: ["Mental arithmetic", "Speed", "Numerical reasoning"],
  //   seo: {
  //     headline: "Quick Math — Free Capgemini Numerical Speed Test Practice",
  //     description:
  //       "Practice the Capgemini Quick Math round free online. Fill the missing digits so each equation balances, against a timer that tightens every level. Free mental arithmetic training.",
  //     keywords: [
  //       "capgemini quick math",
  //       "quick math aptitude game",
  //       "capgemini numerical speed test",
  //       "mental maths practice for placements",
  //     ],
  //     related: ["digit-challenge", "bubble-math", "gap-challenge"],
  //     faq: [
  //       {
  //         question: "What operators appear in Quick Math?",
  //         answer:
  //           "Addition only for the first two levels, addition and subtraction to level five, then multiplication joins from level six. The number ceiling rises with the level as well.",
  //       },
  //       {
  //         question: "How much time do I get per equation?",
  //         answer:
  //           "Thirty seconds at level one, dropping by a second each level to a floor of ten seconds.",
  //       },
  //     ],
  //   },
  // },

  // ══════════════════════════════════════════════════════════════════════════
  // ACCENTURE — cognitive and technical assessment
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: "bubble-math",
    name: "Bubble Math",
    category: "cognitive",
    company: "accenture",
    kind: "react",
    tagline: "Pop the expression bubbles in value order, ascending or descending.",
    difficulty: "medium",
    duration: "3-5 min",
    skills: ["Mental arithmetic", "Ordering", "Working memory"],
    seo: {
      headline: "Bubble Math — Free Accenture Cognitive Game Practice",
      description:
        "Practice the Accenture Bubble Math game free online. Evaluate every bubble, then pop them in ascending or descending order before the timer expires. Free numerical reasoning practice.",
      keywords: [
        "accenture bubble math",
        "accenture cognitive games practice",
        "bubble math aptitude game",
        "accenture game based assessment",
      ],
      related: ["quick-math", "digit-challenge", "grid-puzzle"],
      faq: [
        {
          question: "What makes Bubble Math harder than plain arithmetic?",
          answer:
            "You have to evaluate every bubble before you can safely click the first one, and hold all the results in memory while you order them. Later levels add decimals and negative values, so sign errors become the main failure mode.",
        },
        {
          question: "Does the ordering direction change?",
          answer:
            "Yes, ascending or descending is chosen at random each round, so you cannot rely on muscle memory from the previous one.",
        },
      ],
    },
  },
  {
    slug: "grid-puzzle",
    name: "Grid Puzzle",
    category: "memory",
    company: "accenture",
    kind: "react",
    tagline: "Track blinking dots while symmetry questions interrupt you.",
    difficulty: "hard",
    duration: "5-10 min",
    skills: ["Visual memory", "Interference resistance", "Symmetry detection"],
    seo: {
      headline: "Grid Puzzle — Free Accenture Visual Memory Game Practice",
      description:
        "Practice the Accenture Grid Puzzle free online. Remember each blinking dot, answer a mirror-symmetry question between every dot, then recall the full sequence in order.",
      keywords: [
        "accenture grid puzzle",
        "accenture memory game test",
        "visual memory game online free",
        "accenture cognitive assessment practice",
      ],
      related: ["grid-challenge", "bubble-math", "key-and-door"],
      faq: [
        {
          question: "How many dots does Grid Puzzle ask me to remember?",
          answer:
            "Three at the start, rising to eight, with a symmetry question inserted between each one so you cannot rehearse the sequence.",
        },
        {
          question: "Do wrong symmetry answers end the game?",
          answer:
            "No. Symmetry answers affect your score, but only recall errors cost a life. Losing all three lives ends the session.",
        },
      ],
    },
  },
  {
    slug: "path-finder",
    name: "Path Finder",
    category: "cognitive",
    company: "accenture",
    kind: "react",
    tagline: "Plan the whole route before you run it — one shot, no corrections.",
    difficulty: "hard",
    duration: "5-10 min",
    skills: ["Route planning", "Sequencing", "Mental simulation"],
    seo: {
      headline: "Path Finder — Free Accenture Route Planning Game Practice",
      description:
        "Practice the Accenture Path Finder game free online. Plan a complete route across the grid, then watch it execute — you cannot correct it mid-run. Free spatial planning practice.",
      keywords: [
        "accenture path finder game",
        "path finder aptitude test",
        "accenture cognitive games online",
        "route planning puzzle practice",
      ],
      related: ["key-and-door", "motion-challenge", "grid-puzzle"],
      faq: [
        {
          question: "Why can I not adjust the path while it runs?",
          answer:
            "That is the assessment's design. Committing to a full plan before execution is what separates candidates who simulate ahead from those who correct as they go.",
        },
        {
          question: "How large do the grids get?",
          answer:
            "Three by three to start, then six by six and nine by nine as you clear levels.",
        },
      ],
    },
  },
  {
    slug: "key-and-door",
    name: "Key & Door",
    category: "cognitive",
    company: "accenture",
    kind: "react",
    tagline: "Collect keys and reach the exit through one-way, lockable doors.",
    difficulty: "hard",
    duration: "5-10 min",
    skills: ["Logical planning", "Constraint reasoning", "Backtracking"],
    seo: {
      headline: "Key & Door — Free Accenture Logic Puzzle Practice Online",
      description:
        "Practice the Accenture Key and Door logic puzzle free online. Collect every key and reach the exit through directional, lockable doors. Free constraint reasoning practice, no signup.",
      keywords: [
        "accenture key and door game",
        "key and door puzzle test",
        "accenture logical reasoning game",
        "grid logic puzzle placement practice",
      ],
      related: ["path-finder", "motion-challenge-advanced", "gap-challenge"],
      faq: [
        {
          question: "What makes the doors tricky?",
          answer:
            "They are directional. A door you walked through may not let you back, so an order that collects both keys can still strand you away from the exit.",
        },
        {
          question: "Is there an assessment mode?",
          answer:
            "Yes. Practice mode lets you retry a board freely; assessment mode scores your first attempt, matching the real round.",
        },
      ],
    },
  },
  {
    slug: "accenture-technical-quiz",
    name: "Accenture Technical Assessment Quiz",
    category: "quiz",
    company: "accenture",
    kind: "html",
    htmlFolder: "accenture-technical",
    tagline: "150 scenario questions across 10 sections, with a 45-minute timer.",
    difficulty: "hard",
    duration: "45 min",
    skills: ["Technical fundamentals", "Networking", "Databases", "Cloud", "Security"],
    seo: {
      headline: "Accenture Technical Assessment Quiz — 150 Free Practice Questions",
      description:
        "Attempt a full 150-question Accenture technical assessment free online. Ten sections, a 45-minute timer, instant explanations, and a section-wise answer key. No signup required.",
      keywords: [
        "accenture technical assessment questions",
        "accenture quiz practice free",
        "accenture technical test questions and answers",
        "accenture assessment 2026 preparation",
      ],
      related: ["debugging-assessment-1", "debugging-assessment-2", "bubble-math"],
      faq: [
        {
          question: "How many questions are in the Accenture technical quiz?",
          answer:
            "150 questions across ten sections, covering programming fundamentals, databases, networking, operating systems, cloud, and security.",
        },
        {
          question: "When can I see the answers?",
          answer:
            "A section's answer key unlocks once every question in it has been attempted, so you cannot read ahead before committing to an answer.",
        },
        {
          question: "Is the timer the same as the real Accenture assessment?",
          answer:
            "Yes, 45 minutes for the full set, which is the budget candidates report for the technical section.",
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DEBUGGING — code-fixing assessments (Capgemini / TCS / Wipro style)
  // ══════════════════════════════════════════════════════════════════════════
  // {
  //   slug: "debugging-assessment-1",
  //   name: "Debugging Assessment 1",
  //   category: "quiz",
  //   company: "capgemini",
  //   kind: "html",
  //   htmlFolder: "debugging-assessment-1",
  //   tagline: "Five broken DSA solutions: trees, graphs, DP, prefix sums, shortest paths.",
  //   difficulty: "hard",
  //   duration: "45 min",
  //   skills: ["Debugging", "Data structures", "Algorithms", "Code reading"],
  //   seo: {
  //     headline: "Debugging Assessment 1 — Free Capgemini Debugging Round Practice",
  //     description:
  //       "Practice the Capgemini debugging round free online. Fix five broken DSA solutions covering trees, graphs, dynamic programming, prefix sums, and shortest paths in a timed editor.",
  //     keywords: [
  //       "capgemini debugging questions",
  //       "debugging round practice online",
  //       "capgemini coding debugging test",
  //       "placement debugging assessment free",
  //     ],
  //     related: ["debugging-assessment-2", "accenture-technical-quiz", "quick-math"],
  //     faq: [
  //       {
  //         question: "What does the debugging round actually test?",
  //         answer:
  //           "Reading unfamiliar code fast and finding the one line that breaks it. The algorithms are standard; the bugs are off-by-one errors, wrong base cases, and inverted conditions.",
  //       },
  //       {
  //         question: "Do I write the solution from scratch?",
  //         answer:
  //           "No. Each problem gives you a nearly-correct implementation. You edit it until the sample tests pass, which is exactly the format of the real round.",
  //       },
  //     ],
  //   },
  // },
  // {
  //   slug: "debugging-assessment-2",
  //   name: "Debugging Assessment 2",
  //   category: "quiz",
  //   company: "capgemini",
  //   kind: "html",
  //   htmlFolder: "debugging-assessment-2",
  //   tagline: "Pointers, stacks, Kadane, intervals and rotated arrays — five more bugs.",
  //   difficulty: "hard",
  //   duration: "45 min",
  //   skills: ["Debugging", "Pointer logic", "Algorithms", "Edge cases"],
  //   seo: {
  //     headline: "Debugging Assessment 2 — More Free Debugging Round Practice",
  //     description:
  //       "A second timed debugging assessment covering pointer logic, stacks, Kadane's algorithm, interval merging, and rotated array search. Fix the bug, pass the tests. Free, no signup.",
  //     keywords: [
  //       "debugging round questions with answers",
  //       "capgemini debugging practice test",
  //       "coding debugging assessment online free",
  //       "placement coding round preparation",
  //     ],
  //     related: ["debugging-assessment-1", "accenture-technical-quiz", "digit-challenge"],
  //     faq: [
  //       {
  //         question: "How is assessment 2 different from assessment 1?",
  //         answer:
  //           "Same format, different bug classes. Assessment 2 leans on pointer and index handling — rotated array pivots, interval boundaries, stack underflow — where assessment 1 focuses on recursion and graph traversal.",
  //       },
  //     ],
  //   },
  // },

  // ══════════════════════════════════════════════════════════════════════════
  // COGNIZANT — communication assessment rounds
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: "read-aloud",
    name: "Read Aloud",
    category: "communication",
    company: "cognizant",
    kind: "html",
    htmlFolder: "communication/read-aloud.html",
    tagline: "Read workplace sentences aloud and get pronunciation-style feedback.",
    difficulty: "easy",
    duration: "5-10 min",
    skills: ["Pronunciation", "Fluency", "Spoken clarity"],
    seo: {
      headline: "Read Aloud — Free Cognizant Communication Round Practice",
      description:
        "Practice the Cognizant read-aloud communication round free online. Read workplace sentences into your microphone and review clarity and fluency feedback. No signup required.",
      keywords: [
        "cognizant communication round practice",
        "read aloud test practice online",
        "cognizant genc communication assessment",
        "versant read aloud practice free",
      ],
      related: ["listen-and-repeat", "grammar-round", "comprehension-round"],
      faq: [
        {
          question: "Do I need a microphone for the read-aloud round?",
          answer:
            "Yes. The round records your reading in the browser to score clarity and pacing. Nothing is uploaded — the analysis happens on your device.",
        },
      ],
    },
  },
  {
    slug: "listen-and-repeat",
    name: "Listen & Repeat",
    category: "communication",
    company: "cognizant",
    kind: "html",
    htmlFolder: "communication/listen-repeat.html",
    tagline: "Hear a business sentence once, repeat it, review the accuracy score.",
    difficulty: "medium",
    duration: "5-10 min",
    skills: ["Listening", "Verbal working memory", "Pronunciation"],
    seo: {
      headline: "Listen & Repeat — Free Cognizant Communication Test Practice",
      description:
        "Practice the Cognizant listen-and-repeat round free online. Hear each business sentence once, repeat it back, and review your accuracy score. Free spoken English assessment practice.",
      keywords: [
        "cognizant listen and repeat practice",
        "listen and repeat test online free",
        "cognizant genc english assessment",
        "sentence repetition test practice",
      ],
      related: ["read-aloud", "comprehension-round", "open-response"],
      faq: [
        {
          question: "How many times can I play each sentence?",
          answer:
            "Once, as in the real assessment. The round measures verbal working memory as much as pronunciation, so replays would defeat the purpose.",
        },
      ],
    },
  },
  {
    slug: "grammar-round",
    name: "Grammar Round",
    category: "communication",
    company: "cognizant",
    kind: "html",
    htmlFolder: "communication/grammar.html",
    tagline: "Pick the correct sentence form in timed grammar-correction drills.",
    difficulty: "medium",
    duration: "5-10 min",
    skills: ["Grammar", "Sentence correction", "Written English"],
    seo: {
      headline: "Grammar Round — Free Cognizant English Assessment Practice",
      description:
        "Practice the Cognizant grammar round free online. Choose the correct sentence form in timed correction drills covering tense, agreement, prepositions, and articles. Free, no signup.",
      keywords: [
        "cognizant grammar test practice",
        "english grammar round placement test",
        "cognizant genc english questions",
        "sentence correction practice online free",
      ],
      related: ["comprehension-round", "read-aloud", "open-response"],
      faq: [
        {
          question: "What grammar topics appear in the Cognizant round?",
          answer:
            "Subject-verb agreement, tense consistency, prepositions, articles, and pronoun reference, in workplace-style sentences rather than academic examples.",
        },
      ],
    },
  },
  {
    slug: "comprehension-round",
    name: "Comprehension Round",
    category: "communication",
    company: "cognizant",
    kind: "html",
    htmlFolder: "communication/comprehension.html",
    tagline: "Listen to short spoken passages and answer comprehension questions.",
    difficulty: "medium",
    duration: "5-10 min",
    skills: ["Listening comprehension", "Inference", "Retention"],
    seo: {
      headline: "Comprehension Round — Free Cognizant Listening Test Practice",
      description:
        "Practice the Cognizant listening comprehension round free online. Play short spoken workplace passages and answer inference and detail questions. Free assessment practice, no signup.",
      keywords: [
        "cognizant listening comprehension practice",
        "listening comprehension test online free",
        "cognizant genc communication round",
        "english comprehension placement practice",
      ],
      related: ["listen-and-repeat", "grammar-round", "open-response"],
      faq: [
        {
          question: "Are the questions about details or inference?",
          answer:
            "Both. Some ask what was said outright; others ask what the speaker implied, which is where most candidates lose marks.",
        },
      ],
    },
  },
  {
    slug: "open-response",
    name: "Open Response",
    category: "communication",
    company: "cognizant",
    kind: "html",
    htmlFolder: "communication/open-response.html",
    tagline: "Record spoken answers to workplace questions; review clarity and structure.",
    difficulty: "hard",
    duration: "5-10 min",
    skills: ["Spoken fluency", "Structure", "Professional communication"],
    seo: {
      headline: "Open Response — Free Cognizant Spoken English Round Practice",
      description:
        "Practice the Cognizant open-response round free online. Record spoken answers to workplace prompts and review feedback on clarity, structure, and pacing. Free, no signup needed.",
      keywords: [
        "cognizant open response round practice",
        "spoken english assessment practice free",
        "cognizant genc speaking test",
        "open response interview practice online",
      ],
      related: ["read-aloud", "listen-and-repeat", "comprehension-round"],
      faq: [
        {
          question: "How long should an open response answer be?",
          answer:
            "Around 45 to 60 seconds. Assessors look for a clear opening statement, two supporting points, and a close — rambling costs more marks than a short, structured answer.",
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GENERAL — existing cognitive + memory games
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: "inductive-challenge",
    name: "Inductive Challenge",
    category: "cognitive",
    company: "capgemini",
    kind: "react",
    tagline: "Spot the rule behind a figure sequence and pick what comes next.",
    difficulty: "medium",
    duration: "3-5 min",
    skills: ["Abstract reasoning", "Pattern recognition", "Rule induction"],
    hasRulesPage: true,
    seo: {
      headline: "Inductive Challenge — Free Abstract Reasoning Practice Online",
      description:
        "Practice Inductive Challenge abstract reasoning puzzles used in Capgemini and Cognizant tests. Find the rule behind each figure sequence and complete it. Free online, no download.",
      keywords: [
        "inductive challenge practice",
        "abstract reasoning test free",
        "capgemini inductive reasoning questions",
        "pattern completion game online",
      ],
      related: ["deductive-challenge", "gap-challenge", "grid-challenge"],
      faq: [
        {
          question: "What is inductive reasoning in an aptitude test?",
          answer:
            "Inferring a general rule from specific examples. You are shown a sequence of figures, work out what transformation links them, and apply it once more.",
        },
      ],
    },
  },
  {
    slug: "recall-challenge",
    name: "Recall Challenge",
    href: "/memory-game/recall-challenge",
    category: "memory",
    company: "general",
    kind: "react",
    tagline: "Hold items in memory through a delay, then reproduce them in order.",
    difficulty: "medium",
    duration: "3-5 min",
    skills: ["Episodic memory", "Recall speed", "Retention"],
    seo: {
      headline: "Recall Challenge — Free Online Memory Training Game",
      description:
        "Train recall with the free Recall Challenge memory game. Hold items through a delay, then reproduce them in order to measure retention and recall speed. Free brain training online.",
      keywords: [
        "recall challenge memory game",
        "free memory training online",
        "recall memory test free",
        "working memory game online",
      ],
      related: ["grid-puzzle", "grid-challenge", "digit-challenge"],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BRAIN GAMES — classic puzzles, embedded
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: "sudoku",
    name: "Sudoku",
    category: "brain",
    company: "general",
    kind: "embed",
    embedUrl: "https://lakshyapachkhede.github.io/brain-games/sudoku/index.html",
    tagline: "Classic 9x9 number logic — no guessing required.",
    difficulty: "medium",
    duration: "10-20 min",
    skills: ["Deduction", "Concentration", "Constraint reasoning"],
    seo: {
      headline: "Sudoku — Free Online Brain Puzzle Game",
      description:
        "Play classic Sudoku free online. Fill the 9x9 grid so every row, column, and box holds the digits 1 to 9. Pure logic, no guessing needed. Free brain game, no download.",
      keywords: ["sudoku online free", "sudoku puzzle game", "number logic puzzle", "free sudoku brain training"],
      related: ["minesweeper", "15-puzzle", "tic-tac-toe"],
    },
  },
  {
    slug: "15-puzzle",
    name: "15 Puzzle",
    category: "brain",
    company: "general",
    kind: "embed",
    embedUrl: "https://lakshyapachkhede.github.io/brain-games/15-puzzle/index.html",
    tagline: "Slide numbered tiles into order using the single empty space.",
    difficulty: "medium",
    duration: "5-10 min",
    skills: ["Spatial reasoning", "Planning", "Sequencing"],
    seo: {
      headline: "15 Puzzle — Free Online Sliding Tile Game",
      description:
        "Solve the classic 15 sliding tile puzzle online. Arrange the numbered tiles in order using the one empty space. Trains spatial reasoning and planning. Free, no signup.",
      keywords: ["15 puzzle online free", "sliding puzzle game", "tile puzzle brain game", "spatial reasoning game"],
      related: ["sudoku", "minesweeper", "snake"],
    },
  },
  {
    slug: "minesweeper",
    name: "Minesweeper",
    category: "brain",
    company: "general",
    kind: "embed",
    embedUrl: "https://lakshyapachkhede.github.io/brain-games/minesweeper/index.html",
    tagline: "Deduce which cells are safe from the numbers around them.",
    difficulty: "medium",
    duration: "5-10 min",
    skills: ["Deduction", "Probability", "Analytical thinking"],
    seo: {
      headline: "Minesweeper — Free Online Logic Game",
      description:
        "Play Minesweeper free online. Use deductive logic to uncover safe cells and flag mines. A classic brain game that sharpens analytical thinking. No download needed.",
      keywords: ["minesweeper online free", "minesweeper game", "logic deduction game free", "mine sweeper brain game"],
      related: ["sudoku", "15-puzzle", "tic-tac-toe"],
    },
  },
  {
    slug: "tic-tac-toe",
    name: "Tic Tac Toe",
    category: "brain",
    company: "general",
    kind: "embed",
    embedUrl: "https://lakshyapachkhede.github.io/brain-games/tic-tac-toe/index.html",
    tagline: "Classic three-in-a-row against the computer.",
    difficulty: "easy",
    duration: "1-3 min",
    skills: ["Strategy", "Lookahead", "Pattern recognition"],
    seo: {
      headline: "Tic Tac Toe — Free Online Strategy Game",
      description:
        "Play Tic Tac Toe free online against the computer. Practice strategic thinking and pattern recognition with this classic brain game. Free, instant play in your browser.",
      keywords: ["tic tac toe online free", "tic tac toe game", "strategy game free online", "noughts and crosses"],
      related: ["minesweeper", "sudoku", "snake"],
    },
  },
  {
    slug: "snake",
    name: "Snake",
    category: "brain",
    company: "general",
    kind: "embed",
    embedUrl: "https://lakshyapachkhede.github.io/brain-games/snake/index.html",
    tagline: "Steer a growing snake without hitting the walls or yourself.",
    difficulty: "easy",
    duration: "3-5 min",
    skills: ["Reflexes", "Spatial awareness", "Quick decisions"],
    seo: {
      headline: "Snake — Free Online Reflex & Strategy Game",
      description:
        "Play the classic Snake game free online. Navigate a growing snake to eat food while avoiding the walls and yourself. Trains reflexes, spatial awareness, and quick decisions.",
      keywords: ["snake game online free", "classic snake game", "reflex training game", "snake brain game free"],
      related: ["ant-smasher", "15-puzzle", "tic-tac-toe"],
    },
  },
  {
    slug: "memory-match-pairs",
    name: "Memory Match Pairs",
    category: "brain",
    company: "general",
    kind: "embed",
    embedUrl: "https://lakshyapachkhede.github.io/brain-games/memory-game/index.html",
    tagline: "Flip cards and find every matching pair.",
    difficulty: "easy",
    duration: "3-5 min",
    skills: ["Short-term memory", "Focus", "Recall speed"],
    seo: {
      headline: "Memory Match Pairs — Free Online Memory Game",
      description:
        "Flip cards and find matching pairs in this classic memory game. Improve short-term memory, focus, and recall speed. Free online brain training, no download needed.",
      keywords: ["memory match game free", "card matching game online", "memory pairs game", "brain training memory free"],
      related: ["sudoku", "15-puzzle", "minesweeper"],
    },
  },
  {
    slug: "ant-smasher",
    name: "Ant Smasher",
    category: "brain",
    company: "general",
    kind: "embed",
    embedUrl: "https://lakshyapachkhede.github.io/brain-games/ant-smasher/index.html",
    tagline: "Tap the ants before they escape.",
    difficulty: "easy",
    duration: "1-3 min",
    skills: ["Reaction time", "Hand-eye coordination", "Sustained attention"],
    seo: {
      headline: "Ant Smasher — Free Online Reflex Game",
      description:
        "Smash the ants before they escape. Test reflexes and hand-eye coordination with this fast-paced brain game. Free online, play instantly in your browser.",
      keywords: ["ant smasher game free", "reflex game online", "reaction time game free", "whack a mole style game"],
      related: ["snake", "tic-tac-toe", "memory-match-pairs"],
    },
  },
  {
    slug: "dice-roller",
    name: "Dice Roller",
    category: "brain",
    company: "general",
    kind: "embed",
    embedUrl: "https://lakshyapachkhede.github.io/brain-games/dice-roller/index.html",
    tagline: "Roll virtual dice for board games and probability practice.",
    difficulty: "easy",
    duration: "1-3 min",
    skills: ["Probability", "Randomness intuition"],
    seo: {
      headline: "Dice Roller — Free Online Probability Tool",
      description:
        "Roll virtual dice and explore probability. A simple tool for board games, maths practice, and probability experiments. Free online, instant results.",
      keywords: ["dice roller online free", "virtual dice game", "probability game free", "random dice online"],
      related: ["sudoku", "tic-tac-toe", "ant-smasher"],
    },
  },
];

export const GAMES: readonly GameDefinition[] = RAW_GAMES.map((game) => ({
  ...game,
  pro: true,
  seo: {
    ...game.seo,
    headline: game.seo.headline.replace(/Free\s+/gi, "").replace(/\s+Free/gi, ""),
    description: game.seo.description.replace(/free\s+online/gi, "online").replace(/\bfree\b/gi, "pro"),
  },
}));


// ── Derived lookups ─────────────────────────────────────────────────────────

const BY_SLUG = new Map(GAMES.map((game) => [game.slug, game]));

export function getGame(slug: string): GameDefinition | undefined {
  return BY_SLUG.get(slug);
}

/** Everything that should be listed and indexed. */
export function liveGames(): GameDefinition[] {
  return GAMES.filter((game) => !game.comingSoon);
}

export function gamesInCategory(category: GameCategory): GameDefinition[] {
  return liveGames().filter((game) => game.category === category);
}

export function gamesForCompany(company: CompanySlug): GameDefinition[] {
  const all = liveGames();
  if (company === "capgemini" || company === "cognizant") {
    // Capgemini and Cognizant assessments both test the cognitive puzzle battery and communication rounds
    return all.filter(
      (game) => game.company === "capgemini" || game.company === "cognizant"
    );
  }
  return all.filter((game) => game.company === company);
}

/**
 * The playable URL for a game. Play routes are grouped by category so each
 * group can share a layout (and its gating) without a per-game special case.
 */
export function playHref(game: GameDefinition): string {
  if (game.href) return game.href;
  if (game.kind === "embed") return `/play/brain-games/${game.slug}`;
  if (game.category === "quiz") return `/play/assessments/${game.slug}`;
  if (game.category === "communication") return `/play/communication/${game.slug}`;
  return `/play/${game.slug}`;
}

/** The indexable landing page for a game — this is the SEO surface. */
export function seoHref(game: GameDefinition): string {
  return `/games/${game.category}/${game.slug}`;
}

/**
 * Cross-links for a game, falling back to same-category siblings so a game
 * with a stale `related` list still links somewhere useful.
 */
export function relatedGames(slug: string): GameDefinition[] {
  const game = getGame(slug);
  if (!game) return [];

  const explicit = game.seo.related
    .map((s) => getGame(s))
    .filter((g): g is GameDefinition => Boolean(g) && !g!.comingSoon);

  if (explicit.length >= 3) return explicit;

  const fallback = gamesInCategory(game.category).filter(
    (g) => g.slug !== slug && !explicit.some((e) => e.slug === g.slug)
  );

  return [...explicit, ...fallback].slice(0, 3);
}

/** Categories that currently have at least one live game. */
export function activeCategories(): GameCategory[] {
  return Array.from(new Set(liveGames().map((g) => g.category)));
}

export const GAME_SLUGS = GAMES.map((g) => g.slug);

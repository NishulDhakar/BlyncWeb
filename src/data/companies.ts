import type { CompanySlug } from "@/games/types";
import { gamesForCompany } from "@/games/registry";

/**
 * Company directory — every employer whose game-based/cognitive assessment
 * Blync tracks, sourced from allgames-companywise.md.
 *
 * This is deliberately separate from `@/games/registry`: the registry only
 * knows about companies with real, playable games (`registrySlug` below links
 * the two). Every other company here has no module yet — its detail page
 * renders the "coming soon" state until games are built for it.
 */

export type CompanyRegion = "india" | "global";

export interface CompanyEntry {
  slug: string;
  name: string;
  region: CompanyRegion;
  /** e.g. "Game-Based Aptitude", "Pymetrics Games" — shown under the name. */
  assessmentLabel: string;
  /** Named games/rounds from the employer's real assessment. */
  games: readonly string[];
  /** Set only when `@/games/registry` has playable games for this company. */
  registrySlug?: CompanySlug;
  /** 1-3 letter fallback badge when no logo asset exists. */
  monogram: string;
  /** Tailwind color name driving the logo badge + accent chips. */
  accent: CompanyAccent;
  /** Local /public path to a real logo asset, when one exists. */
  logo?: string;
}

export type CompanyAccent =
  | "purple" | "sky" | "slate" | "indigo" | "blue" | "emerald" | "amber"
  | "rose" | "cyan" | "teal" | "orange" | "fuchsia" | "lime" | "violet"
  | "pink" | "yellow" | "red" | "green";

export const COMPANIES: readonly CompanyEntry[] = [
  // ── India / campus hiring ────────────────────────────────────────────────
  {
    slug: "accenture",
    name: "Accenture",
    region: "india",
    assessmentLabel: "Cognitive Assessment",
    games: ["Pathfinder", "Bubble Game", "Memory", "Quick Math", "Key & Door"],
    registrySlug: "accenture",
    monogram: ">",
    accent: "purple",
    logo: "/accenture.png",
  },
  {
    slug: "capgemini",
    name: "Capgemini",
    region: "india",
    assessmentLabel: "Game-Based Aptitude & Communication",
    games: [
      "Switch Challenge",
      "Digit Challenge",
      "Grid Challenge",
      "Motion Challenge",
      "Deductive Challenge",
      "Inductive Challenge",
      "Read Aloud",
      "Listen & Repeat",
      "Grammar Round",
      "Comprehension Round",
      "Open Response",
    ],
    registrySlug: "capgemini",
    monogram: "C",
    accent: "sky",
    logo: "/capgeminiLogo.png",
  },
  {
    slug: "cognizant",
    name: "Cognizant",
    region: "india",
    assessmentLabel: "GenC Game-Based & Communication Test",
    games: [
      "Switch Challenge",
      "Digit Challenge",
      "Grid Challenge",
      "Motion Challenge",
      "Deductive Challenge",
      "Inductive Challenge",
      "Read Aloud",
      "Listen & Repeat",
      "Grammar Round",
      "Comprehension Round",
      "Open Response",
    ],
    registrySlug: "cognizant",
    monogram: "CTS",
    accent: "blue",
    logo: "/scraped/logo-img02.png",
  },
  {
    slug: "deloitte",
    name: "Deloitte",
    region: "india",
    assessmentLabel: "Gamified Assessment",
    games: ["Cosmic Cadet", "Problem Solving", "Logical Reasoning", "Decision Making"],
    monogram: "D.",
    accent: "green",
    logo: "/scraped/logo-img06.png",
  },
  {
    slug: "tcs",
    name: "TCS",
    region: "india",
    assessmentLabel: "NQT Cognitive & Aptitude",
    games: ["Numerical Ability", "Verbal Ability", "Reasoning Ability", "Advanced Quant", "Cognitive Assessment"],
    monogram: "TCS",
    accent: "blue",
    logo: "/scraped/logo-img14.png",
  },
  {
    slug: "ey",
    name: "EY",
    region: "india",
    assessmentLabel: "Cognitive Assessment",
    games: ["Numerical Reasoning", "Logical Reasoning", "Verbal Reasoning", "Situational Judgement"],
    monogram: "EY",
    accent: "yellow",
    logo: "/scraped/logo-img10.png",
  },
  {
    slug: "ibm",
    name: "IBM",
    region: "india",
    assessmentLabel: "Cognitive Assessment",
    games: ["Memory", "Numerical Reasoning", "Logical Reasoning", "Pattern Recognition"],
    monogram: "IBM",
    accent: "blue",
  },
  {
    slug: "kpmg",
    name: "KPMG",
    region: "india",
    assessmentLabel: "Gamified Assessment",
    games: ["Arctic Shores Games", "Problem Solving", "Decision Making", "Logical Reasoning"],
    monogram: "K",
    accent: "indigo",
  },
  {
    slug: "pwc",
    name: "PwC",
    region: "india",
    assessmentLabel: "Immersive Assessment",
    games: ["Arctic Shores Games", "Logical Reasoning", "Decision Making", "Problem Solving"],
    monogram: "PwC",
    accent: "orange",
  },
  {
    slug: "goldman-sachs",
    name: "Goldman Sachs",
    region: "india",
    assessmentLabel: "Cognitive Assessment",
    games: ["Numerical Reasoning", "Logical Reasoning", "Pattern Recognition", "Attention"],
    monogram: "GS",
    accent: "blue",
  },

  // ── Global ───────────────────────────────────────────────────────────────
  {
    slug: "unilever",
    name: "Unilever",
    region: "global",
    assessmentLabel: "Game-Based Assessment",
    games: ["ShapeDance", "Numerosity", "Memory", "Task Switching"],
    monogram: "U",
    accent: "indigo",
  },
  {
    slug: "blackstone",
    name: "Blackstone",
    region: "global",
    assessmentLabel: "Pymetrics Games",
    games: ["Balloons", "Cards", "Towers", "Digits", "Keypress", "Stop", "Arrows", "Lengths", "Faces", "Easy or Hard", "Money Exchange"],
    monogram: "BX",
    accent: "slate",
  },
  {
    slug: "jpmorgan-chase",
    name: "JPMorgan Chase",
    region: "global",
    assessmentLabel: "Pymetrics Assessment",
    games: ["Balloons", "Cards", "Towers", "Digits", "Keypress", "Money Exchange"],
    monogram: "JPM",
    accent: "blue",
  },
  {
    slug: "morgan-stanley",
    name: "Morgan Stanley",
    region: "global",
    assessmentLabel: "Pymetrics Assessment",
    games: ["Balloons", "Digits", "Cards", "Towers", "Keypress"],
    monogram: "MS",
    accent: "blue",
  },
  {
    slug: "standard-chartered",
    name: "Standard Chartered",
    region: "global",
    assessmentLabel: "Pymetrics Assessment",
    games: ["Balloons", "Cards", "Digits", "Towers", "Arrows"],
    monogram: "SC",
    accent: "green",
  },
  {
    slug: "barclays",
    name: "Barclays",
    region: "global",
    assessmentLabel: "Cognitive Assessment",
    games: ["Numerical Reasoning", "Logical Reasoning", "Critical Thinking", "Pattern Recognition"],
    monogram: "B",
    accent: "cyan",
  },
  {
    slug: "hsbc",
    name: "HSBC",
    region: "global",
    assessmentLabel: "Cognitive Assessment",
    games: ["Numerical Reasoning", "Logical Reasoning", "Verbal Reasoning", "Abstract Reasoning"],
    monogram: "HSBC",
    accent: "red",
  },
  {
    slug: "shell",
    name: "Shell",
    region: "global",
    assessmentLabel: "HireVue Games",
    games: ["Digitspan", "Flashback", "Puzzle Picture", "Portrait"],
    monogram: "S",
    accent: "yellow",
  },
  {
    slug: "nato",
    name: "NATO",
    region: "global",
    assessmentLabel: "Cognitive Games",
    games: ["Digit Span", "Disco Numbers", "Numerosity", "ShapeDance"],
    monogram: "N",
    accent: "slate",
  },
  {
    slug: "jetblue",
    name: "JetBlue",
    region: "global",
    assessmentLabel: "Cognitive Games",
    games: ["Pattern Recognition", "Memory", "Visual Reasoning", "Reaction"],
    monogram: "JB",
    accent: "blue",
  },
  {
    slug: "philips",
    name: "Philips",
    region: "global",
    assessmentLabel: "HireVue Assessment",
    games: ["Numerical Reasoning", "Pattern Recognition", "Memory", "Problem Solving"],
    monogram: "P",
    accent: "sky",
  },
  {
    slug: "telstra",
    name: "Telstra",
    region: "global",
    assessmentLabel: "Game-Based Assessment",
    games: ["Numerical Games", "Puzzle Games", "Memory", "Emotional Recognition"],
    monogram: "T",
    accent: "blue",
  },
  {
    slug: "aes-corporation",
    name: "AES Corporation",
    region: "global",
    assessmentLabel: "HireVue Games",
    games: ["Numerical Reasoning", "Logical Reasoning", "Pattern Recognition", "Problem Solving"],
    monogram: "AES",
    accent: "orange",
  },
  {
    slug: "airbus",
    name: "Airbus",
    region: "global",
    assessmentLabel: "Arctic Shores Assessment",
    games: ["Problem Solving", "Decision Making", "Memory", "Pattern Recognition"],
    monogram: "A",
    accent: "sky",
  },
  {
    slug: "siemens",
    name: "Siemens",
    region: "global",
    assessmentLabel: "Cognitive Assessment",
    games: ["Numerical Reasoning", "Logical Reasoning", "Abstract Reasoning", "Spatial Reasoning"],
    monogram: "S",
    accent: "teal",
  },
  {
    slug: "thales",
    name: "Thales",
    region: "global",
    assessmentLabel: "Gamified Assessment",
    games: ["Problem Solving", "Logical Reasoning", "Memory", "Decision Making"],
    monogram: "T",
    accent: "purple",
  },
  {
    slug: "edf-energy",
    name: "EDF Energy",
    region: "global",
    assessmentLabel: "Arctic Shores Games",
    games: ["Problem Solving", "Decision Making", "Memory", "Attention"],
    monogram: "EDF",
    accent: "orange",
  },
  {
    slug: "arcadis",
    name: "Arcadis",
    region: "global",
    assessmentLabel: "Arctic Shores Games",
    games: ["Problem Solving", "Decision Making", "Pattern Recognition", "Cognitive Flexibility"],
    monogram: "A",
    accent: "lime",
  },
  {
    slug: "wsp",
    name: "WSP",
    region: "global",
    assessmentLabel: "Cognitive Assessment",
    games: ["Numerical Reasoning", "Logical Reasoning", "Abstract Reasoning", "Verbal Reasoning"],
    monogram: "WSP",
    accent: "red",
  },
  {
    slug: "kantar",
    name: "Kantar",
    region: "global",
    assessmentLabel: "Cognitive Assessment",
    games: ["Numerical Reasoning", "Analytical Reasoning", "Logical Reasoning", "Data Interpretation"],
    monogram: "K",
    accent: "fuchsia",
  },
  {
    slug: "maven-securities",
    name: "Maven Securities",
    region: "global",
    assessmentLabel: "Trading / Cognitive Assessment",
    games: ["Risk & Reward", "Decision Making", "Probability", "Pattern Recognition"],
    monogram: "MS",
    accent: "emerald",
  },
  {
    slug: "tesco",
    name: "Tesco",
    region: "global",
    assessmentLabel: "Online Cognitive Assessment",
    games: ["Numerical Reasoning", "Logical Reasoning", "Verbal Reasoning", "Situational Judgement"],
    monogram: "T",
    accent: "blue",
  },
  {
    slug: "bp",
    name: "BP",
    region: "global",
    assessmentLabel: "Cognitive Assessment",
    games: ["Numerical Reasoning", "Logical Reasoning", "Abstract Reasoning", "Situational Judgement"],
    monogram: "BP",
    accent: "green",
  },
  {
    slug: "kraft-heinz",
    name: "Kraft Heinz",
    region: "global",
    assessmentLabel: "Pymetrics Games",
    games: ["Balloons", "Cards", "Towers", "Digits", "Keypress"],
    monogram: "KH",
    accent: "rose",
  },
  {
    slug: "colgate-palmolive",
    name: "Colgate-Palmolive",
    region: "global",
    assessmentLabel: "Pymetrics Games",
    games: ["Balloons", "Cards", "Digits", "Towers", "Arrows"],
    monogram: "CP",
    accent: "red",
  },
  {
    slug: "hyatt",
    name: "Hyatt",
    region: "global",
    assessmentLabel: "Pymetrics Games",
    games: ["Balloons", "Cards", "Memory", "Attention", "Risk"],
    monogram: "H",
    accent: "indigo",
  },
  {
    slug: "mcdonalds",
    name: "McDonald's",
    region: "global",
    assessmentLabel: "Gamified Assessment",
    games: ["Memory", "Attention", "Numerical Reasoning", "Decision Making"],
    monogram: "M",
    accent: "yellow",
  },
  {
    slug: "pg",
    name: "P&G",
    region: "global",
    assessmentLabel: "Digital Assessment",
    games: ["Numerical Reasoning", "Pattern Recognition", "Memory", "Logical Reasoning"],
    monogram: "P&G",
    accent: "blue",
  },
  {
    slug: "astrazeneca",
    name: "AstraZeneca",
    region: "global",
    assessmentLabel: "Pymetrics Games",
    games: ["Balloons", "Cards", "Towers", "Digits", "Keypress"],
    monogram: "AZ",
    accent: "purple",
  },
  {
    slug: "tesla",
    name: "Tesla",
    region: "global",
    assessmentLabel: "Cognitive Assessment",
    games: ["Numerical Reasoning", "Logical Reasoning", "Spatial Reasoning", "Pattern Recognition"],
    monogram: "T",
    accent: "red",
  },
  {
    slug: "coca-cola",
    name: "Coca-Cola",
    region: "global",
    assessmentLabel: "Gamified Assessment",
    games: ["Problem Solving", "Memory", "Pattern Recognition", "Decision Making"],
    monogram: "CC",
    accent: "red",
  },
  {
    slug: "ocado",
    name: "Ocado",
    region: "global",
    assessmentLabel: "Arctic Shores Games",
    games: ["Problem Solving", "Decision Making", "Pattern Recognition", "Cognitive Flexibility"],
    monogram: "O",
    accent: "teal",
  },
  {
    slug: "network-rail",
    name: "Network Rail",
    region: "global",
    assessmentLabel: "Arctic Shores Games",
    games: ["Memory", "Problem Solving", "Attention", "Decision Making"],
    monogram: "NR",
    accent: "orange",
  },
  {
    slug: "visa",
    name: "Visa",
    region: "global",
    assessmentLabel: "Gamified Assessment",
    games: ["Problem Solving", "Pattern Recognition", "Memory", "Decision Making"],
    monogram: "V",
    accent: "blue",
  },
  {
    slug: "bae-systems",
    name: "BAE Systems",
    region: "global",
    assessmentLabel: "Gamified Assessment",
    games: ["Problem Solving", "Memory", "Logical Reasoning", "Decision Making"],
    monogram: "BAE",
    accent: "slate",
  },
  {
    slug: "molson-coors",
    name: "Molson Coors",
    region: "global",
    assessmentLabel: "Arctic Shores Games",
    games: ["Problem Solving", "Decision Making", "Memory", "Attention"],
    monogram: "MC",
    accent: "amber",
  },
  {
    slug: "capita",
    name: "Capita",
    region: "global",
    assessmentLabel: "Arctic Shores Games",
    games: ["Problem Solving", "Decision Making", "Pattern Recognition", "Memory"],
    monogram: "C",
    accent: "purple",
  },
  {
    slug: "fdm-group",
    name: "FDM Group",
    region: "global",
    assessmentLabel: "Cognitive Assessment",
    games: ["Numerical Reasoning", "Logical Reasoning", "Verbal Reasoning", "Abstract Reasoning"],
    monogram: "FDM",
    accent: "cyan",
  },
  {
    slug: "crossover",
    name: "Crossover",
    region: "global",
    assessmentLabel: "Criteria Cognitive Assessment",
    games: ["Numerical Reasoning", "Verbal Reasoning", "Logical Reasoning", "Problem Solving"],
    monogram: "X",
    accent: "violet",
  },
  {
    slug: "vista-equity-partners",
    name: "Vista Equity Partners",
    region: "global",
    assessmentLabel: "Criteria CCAT",
    games: ["Numerical Reasoning", "Verbal Reasoning", "Logic", "Spatial Reasoning"],
    monogram: "V",
    accent: "emerald",
  },
  {
    slug: "tibco",
    name: "TIBCO",
    region: "global",
    assessmentLabel: "Criteria CCAT",
    games: ["Numerical Reasoning", "Verbal Reasoning", "Logical Reasoning", "Problem Solving"],
    monogram: "TIBCO",
    accent: "sky",
  },
  {
    slug: "powerschool",
    name: "PowerSchool",
    region: "global",
    assessmentLabel: "Criteria CCAT",
    games: ["Numerical Reasoning", "Verbal Reasoning", "Logical Reasoning", "Pattern Recognition"],
    monogram: "PS",
    accent: "indigo",
  },
  {
    slug: "allstate",
    name: "Allstate",
    region: "global",
    assessmentLabel: "Wonderlic Assessment",
    games: ["Numerical Reasoning", "Verbal Reasoning", "Logic", "Spatial Reasoning"],
    monogram: "A",
    accent: "blue",
  },
  {
    slug: "delta-air-lines",
    name: "Delta Air Lines",
    region: "global",
    assessmentLabel: "Wonderlic Assessment",
    games: ["Numerical Reasoning", "Verbal Reasoning", "Logic", "Problem Solving"],
    monogram: "D",
    accent: "red",
  },
  {
    slug: "medline",
    name: "Medline",
    region: "global",
    assessmentLabel: "Wonderlic Assessment",
    games: ["Numerical Reasoning", "Verbal Reasoning", "Logic", "Problem Solving"],
    monogram: "M",
    accent: "teal",
  },
  {
    slug: "panera-bread",
    name: "Panera Bread",
    region: "global",
    assessmentLabel: "Wonderlic Assessment",
    games: ["Numerical Reasoning", "Verbal Reasoning", "Logic", "Problem Solving"],
    monogram: "PB",
    accent: "green",
  },
] as const;

const BY_SLUG = new Map(COMPANIES.map((c) => [c.slug, c]));

export function getCompany(slug: string): CompanyEntry | undefined {
  return BY_SLUG.get(slug);
}

/** True once real, playable games exist for this company in the registry. */
export function isCompanyLive(company: CompanyEntry): boolean {
  return Boolean(company.registrySlug) && gamesForCompany(company.registrySlug!).length > 0;
}

export function companiesByRegion(region: CompanyRegion): CompanyEntry[] {
  return COMPANIES.filter((c) => c.region === region);
}

/** Featured row for the dashboard home — live companies first, then the biggest names. */
export function popularCompanies(limit = 6): CompanyEntry[] {
  const live = COMPANIES.filter(isCompanyLive);
  const rest = COMPANIES.filter((c) => !isCompanyLive(c));
  return [...live, ...rest].slice(0, limit);
}

const SKILL_KEYWORDS: readonly { match: RegExp; skill: string }[] = [
  { match: /memory|recall|digit span|flashback/i, skill: "Memory" },
  { match: /numerical|numerosity|digits|math/i, skill: "Numerical Reasoning" },
  { match: /logic|logical|reasoning$/i, skill: "Logical Reasoning" },
  { match: /pattern/i, skill: "Pattern Recognition" },
  { match: /attention|focus/i, skill: "Attention" },
  { match: /decision/i, skill: "Decision Making" },
  { match: /problem solving/i, skill: "Problem Solving" },
  { match: /spatial/i, skill: "Spatial Reasoning" },
  { match: /verbal/i, skill: "Verbal Reasoning" },
  { match: /risk|balloons|money exchange|cards|towers/i, skill: "Risk Tolerance" },
  { match: /abstract/i, skill: "Abstract Reasoning" },
  { match: /flexibility|switch/i, skill: "Cognitive Flexibility" },
];

/** Best-effort skill tags derived from a company's named games/rounds. */
export function inferSkills(games: readonly string[], limit = 4): string[] {
  const found = new Set<string>();
  for (const game of games) {
    for (const { match, skill } of SKILL_KEYWORDS) {
      if (match.test(game)) found.add(skill);
    }
    if (found.size >= limit) break;
  }
  if (found.size === 0) found.add("Cognitive Ability");
  return Array.from(found).slice(0, limit);
}

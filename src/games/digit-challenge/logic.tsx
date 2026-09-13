// app/play/DigitChallenge/gameLogic.ts
export type DigitProblem = {
  // tokens with '_' where digits should be placed, e.g. ['_', '*', '_', '+', '_']
  tokens: string[];
  blanks: number;
  // human friendly equation for display, e.g. "_ × _ + _ = 20"
  equationStr: string;
  // target RHS number
  target: number;
  // the correct digits (kept here since this is client-side). It's used for
  // debugging or analytics — checkAnswer does not rely on it.
  solution: number[];
};

/** helpers */
const OPS_MAP: Record<string, string> = { "*": "×", "/": "÷", "+": "+", "-": "-" };

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistinctDigits(count: number): number[] {
  const pool = shuffle([1,2,3,4,5,6,7,8,9]);
  return pool.slice(0, count);
}


//   Evaluate token array where '_' are replaced by actual numbers.
//   handles  with standard precedence: * and / first (left-to-right), then + and -.
//  tokens example: [2, '*', 3, '+', 4]
 
function evaluateTokenArray(tokens: (number | string)[]): number {
  // first pass: handle * and / left-to-right
  const firstPass: (number | string)[] = [];
  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok === "*" || tok === "/") {
      const left = firstPass.pop();
      const right = tokens[i + 1] as number;
      if (typeof left !== "number" || typeof right !== "number") {
        throw new Error("Invalid expression during evaluation");
      }
      const res = tok === "*" ? left * right : left / right;
      firstPass.push(res);
      i += 2; // skip operator and right operand
    } else {
      firstPass.push(tok);
      i += 1;
    }
  }

  // second pass: handle + and - left-to-right
  let result = firstPass[0] as number;
  i = 1;
  while (i < firstPass.length) {
    const op = firstPass[i] as string;
    const val = firstPass[i + 1] as number;
    if (op === "+") result = result + val;
    else if (op === "-") result = result - val;
    else throw new Error("Unexpected operator in second pass: " + op);
    i += 2;
  }
  return result;
}

/**
 * Substitute digits into tokens, produce numeric token array and evaluate.
 * tokens example: ['_', '*', '_', '+', '_'] and digits [2,5,3] produce [2,'*',5,'+',3]
 */
export function evaluateWithDigits(tokens: string[], digits: number[]): number {
  const filled: (number | string)[] = [];
  let dIndex = 0;
  for (const t of tokens) {
    if (t === "_") {
      filled.push(digits[dIndex++]);
    } else {
      filled.push(t);
    }
  }
  return evaluateTokenArray(filled);
}

/** The templates we support (simple 3-blank forms). Add more templates if you want. */
const TEMPLATES: string[][] = [
  ["_", "*", "_", "+", "_"], // a * b + c
  ["_", "+", "_", "+", "_"], // a + b + c
  ["_", "*", "_", "*", "_"], // a * b * c (higher difficulty)
  ["_", "+", "_", "*", "_"], // a + b * c
  ["_", "*", "_", "-", "_"], // a * b - c
  // note: division templates are possible but require picking divisible pairs
];

/**
 * Generate a new solvable problem based on level (level can influence template choice).
 */
export function generateDigitProblem(level = 1): DigitProblem {
  // pick a template with slight bias toward harder templates on higher levels
  const idx = Math.min(TEMPLATES.length - 1, Math.floor(Math.random() * Math.min(3 + Math.floor(level / 3), TEMPLATES.length)));
  const template = TEMPLATES[idx];

  const blanks = template.filter((t) => t === "_").length;
  const solution = pickDistinctDigits(blanks);

  // compute target by evaluating template with chosen digits
  const target = evaluateWithDigits(template, solution);

  // create display-friendly string: replace '*' with × etc.
  const equationStr = template
    .map((t) => (t === "_" ? "_" : OPS_MAP[t] ?? t))
    .join(" ");

  return {
    tokens: template,
    blanks,
    equationStr: `${equationStr} = ${target}`,
    target,
    solution,
  };
}

/**
 * Check user's digits for correctness.
 * - ensures length matches
 * - ensures digits are unique (each digit can be used only once)
 * - evaluates LHS with user's digits and compares to target (tolerance for rounding)
 */
export function checkAnswer(problem: DigitProblem, userDigits: number[]): { ok: boolean; result: number } {
  if (!problem) return { ok: false, result: NaN };
  if (userDigits.length !== problem.blanks) return { ok: false, result: NaN };
  // uniqueness rule
  const s = new Set(userDigits);
  if (s.size !== userDigits.length) return { ok: false, result: NaN };

  const result = evaluateWithDigits(problem.tokens, userDigits);
  const ok = Math.abs(result - problem.target) < 1e-9;
  return { ok, result };
}

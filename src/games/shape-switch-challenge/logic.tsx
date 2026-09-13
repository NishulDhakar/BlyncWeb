"use client";

/**
 * logic2.tsx — Shape-based Switch Challenge
 *
 * Layout (mirrors the Cognizant aptitude image):
 *   ┌──────────────────────────┐
 *   │  INPUT  (4 shape tiles)  │
 *   │       ▼ funnel           │
 *   │  [ 1324 ] [ 3241 ] [ 4312 ]  ← operator choices
 *   │       ▲ funnel           │
 *   │  OUTPUT (4 shape tiles)  │
 *   └──────────────────────────┘
 *
 * Operator semantics — "3241" means:
 *   output[0] = input[2]  (digit 3 → index 2)
 *   output[1] = input[1]  (digit 2 → index 1)
 *   output[2] = input[3]  (digit 4 → index 3)
 *   output[3] = input[0]  (digit 1 → index 0)
 */

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Shape definitions ────────────────────────────────────────────────────────

type ShapeId = "cross" | "circle" | "triangle" | "square";

type Shape = {
  id: ShapeId;
  hex: string;
};

const SHAPES: Shape[] = [
  { id: "cross",    hex: "#29abe2" },
  { id: "circle",   hex: "#6abf45" },
  { id: "triangle", hex: "#f5a623" },
  { id: "square",   hex: "#e8312a" },
];

// ─── Operator pool (all 4! permutations of 1234) ──────────────────────────────

const ALL_OPERATORS = [
  "1234","1243","1324","1342","1423","1432",
  "2134","2143","2314","2341","2413","2431",
  "3124","3142","3214","3241","3412","3421",
  "4123","4132","4213","4231","4312","4321",
];

// ─── Pure logic helpers ───────────────────────────────────────────────────────

function rand(max: number) {
  return Math.floor(Math.random() * max);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Apply operator: output[k] = input[ digit[k] - 1 ] */
function applyOperator(input: Shape[], op: string): Shape[] {
  return op.split("").map((d) => input[Number(d) - 1]);
}

/** Check if selected operator produces the expected output */
function checkAnswer(input: Shape[], output: Shape[], selected: string): boolean {
  return applyOperator(input, selected)
    .map((s) => s.id)
    .join(",") === output.map((s) => s.id).join(",");
}

/** Build one puzzle: random input, random answer, 2 distractors */
function makePuzzle() {
  const input = shuffle(SHAPES);
  const answer = ALL_OPERATORS[rand(ALL_OPERATORS.length)];
  const output = applyOperator(input, answer);
  const options = shuffle([
    answer,
    ...shuffle(ALL_OPERATORS.filter((op) => op !== answer)).slice(0, 2),
  ]);
  return { input, output, answer, options };
}

// ─── Shape SVG (inline, no external assets) ───────────────────────────────────

function ShapeSVG({ shape, size = 44 }: { shape: Shape; size?: number }) {
  const h = size / 2;
  switch (shape.id) {
    case "cross": {
      const arm = size * 0.27, w = size * 0.18;
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <rect x={h - w / 2} y={h - arm - w / 2} width={w} height={arm * 2 + w} rx={w * 0.4} fill={shape.hex} />
          <rect x={h - arm - w / 2} y={h - w / 2} width={arm * 2 + w} height={w} rx={w * 0.4} fill={shape.hex} />
        </svg>
      );
    }
    case "circle":
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={h} cy={h} r={size * 0.38} fill={shape.hex} />
        </svg>
      );
    case "triangle": {
      const r = size * 0.40;
      const pts = [
        `${h},${h - r}`,
        `${h + r * Math.sin((2 * Math.PI) / 3)},${h - r * Math.cos((2 * Math.PI) / 3)}`,
        `${h + r * Math.sin((4 * Math.PI) / 3)},${h - r * Math.cos((4 * Math.PI) / 3)}`,
      ].join(" ");
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <polygon points={pts} fill={shape.hex} />
        </svg>
      );
    }
    case "square": {
      const s = size * 0.62;
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <rect x={(size - s) / 2} y={(size - s) / 2} width={s} height={s} rx={size * 0.07} fill={shape.hex} />
        </svg>
      );
    }
  }
}

// ─── Funnel SVG ───────────────────────────────────────────────────────────────

function Funnel({ direction }: { direction: "down" | "up" }) {
  const W = 120, H = 60;
  const wideW = W, narrowW = 34;
  const topW  = direction === "down" ? wideW : narrowW;
  const botW  = direction === "down" ? narrowW : wideW;
  const topX  = (W - topW) / 2;
  const botX  = (W - botW) / 2;
  const DOTS  = 6;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Body */}
      <polygon
        points={`${topX},7 ${topX + topW},7 ${botX + botW},${H - 7} ${botX},${H - 7}`}
        fill="#4a4a4a"
      />
      {/* Inner highlight */}
      <polygon
        points={`${topX + 5},10 ${topX + topW - 5},10 ${botX + botW - 5},${H - 10} ${botX + 5},${H - 10}`}
        fill="#606060"
        opacity="0.5"
      />
      {/* Top bar */}
      <rect x={topX - 5} y={1} width={topW + 10} height={11} rx={3} fill="#383838" />
      {Array.from({ length: DOTS }).map((_, n) => (
        <circle key={n} cx={topX + 4 + n * (topW / (DOTS - 1))} cy={6.5} r={2.8} fill="#bebebe" />
      ))}
      {/* Bottom bar */}
      <rect x={botX - 5} y={H - 12} width={botW + 10} height={11} rx={3} fill="#383838" />
      {Array.from({ length: DOTS }).map((_, n) => (
        <circle key={n} cx={botX + 4 + n * (botW / (DOTS - 1))} cy={H - 6.5} r={2.8} fill="#bebebe" />
      ))}
    </svg>
  );
}

// ─── Shape row ────────────────────────────────────────────────────────────────

function ShapeRow({ shapes }: { shapes: Shape[] }) {
  return (
    <div className="flex gap-3">
      {shapes.map((shape, i) => (
        <div
          key={`${shape.id}-${i}`}
          className="flex size-[76px] items-center justify-center rounded-[20px] bg-[#e2e2e2] shadow-[3px_4px_0_0_rgba(0,0,0,0.22)]"
        >
          <ShapeSVG shape={shape} size={46} />
        </div>
      ))}
    </div>
  );
}

// ─── Numbers row (operator options on the horizontal pipe) ────────────────────

function NumbersRow({
  options,
  answer,
  selected,
  isAnswered,
  isCorrect,
  onSelect,
}: {
  options: string[];
  answer: string;
  selected: string | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  onSelect: (op: string) => void;
}) {
  return (
    <div className="relative flex w-full items-center justify-center">
      {/* Horizontal connecting pipe */}
      <div className="absolute inset-0 flex items-center">
        <div className="h-7 w-full rounded-full bg-[#d0d0d0] shadow-[inset_0_2px_6px_rgba(0,0,0,0.20)]" />
      </div>

      {/* Option buttons */}
      <div className="relative z-10 flex gap-4 px-3 py-2">
        {options.map((op) => {
          const isSelected = selected === op;
          const isRight    = op === answer;

          let cls =
            "min-w-[90px] rounded-[18px] border-[3px] px-4 py-3 text-center font-inter text-[22px] font-black leading-none transition-all duration-150 ";

          if (!isAnswered) {
            cls += "bg-card border-border text-card-foreground cursor-pointer hover:bg-muted hover:border-ring hover:-translate-y-0.5";
          } else if (isSelected && isCorrect) {
            cls += "bg-success/35 border-success text-success-ink cursor-default";
          } else if (isSelected && !isCorrect) {
            cls += "bg-danger/30 border-danger text-danger-ink cursor-default";
          } else if (!isSelected && isRight && isAnswered) {
            cls += "bg-success/20 border-success text-success-ink cursor-default";
          } else {
            cls += "bg-muted border-border text-muted-foreground opacity-60 cursor-default";
          }

          return (
            <button
              key={op}
              type="button"
              disabled={isAnswered}
              onClick={() => onSelect(op)}
              className={cls}
            >
              {op}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ShapeSwitchGame() {
  const [puzzle, setPuzzle]     = useState(() => makePuzzle());
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect]   = useState<boolean | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPuzzle(makePuzzle());
      setSelected(null);
      setIsAnswered(false);
      setIsCorrect(null);
    }, 1000);
  }, []);

  const handleSelect = useCallback(
    (op: string) => {
      if (isAnswered) return;
      const correct = checkAnswer(puzzle.input, puzzle.output, op);
      setSelected(op);
      setIsAnswered(true);
      setIsCorrect(correct);
      next();
    },
    [isAnswered, puzzle, next]
  );

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div className="flex flex-col items-center gap-0 select-none">
      {/* INPUT row */}
      <ShapeRow shapes={puzzle.input} />

      {/* Top funnel (wide end up → narrows down) */}
      <Funnel direction="down" />

      {/* NUMBER options on horizontal pipe */}
      <NumbersRow
        options={puzzle.options}
        answer={puzzle.answer}
        selected={selected}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        onSelect={handleSelect}
      />

      {/* Bottom funnel (narrow end up → widens down) */}
      <Funnel direction="up" />

      {/* OUTPUT row */}
      <ShapeRow shapes={puzzle.output} />
    </div>
  );
}

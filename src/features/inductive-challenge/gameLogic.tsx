export type Difficulty = 'Easy' | 'Medium' | 'Hard';

// ─────────────────────────────────────────────
// Figure visual types
// ─────────────────────────────────────────────

/** Horizontal lines, one may have a gap ("broken") */
export interface LinesFigure {
  type: 'lines';
  count: number;
  brokenIndex?: number; // which line index has a gap
}

/** Small cell grid — some cells are filled */
export interface CellGridFigure {
  type: 'cellgrid';
  rows: number;
  cols: number;
  filled: boolean[];
}

/** Row of shapes — each shape is filled or outlined */
export interface ShapeRowFigure {
  type: 'shaperow';
  shapes: Array<{
    form: 'circle' | 'square' | 'triangle' | 'diamond' | 'plus';
    filled: boolean;
  }>;
}

export type FigureData = LinesFigure | CellGridFigure | ShapeRowFigure;

export interface InductivePuzzle {
  figures: FigureData[];
  oddIndex: number;
  rule: string;
  difficulty: Difficulty;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function oddIndex(n: number): number {
  return Math.floor(Math.random() * n);
}

// ─────────────────────────────────────────────
// Puzzle generators
// ─────────────────────────────────────────────

/**
 * All figures have N lines; odd one has N±1 lines.
 */
function genLineCount(n: number): { figures: LinesFigure[]; oddIndex: number; rule: string } {
  const count = 3 + Math.floor(Math.random() * 4); // 3–6
  const figures: LinesFigure[] = Array.from({ length: n }, () => ({ type: 'lines', count }));
  const odd = oddIndex(n);
  const diff = Math.random() < 0.5 ? 1 : -1;
  figures[odd] = { type: 'lines', count: Math.max(2, count + diff) };
  return { figures, oddIndex: odd, rule: `All figures have ${count} horizontal lines` };
}

/**
 * All figures have N lines with the SAME line broken; odd one has a DIFFERENT broken line.
 */
function genBrokenLine(n: number): { figures: LinesFigure[]; oddIndex: number; rule: string } {
  const count = 4 + Math.floor(Math.random() * 3); // 4–6
  const brokenAt = Math.floor(Math.random() * count);
  const figures: LinesFigure[] = Array.from({ length: n }, () => ({ type: 'lines', count, brokenIndex: brokenAt }));
  const odd = oddIndex(n);
  let oddBroken: number;
  do { oddBroken = Math.floor(Math.random() * count); } while (oddBroken === brokenAt);
  figures[odd] = { type: 'lines', count, brokenIndex: oddBroken };
  return {
    figures,
    oddIndex: odd,
    rule: `All figures have the same line broken — one breaks the pattern`,
  };
}

/**
 * All cell-grid figures have the same number of filled cells; odd one has a different count.
 */
function genCellGridCount(n: number): { figures: CellGridFigure[]; oddIndex: number; rule: string } {
  const rows = 2 + Math.floor(Math.random() * 2); // 2–3
  const cols = 3;
  const total = rows * cols;
  const filledCount = 2 + Math.floor(Math.random() * (total - 3));

  function makeGrid(fc: number): CellGridFigure {
    const cells = Array<boolean>(total).fill(false);
    const indices = shuffle([...Array(total).keys()]).slice(0, fc);
    indices.forEach(i => { cells[i] = true; });
    return { type: 'cellgrid', rows, cols, filled: cells };
  }

  const figures: CellGridFigure[] = Array.from({ length: n }, () => makeGrid(filledCount));
  const odd = oddIndex(n);
  const diff = Math.random() < 0.5 ? 1 : -1;
  figures[odd] = makeGrid(Math.max(1, Math.min(total - 1, filledCount + diff)));
  return { figures, oddIndex: odd, rule: `All grids have exactly ${filledCount} filled cells` };
}

/**
 * All figures have the same filled/empty shape in the SAME position;
 * odd one has a different fill at that position.
 */
function genShapeFill(n: number): { figures: ShapeRowFigure[]; oddIndex: number; rule: string } {
  const forms: ShapeRowFigure['shapes'][number]['form'][] = ['circle', 'square', 'triangle', 'diamond', 'plus'];
  const length = 4 + Math.floor(Math.random() * 2); // 4–5 shapes per figure
  const selected = shuffle(forms).slice(0, length);

  // All figures share same fill pattern
  const baseFilled = selected.map(() => Math.random() < 0.5);
  const filledCount = baseFilled.filter(Boolean).length;

  function makeRow(overrideIndex?: number): ShapeRowFigure {
    const shapes = selected.map((form, i) => ({
      form,
      filled: overrideIndex === i ? !baseFilled[i] : baseFilled[i],
    }));
    return { type: 'shaperow', shapes };
  }

  const figures: ShapeRowFigure[] = Array.from({ length: n }, () => makeRow());
  const odd = oddIndex(n);
  const flipPos = Math.floor(Math.random() * length);
  figures[odd] = makeRow(flipPos);
  return {
    figures,
    oddIndex: odd,
    rule: `All figures have the same fill pattern — one shape is different`,
  };
}

/**
 * All figures have the same shape count; odd one has a different count.
 */
function genShapeCount(n: number): { figures: ShapeRowFigure[]; oddIndex: number; rule: string } {
  const form = pick<ShapeRowFigure['shapes'][number]['form']>(['circle', 'square', 'triangle', 'diamond']);
  const count = 3 + Math.floor(Math.random() * 3); // 3–5

  function makeRow(c: number): ShapeRowFigure {
    return {
      type: 'shaperow',
      shapes: Array.from({ length: c }, () => ({ form, filled: true })),
    };
  }

  const figures: ShapeRowFigure[] = Array.from({ length: n }, () => makeRow(count));
  const odd = oddIndex(n);
  const diff = Math.random() < 0.5 ? 1 : -1;
  figures[odd] = makeRow(Math.max(1, count + diff));
  return { figures, oddIndex: odd, rule: `All figures contain ${count} ${form}s` };
}

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────

export function generatePuzzle(level: number): InductivePuzzle {
  const figureCount = level < 5 ? 6 : level < 10 ? 7 : 9;
  const difficulty: Difficulty = level <= 4 ? 'Easy' : level <= 9 ? 'Medium' : 'Hard';

  const generators = [genLineCount, genBrokenLine, genCellGridCount, genShapeFill, genShapeCount];
  const gen = generators[(level - 1) % generators.length];
  const result = gen(figureCount);

  return {
    figures: result.figures,
    oddIndex: result.oddIndex,
    rule: result.rule,
    difficulty,
  };
}

export function checkAnswer(puzzle: InductivePuzzle, selected: number): boolean {
  return selected === puzzle.oddIndex;
}

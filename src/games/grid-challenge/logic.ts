export interface GridDot {
  id: number;
  x: number; // % of container width
  y: number; // % of container height
}

export interface SymmetryChallenge {
  gridA: boolean[][];
  gridB: boolean[][];
  size: number;
  isSymmetric: boolean;
  label: string;
}

export interface LevelConfig {
  dotsToRemember: number;
  totalDots: number;
  gridSize: number;
  symmetryDisplayMs: number;
  blinkDurationMs: number;
}

export function getLevelConfig(level: number): LevelConfig {
  return {
    dotsToRemember: Math.min(2 + level, 8),
    totalDots: Math.min(10 + level * 2, 24),
    gridSize: level <= 2 ? 5 : level <= 5 ? 6 : 7,
    symmetryDisplayMs: Math.max(6000 - (level - 1) * 350, 3000),
    blinkDurationMs: Math.max(2000 - (level - 1) * 150, 700),
  };
}

export function generateDots(count: number): GridDot[] {
  const dots: GridDot[] = [];
  const MIN_DIST = 14;
  let attempts = 0;

  while (dots.length < count && attempts < 3000) {
    attempts++;
    const x = 4 + Math.random() * 92;
    const y = 6 + Math.random() * 82;

    const tooClose = dots.some((d) => {
      const dx = d.x - x;
      // scale y because the container is ~2.5x wider than tall
      const dy = (d.y - y) * 2.2;
      return Math.sqrt(dx * dx + dy * dy) < MIN_DIST;
    });

    if (!tooClose) dots.push({ id: dots.length, x, y });
  }

  return dots;
}

// ── Symmetry helpers ─────────────────────────────────────────────────────────

function buildGrid(size: number): boolean[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.random() > 0.42)
  );
}

function flipH(g: boolean[][]): boolean[][] {
  return g.map((row) => [...row].reverse());
}

function flipV(g: boolean[][]): boolean[][] {
  return [...g].reverse();
}

function rot180(g: boolean[][]): boolean[][] {
  return [...g].reverse().map((row) => [...row].reverse());
}

function mutate(g: boolean[][], n: number): boolean[][] {
  const clone = g.map((r) => [...r]);
  const size = g.length;
  const seen = new Set<number>();
  let placed = 0;
  let tries = 0;
  while (placed < n && tries < 300) {
    tries++;
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    const key = r * 100 + c;
    if (!seen.has(key)) {
      seen.add(key);
      clone[r][c] = !clone[r][c];
      placed++;
    }
  }
  return clone;
}

const LABELS = [
  'Same pattern?',
  'Mirror image?',
  'Flipped pattern?',
  'Rotated but identical?',
  'Are these symmetric?',
];

export function generateSymmetryChallenge(size: number): SymmetryChallenge {
  const gridA = buildGrid(size);
  const isSymmetric = Math.random() < 0.55;
  let gridB: boolean[][];
  let labelIndex: number;

  if (isSymmetric) {
    const pick = Math.floor(Math.random() * 4);
    labelIndex = pick;
    switch (pick) {
      case 0: gridB = gridA.map((r) => [...r]); break;
      case 1: gridB = flipH(gridA); break;
      case 2: gridB = flipV(gridA); break;
      case 3: gridB = rot180(gridA); break;
      default: gridB = gridA.map((r) => [...r]);
    }
  } else {
    labelIndex = 4;
    gridB = mutate(gridA, 2 + Math.floor(Math.random() * 3));
  }

  return { gridA, gridB, size, isSymmetric, label: LABELS[labelIndex] };
}

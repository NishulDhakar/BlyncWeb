export type Symbol = string;

export interface GridCell {
  value: Symbol | null;
  row: number;
  col: number;
}

export interface Puzzle {
  grid: (Symbol | null)[][];
  emptyCells: { row: number; col: number }[];
  targetCell: { row: number; col: number };
  answer: Symbol;
  options: Symbol[];
}

const SYMBOLS: Symbol[] = [
  "➕", "⭕", "△", "⬜", "★", "♦", "🔷", "🌟", "🔶", "🟡", "🟢", "🔺"
];

function generateLatinSquare(size: number, symbols: Symbol[]): (Symbol | null)[][] {
  const grid: (Symbol | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  function isSafe(row: number, col: number, symbol: Symbol): boolean {
    for (let i = 0; i < size; i++) {
      if (grid[row][i] === symbol || grid[i][col] === symbol) return false;
    }
    return true;
  }
  function fill(row: number, col: number): boolean {
    if (row === size) return true;
    const nextRow = col === size - 1 ? row + 1 : row;
    const nextCol = col === size - 1 ? 0 : col + 1;
    for (const symbol of symbols) {
      if (isSafe(row, col, symbol)) {
        grid[row][col] = symbol;
        if (fill(nextRow, nextCol)) return true;
        grid[row][col] = null;
      }
    }
    return false;
  }
  fill(0, 0);
  return grid;
}

export function generatePuzzle(gameNumber: number): Puzzle {
  // 1. Grid size only increases every 10 games (max 8x8)
  const size = Math.min(3 + Math.floor((gameNumber - 1) / 10), 8);

  // Shuffle symbols for variety
  const shuffledSymbols = [...SYMBOLS].sort(() => Math.random() - 0.5);
  const availableSymbols = shuffledSymbols.slice(0, size);

  // Generate full Latin square
  const grid = generateLatinSquare(size, availableSymbols);

// Blanks DECREASE as size grows: small boards = 50-60% blanks, big boards = 25-35% blanks
const maxBlankRatio = 0.6; // for smallest boards
const minBlankRatio = 0.25; // for largest boards
const blankRatio = maxBlankRatio - (size - 3) * ((maxBlankRatio - minBlankRatio) / (8 - 3));
const numToRemove = Math.floor(size * size * blankRatio);

  // Get all cells
  const allCells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      allCells.push({ row: r, col: c });
    }
  }

  // Randomize cell order & pick blanks
  const shuffledCells = allCells.sort(() => Math.random() - 0.5);
  const emptyCells = shuffledCells.slice(0, numToRemove);

  // Ensure some rows/cols have multiple blanks
  ensureMultipleBlanks(emptyCells, size);

  // Pick one blank as target
  const targetCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const answer = grid[targetCell.row][targetCell.col]!;

  // Remove blanks from grid
  for (const cell of emptyCells) {
    grid[cell.row][cell.col] = null;
  }

  // 3. Always generate 4 options (1 correct + 3 plausible distractors)
  const plausibleDistractors = availableSymbols.filter(
    s => s !== answer && !isObviouslyWrong(s, grid, targetCell)
  );

  // If not enough plausible distractors, fill with random remaining symbols
  while (plausibleDistractors.length < 3) {
    const random = availableSymbols.find(s => s !== answer && !plausibleDistractors.includes(s));
    if (random) plausibleDistractors.push(random);
    else break;
  }

  const options = [answer, ...plausibleDistractors.sort(() => Math.random() - 0.5).slice(0, 3)]
    .sort(() => Math.random() - 0.5);

  return { grid, emptyCells, targetCell, answer, options };
}

// Ensure multiple blanks in some rows/columns
function ensureMultipleBlanks(emptyCells: { row: number; col: number }[], size: number) {
  const rowCount = Array(size).fill(0);
  const colCount = Array(size).fill(0);
  for (const cell of emptyCells) {
    rowCount[cell.row]++;
    colCount[cell.col]++;
  }
  if (Math.max(...rowCount) < 2 || Math.max(...colCount) < 2) {
    emptyCells.push({ row: 0, col: 0 }); // force harder deduction
  }
}

// Check if symbol is already in same row/col
function isObviouslyWrong(symbol: Symbol, grid: (Symbol | null)[][], cell: { row: number; col: number }) {
  const size = grid.length;
  for (let i = 0; i < size; i++) {
    if (grid[cell.row][i] === symbol || grid[i][cell.col] === symbol) {
      return true;
    }
  }
  return false;
}


export function checkAnswer(puzzle: Puzzle, symbol: Symbol): boolean {
  return symbol === puzzle.answer;
}

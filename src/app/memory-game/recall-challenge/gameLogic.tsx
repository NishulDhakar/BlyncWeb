/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export interface ColorItem {
    id: number;
    colorName: string;
    twClass: string;
}

export interface LevelConfig {
    level: number;
    count: number;
    gridCols: number;
    memoTime: number; // ms
    bonus: number;
}

/* ------------------------------------------------------------------ */
/* Constants */
/* ------------------------------------------------------------------ */

export const COLOR_POOL: Omit<ColorItem, 'id'>[] = [
    { colorName: 'Red', twClass: 'bg-rose-500' },
    { colorName: 'Blue', twClass: 'bg-blue-500' },
    { colorName: 'Green', twClass: 'bg-emerald-500' },
    { colorName: 'Yellow', twClass: 'bg-amber-400' },
];

export const LEVELS: LevelConfig[] = [
    { level: 1, count: 4, gridCols: 2, memoTime: 3000, bonus: 100 },
    { level: 2, count: 4, gridCols: 2, memoTime: 2700, bonus: 150 },
    { level: 3, count: 4, gridCols: 2, memoTime: 2400, bonus: 200 },
    { level: 4, count: 4, gridCols: 2, memoTime: 2100, bonus: 250 },
    { level: 5, count: 4, gridCols: 2, memoTime: 1800, bonus: 300 },
    { level: 6, count: 4, gridCols: 2, memoTime: 1500, bonus: 350 },
    { level: 7, count: 4, gridCols: 2, memoTime: 1200, bonus: 400 },
    { level: 8, count: 4, gridCols: 2, memoTime: 1000, bonus: 450 },
    { level: 9, count: 4, gridCols: 2, memoTime: 800, bonus: 500 },
    { level: 10, count: 4, gridCols: 2, memoTime: 600, bonus: 600 }
];

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

/**
 * Fisher–Yates shuffle (stable & unbiased)
 */
function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/* ------------------------------------------------------------------ */
/* Game Logic */
/* ------------------------------------------------------------------ */

/**
 * Generates a unique set of colors for a level
 */
export function generateLevelColors(count: number): ColorItem[] {
    const safeCount = Math.min(count, COLOR_POOL.length);
    return shuffle(COLOR_POOL)
        .slice(0, safeCount)
        .map((color, index) => ({
            ...color,
            id: index
        }));
}

/**
 * Picks a random target color from current level
 */
export function pickTargetColor(colors: ColorItem[]): ColorItem {
    if (colors.length === 0) {
        throw new Error('Cannot pick target from empty color list');
    }

    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
}

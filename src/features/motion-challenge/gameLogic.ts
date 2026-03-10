export type EntityType = 'ball' | 'block' | 'obstacle';

export interface Entity {
    id: string;
    type: EntityType;
    color?: string; // Tailwind bg color class
    w: number;
    h: number;
    x: number;
    y: number;
}

export interface LevelDef {
    id: number;
    cols: number;
    rows: number;
    hole: { x: number; y: number };
    entities: Entity[];
}

export type Move = { dx: number; dy: number };

export const DIRECTIONS: Record<string, Move> = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
};

// Return a 2D array indicating which entity ID occupies each cell, or empty string.
export function getGridCache(level: LevelDef, entities: Entity[]): string[][] {
    const grid = Array.from({ length: level.rows }, () =>
        Array(level.cols).fill('')
    );

    for (const ent of entities) {
        for (let r = ent.y; r < ent.y + ent.h; r++) {
            for (let c = ent.x; c < ent.x + ent.w; c++) {
                if (r >= 0 && r < level.rows && c >= 0 && c < level.cols) {
                    grid[r][c] = ent.id;
                }
            }
        }
    }
    return grid;
}

export function isValidMove(
    level: LevelDef,
    entities: Entity[],
    entityId: string,
    dx: number,
    dy: number
): boolean {
    if (dx === 0 && dy === 0) return false;

    const entity = entities.find((e) => e.id === entityId);
    if (!entity) return false;
    if (entity.type === 'obstacle') return false;

    const newX = entity.x + dx;
    const newY = entity.y + dy;

    // Boundary check
    if (
        newX < 0 ||
        newY < 0 ||
        newX + entity.w > level.cols ||
        newY + entity.h > level.rows
    ) {
        return false;
    }

    const grid = getGridCache(level, entities);

    // Collision check
    for (let r = newY; r < newY + entity.h; r++) {
        for (let c = newX; c < newX + entity.w; c++) {
            const cell = grid[r][c];
            // Valid if cell is empty or occupied by THE SAME entity
            if (cell !== '' && cell !== entity.id) {
                return false;
            }
        }
    }

    return true;
}

export function getValidMoves(
    level: LevelDef,
    entities: Entity[],
    entityId: string
): Record<string, boolean> {
    return {
        up: isValidMove(level, entities, entityId, 0, -1),
        down: isValidMove(level, entities, entityId, 0, 1),
        left: isValidMove(level, entities, entityId, -1, 0),
        right: isValidMove(level, entities, entityId, 1, 0),
    };
}

export function checkWinPattern(level: LevelDef, entities: Entity[]): boolean {
    const ball = entities.find((e) => e.type === 'ball');
    if (!ball) return false;

    // Win if ball completely spans the hole (usually both are 1x1)
    for (let r = ball.y; r < ball.y + ball.h; r++) {
        for (let c = ball.x; c < ball.x + ball.w; c++) {
            if (r === level.hole.y && c === level.hole.x) {
                return true;
            }
        }
    }
    return false;
}

// Predefined levels
export const motionLevels: LevelDef[] = [
    {
        id: 1,
        cols: 4,
        rows: 6,
        hole: { x: 3, y: 1 },
        entities: [
            { id: 'ball', type: 'ball', color: 'bg-red-500', w: 1, h: 1, x: 0, y: 1 },
            { id: 'obs1', type: 'obstacle', w: 1, h: 1, x: 1, y: 0 },
            { id: 'obs2', type: 'obstacle', w: 1, h: 1, x: 2, y: 0 },
            { id: 'obs3', type: 'obstacle', w: 1, h: 1, x: 3, y: 0 },
            { id: 'obs4', type: 'obstacle', w: 1, h: 1, x: 0, y: 2 },
            { id: 'obs5', type: 'obstacle', w: 1, h: 1, x: 2, y: 2 },
            { id: 'b1', type: 'block', color: 'bg-purple-600', w: 1, h: 2, x: 1, y: 1 },
            { id: 'b2', type: 'block', color: 'bg-blue-500', w: 2, h: 1, x: 0, y: 4 },
            { id: 'b3', type: 'block', color: 'bg-amber-500', w: 1, h: 1, x: 3, y: 4 },
            { id: 'b4', type: 'block', color: 'bg-blue-800', w: 1, h: 1, x: 1, y: 5 },
        ],
    },
    {
        id: 2,
        cols: 4,
        rows: 6,
        hole: { x: 3, y: 0 },
        entities: [
            { id: 'ball', type: 'ball', color: 'bg-red-500', w: 1, h: 1, x: 0, y: 5 },
            { id: 'obs1', type: 'obstacle', w: 1, h: 1, x: 1, y: 1 },
            { id: 'obs2', type: 'obstacle', w: 1, h: 1, x: 3, y: 2 },
            { id: 'b1', type: 'block', color: 'bg-indigo-500', w: 2, h: 1, x: 0, y: 2 },
            { id: 'b2', type: 'block', color: 'bg-emerald-500', w: 1, h: 2, x: 2, y: 3 },
            { id: 'b3', type: 'block', color: 'bg-rose-500', w: 1, h: 1, x: 1, y: 4 },
        ],
    },
    {
        id: 3,
        cols: 5,
        rows: 6,
        hole: { x: 4, y: 2 },
        entities: [
            { id: 'ball', type: 'ball', color: 'bg-red-500', w: 1, h: 1, x: 0, y: 2 },
            { id: 'obs1', type: 'obstacle', w: 1, h: 1, x: 2, y: 1 },
            { id: 'obs2', type: 'obstacle', w: 1, h: 1, x: 2, y: 3 },
            { id: 'obs3', type: 'obstacle', w: 1, h: 1, x: 4, y: 0 },
            { id: 'b1', type: 'block', color: 'bg-sky-500', w: 1, h: 3, x: 1, y: 1 },
            { id: 'b2', type: 'block', color: 'bg-orange-500', w: 2, h: 1, x: 2, y: 4 },
            { id: 'b3', type: 'block', color: 'bg-fuchsia-500', w: 1, h: 2, x: 3, y: 1 },
            { id: 'b4', type: 'block', color: 'bg-teal-500', w: 1, h: 1, x: 0, y: 4 },
        ],
    }
];

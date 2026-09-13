"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CircleDot,
  GripHorizontal,
  Mountain,
} from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  canMoveEntity,
  getValidMoves,
  type MotionEntity,
  type MotionLevel,
  type MoveDirection,
} from "./logic";

type Props = {
  level: MotionLevel;
  entities: MotionEntity[];
  selectedId: string | null;
  disabled?: boolean;
  onSelect: (id: string | null) => void;
  onMove: (id: string, direction: MoveDirection) => void;
};

const pieceClasses: Record<MotionEntity["color"], string> = {
  red: "border-[#7f1d1d] bg-[#ef4444] text-white shadow-[inset_-5px_-7px_0_rgba(127,29,29,0.34)]",
  green:
    "border-success-ink bg-success text-black shadow-[inset_-5px_-7px_0_rgba(20,83,45,0.24)]",
  blue: "border-[#1d4ed8] bg-[#38bdf8] text-black shadow-[inset_-5px_-7px_0_rgba(29,78,216,0.22)]",
  amber:
    "border-[#92400e] bg-[#f59e0b] text-black shadow-[inset_-5px_-7px_0_rgba(146,64,14,0.26)]",
  violet:
    "border-[#581c87] bg-[#7c3aed] text-white shadow-[inset_-5px_-7px_0_rgba(88,28,135,0.28)]",
  stone:
    "border-[#52525b] bg-[#a1a1aa] text-[#27272a] shadow-[inset_-5px_-7px_0_rgba(39,39,42,0.2)]",
};

const directionButtons: Array<{
  direction: MoveDirection;
  label: string;
  className: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    direction: "up",
    label: "Move up",
    className: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
    icon: ArrowUp,
  },
  {
    direction: "down",
    label: "Move down",
    className: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    icon: ArrowDown,
  },
  {
    direction: "left",
    label: "Move left",
    className: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
    icon: ArrowLeft,
  },
  {
    direction: "right",
    label: "Move right",
    className: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
    icon: ArrowRight,
  },
];

/**
 * Work out which direction + how many steps the entity should slide
 * to move its top-left corner from its current position toward targetX/Y.
 * Returns null if the first step is blocked.
 */
function resolveSlide(
  entity: MotionEntity,
  targetX: number,
  targetY: number,
  level: MotionLevel,
  entities: MotionEntity[]
): { direction: MoveDirection; steps: number } | null {
  const dx = targetX - entity.x;
  const dy = targetY - entity.y;

  // No movement requested
  if (dx === 0 && dy === 0) return null;

  let direction: MoveDirection;
  let steps: number;

  if (dx !== 0 && dy === 0) {
    direction = dx > 0 ? "right" : "left";
    steps = Math.abs(dx);
  } else if (dy !== 0 && dx === 0) {
    direction = dy > 0 ? "down" : "up";
    steps = Math.abs(dy);
  } else {
    // Diagonal pointer — respect the piece's axis constraint
    if (entity.axis === "vertical") {
      direction = dy > 0 ? "down" : "up";
      steps = Math.abs(dy);
    } else if (entity.axis === "horizontal") {
      direction = dx > 0 ? "right" : "left";
      steps = Math.abs(dx);
    } else {
      // axis === "both" (ball): prefer the dominant axis
      if (Math.abs(dx) >= Math.abs(dy)) {
        direction = dx > 0 ? "right" : "left";
        steps = Math.abs(dx);
      } else {
        direction = dy > 0 ? "down" : "up";
        steps = Math.abs(dy);
      }
    }
  }

  // Verify the first step is legal (axis check + collision)
  if (!canMoveEntity(level, entities, entity.id, direction)) return null;

  return { direction, steps };
}

/**
 * Given an entity and a resolved slide, return the set of cells
 * that the entity's footprint will occupy after moving.
 * Used to highlight the destination zone on the board.
 */
function projectedCells(
  entity: MotionEntity,
  slide: { direction: MoveDirection; steps: number }
): Array<{ x: number; y: number }> {
  let nx = entity.x;
  let ny = entity.y;
  if (slide.direction === "left") nx -= slide.steps;
  if (slide.direction === "right") nx += slide.steps;
  if (slide.direction === "up") ny -= slide.steps;
  if (slide.direction === "down") ny += slide.steps;

  const cells: Array<{ x: number; y: number }> = [];
  for (let cx = nx; cx < nx + entity.w; cx++) {
    for (let cy = ny; cy < ny + entity.h; cy++) {
      cells.push({ x: cx, y: cy });
    }
  }
  return cells;
}

type DropState = {
  entityId: string;
  valid: boolean;
  /** Cells that the dragged piece will land on (destination footprint) */
  highlightCells: Array<{ x: number; y: number }>;
} | null;

export default function MotionChallengeBoard({
  level,
  entities,
  selectedId,
  disabled = false,
  onSelect,
  onMove,
}: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropState, setDropState] = useState<DropState>(null);

  // Track pointer to the board to suppress phantom dragLeave events
  // that fire when the cursor moves from a grid cell onto an entity button.
  const dragEnterCount = useRef(0);

  /** Convert client coordinates → grid cell {x, y} */
  function cellFromPoint(clientX: number, clientY: number) {
    const board = boardRef.current;
    if (!board) return null;
    const rect = board.getBoundingClientRect();
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;
    const cellW = rect.width / level.cols;
    const cellH = rect.height / level.rows;
    const x = Math.floor(relX / cellW);
    const y = Math.floor(relY / cellH);
    if (x < 0 || y < 0 || x >= level.cols || y >= level.rows) return null;
    return { x, y };
  }

  /** Called when any draggable entity's drag starts */
  function handleDragStart(entity: MotionEntity) {
    if (disabled || entity.type === "rock") return;
    dragEnterCount.current = 0;
    setDragId(entity.id);
    onSelect(entity.id);
  }

  /** Board-level dragEnter — count entries so we can ignore child leaves */
  function handleBoardDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    dragEnterCount.current += 1;
  }

  /** Board-level dragOver — compute drop preview */
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!dragId) return;

    const cell = cellFromPoint(e.clientX, e.clientY);
    if (!cell) {
      setDropState(null);
      return;
    }

    const entity = entities.find((en) => en.id === dragId);
    if (!entity) return;

    const slide = resolveSlide(entity, cell.x, cell.y, level, entities);

    if (!slide) {
      setDropState({ entityId: dragId, valid: false, highlightCells: [] });
    } else {
      setDropState({
        entityId: dragId,
        valid: true,
        highlightCells: projectedCells(entity, slide),
      });
    }
  }

  /** Board-level drop — execute the slide */
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!dragId) return;

    const cell = cellFromPoint(e.clientX, e.clientY);
    if (cell) {
      const entity = entities.find((en) => en.id === dragId);
      if (entity) {
        const slide = resolveSlide(entity, cell.x, cell.y, level, entities);
        if (slide) {
          // Each onMove applies one step; React functional updates chain correctly
          for (let i = 0; i < slide.steps; i++) {
            onMove(dragId, slide.direction);
          }
        }
      }
    }
    dragEnterCount.current = 0;
    setDragId(null);
    setDropState(null);
  }

  /** Board-level dragLeave — only clear when the cursor truly leaves the board */
  function handleBoardDragLeave() {
    dragEnterCount.current -= 1;
    if (dragEnterCount.current <= 0) {
      dragEnterCount.current = 0;
      setDropState(null);
    }
  }

  function handleDragEnd() {
    dragEnterCount.current = 0;
    setDragId(null);
    setDropState(null);
  }

  return (
    <div className="mx-auto w-full max-w-[min(92vw,560px)] lg:max-w-[min(100%,560px,calc(100svh-22rem))]">
      <div
        ref={boardRef}
        className="relative aspect-square overflow-hidden rounded-lg border-4 border-border bg-background shadow-pop-xl"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${level.rows}, minmax(0, 1fr))`,
        }}
        onDragEnter={handleBoardDragEnter}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleBoardDragLeave}
      >
        {/* ── Grid cells ── */}
        {Array.from({ length: level.rows * level.cols }).map((_, index) => {
          const x = index % level.cols;
          const y = Math.floor(index / level.cols);
          const isHole = level.hole.x === x && level.hole.y === y;

          const isHighlighted =
            dropState?.valid &&
            dropState.highlightCells.some((c) => c.x === x && c.y === y);

          // Show a faint red outline when drag is active but invalid
          const isDragActive = !!dragId && dropState !== null;
          const isInvalid = isDragActive && !dropState?.valid;

          return (
            <div
              key={`${x}-${y}`}
              className={cn(
                "border border-border bg-card transition-colors duration-75",
                (x + y) % 2 === 0 && "bg-muted",
                isHole && "flex items-center justify-center bg-[#3b0000] ring-2 ring-inset ring-[#ef4444]/50 shadow-[inset_0_0_18px_rgba(239,68,68,0.30)]",
                isHighlighted &&
                  "bg-arcade/25 ring-2 ring-inset ring-arcade/70",
                isInvalid &&
                  !isHole &&
                  "bg-red-950/30"
              )}
            >
              {isHole && (
                <div className="relative flex size-[72%] items-center justify-center">
                  {/* outer glow ring */}
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#ef4444]/30" />
                  {/* target circle */}
                  <div className="relative flex size-full items-center justify-center rounded-full border-4 border-[#ef4444] bg-[#1a0000] shadow-[0_0_18px_4px_rgba(239,68,68,0.55),inset_0_0_10px_rgba(239,68,68,0.25)]">
                    <CircleDot className="size-5 text-[#ef4444] drop-shadow-[0_0_6px_rgba(239,68,68,0.9)] sm:size-7" />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ── Entities ── */}
        {entities.map((entity) => {
          const selected = selectedId === entity.id;
          const isDragging = dragId === entity.id;
          const validMoves = selected
            ? getValidMoves(level, entities, entity.id)
            : null;
          const canSelect = !disabled && entity.type !== "rock";

          return (
            <button
              key={entity.id}
              type="button"
              disabled={!canSelect}
              draggable={canSelect}
              onClick={() => onSelect(entity.id)}
              onDragStart={(e) => {
                // Use a transparent 1×1 pixel as drag image so the ghost
                // doesn't obscure the board highlight
                const ghost = document.createElement("div");
                ghost.style.cssText =
                  "width:1px;height:1px;position:fixed;top:-9999px";
                document.body.appendChild(ghost);
                e.dataTransfer.setDragImage(ghost, 0, 0);
                requestAnimationFrame(() => document.body.removeChild(ghost));
                handleDragStart(entity);
              }}
              onDragEnd={handleDragEnd}
              className={cn(
                "absolute z-10 flex items-center justify-center border-4 transition-[left,top,transform,filter,opacity,box-shadow] duration-200",
                entity.type === "ball" ? "rounded-full" : "rounded-md",
                pieceClasses[entity.color],
                canSelect &&
                  "cursor-grab hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-ring/40 active:cursor-grabbing",
                entity.type === "rock" && "cursor-not-allowed",
                selected &&
                  "z-20 ring-4 ring-arcade ring-offset-2 ring-offset-background",
                isDragging && "opacity-40 scale-95"
              )}
              style={{
                left: `${(entity.x / level.cols) * 100}%`,
                top: `${(entity.y / level.rows) * 100}%`,
                width: `${(entity.w / level.cols) * 100}%`,
                height: `${(entity.h / level.rows) * 100}%`,
              }}
              aria-label={
                entity.type === "ball"
                  ? "Red ball"
                  : entity.type === "rock"
                    ? "Fixed rock"
                    : "Movable block"
              }
            >
              {entity.type === "rock" ? (
                <Mountain className="size-6 sm:size-8" />
              ) : entity.type === "ball" ? (
                <span className="size-[58%] rounded-full bg-white/20 shadow-[inset_2px_2px_0_rgba(255,255,255,0.2)]" />
              ) : (
                <GripHorizontal className="size-6 opacity-65 sm:size-8" />
              )}

              {/* Arrow buttons (click-to-move still works alongside drag) */}
              {selected && validMoves && (
                <span className="pointer-events-none absolute inset-0">
                  {directionButtons.map(
                    ({ direction, label, className, icon: Icon }) => {
                      if (!validMoves[direction]) return null;

                      return (
                        <span
                          key={direction}
                          className={cn(
                            "pointer-events-auto absolute",
                            className
                          )}
                        >
                          <button
                            type="button"
                            aria-label={label}
                            onClick={(event) => {
                              event.stopPropagation();
                              onMove(entity.id, direction);
                            }}
                            className="flex size-8 items-center justify-center rounded-full border-2 border-black bg-arcade text-black shadow-pixel-sm transition hover:-translate-y-0.5 sm:size-9"
                          >
                            <Icon className="size-4 sm:size-5" />
                          </button>
                        </span>
                      );
                    }
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Shared pseudo-random helpers.
 *
 * Every game used to ship its own copy of `randomInt` / `shuffle` / `roundTo`
 * (eight near-identical definitions across the old game files). Import from
 * here instead — one implementation, one place to fix bias bugs.
 */

/** Inclusive on both ends. */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Unbiased Fisher–Yates. Returns a new array; never mutates the input. */
export function shuffle<T>(items: readonly T[]): T[] {
  const output = [...items];
  for (let i = output.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}

/** One random element, or undefined for an empty array. */
export function pickOne<T>(items: readonly T[]): T | undefined {
  return items.length === 0 ? undefined : items[randomInt(0, items.length - 1)];
}

/** `count` distinct elements, in random order. */
export function sample<T>(items: readonly T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

export function roundTo(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

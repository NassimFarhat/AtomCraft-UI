/** Keyboard navigation inside a list of items (APG roving tabindex / active descendant). */

export type Orientation = "horizontal" | "vertical" | "both";
export type Direction = "ltr" | "rtl";

export type NavigationOptions = {
  orientation?: Orientation;
  /** Wrap from the last item to the first and back. */
  loop?: boolean;
  dir?: Direction;
};

type Move = "next" | "previous" | "first" | "last";

const EDGE_KEYS: Readonly<Record<string, Move>> = { Home: "first", End: "last" };
const VERTICAL_KEYS: Readonly<Record<string, Move>> = { ArrowDown: "next", ArrowUp: "previous" };
const HORIZONTAL_KEYS: Readonly<Record<Direction, Readonly<Record<string, Move>>>> = {
  ltr: { ArrowRight: "next", ArrowLeft: "previous" },
  rtl: { ArrowLeft: "next", ArrowRight: "previous" },
};

function moveFor(key: string, orientation: Orientation, dir: Direction): Move | undefined {
  const horizontal = orientation === "vertical" ? {} : HORIZONTAL_KEYS[dir];
  const vertical = orientation === "horizontal" ? {} : VERTICAL_KEYS;
  return EDGE_KEYS[key] ?? horizontal[key] ?? vertical[key];
}

function step(current: number, count: number, move: Move, loop: boolean): number {
  if (move === "first") return 0;
  if (move === "last") return count - 1;
  const target = move === "next" ? current + 1 : current - 1;
  if (loop) return (target + count) % count;
  return Math.min(Math.max(target, 0), count - 1);
}

/** Index to focus after `key`, or `undefined` when the key is not a navigation key. */
export function getNextIndex(
  current: number,
  count: number,
  key: string,
  { orientation = "vertical", loop = true, dir = "ltr" }: NavigationOptions = {},
): number | undefined {
  if (count === 0) return undefined;
  const move = moveFor(key, orientation, dir);
  return move === undefined ? undefined : step(current, count, move, loop);
}

/** Index of the next item whose label starts with `query`, searching after `startIndex`. */
export function findTypeaheadMatch(
  labels: readonly string[],
  query: string,
  startIndex: number,
): number | undefined {
  const needle = query.toLocaleLowerCase();
  const ordered = labels.map((label, index) => ({ label, index }));
  const rotated = [...ordered.slice(startIndex + 1), ...ordered.slice(0, startIndex + 1)];
  return rotated.find(({ label }) => label.trim().toLocaleLowerCase().startsWith(needle))?.index;
}

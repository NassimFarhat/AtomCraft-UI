/** Floating element positioning (tooltips, popovers, menus). Pure: easy to test. */

export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";

export type Rect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};
export type Size = { readonly width: number; readonly height: number };

export type PositionOptions = {
  side?: Side;
  align?: Align;
  /** Gap between the anchor and the floating element, in px. */
  offset?: number;
  /** Minimum distance kept from the viewport edges, in px. */
  padding?: number;
};

export type Position = { readonly x: number; readonly y: number; readonly side: Side };

const OPPOSITE: Readonly<Record<Side, Side>> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const isVertical = (side: Side): boolean => side === "top" || side === "bottom";

function alignOffset(
  anchorStart: number,
  anchorSize: number,
  floatingSize: number,
  align: Align,
): number {
  if (align === "start") return anchorStart;
  if (align === "end") return anchorStart + anchorSize - floatingSize;
  return anchorStart + (anchorSize - floatingSize) / 2;
}

function place(anchor: Rect, floating: Size, side: Side, align: Align, offset: number): Position {
  if (isVertical(side)) {
    const y =
      side === "top" ? anchor.y - floating.height - offset : anchor.y + anchor.height + offset;
    return { x: alignOffset(anchor.x, anchor.width, floating.width, align), y, side };
  }
  const x = side === "left" ? anchor.x - floating.width - offset : anchor.x + anchor.width + offset;
  return { x, y: alignOffset(anchor.y, anchor.height, floating.height, align), side };
}

function overflows(position: Position, floating: Size, viewport: Size, padding: number): boolean {
  return isVertical(position.side)
    ? position.y < padding || position.y + floating.height > viewport.height - padding
    : position.x < padding || position.x + floating.width > viewport.width - padding;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), Math.max(min, max));

/**
 * Places `floating` next to `anchor`, flips to the opposite side when it does not fit,
 * then shifts it along the cross axis to stay inside the viewport.
 */
export function computePosition(
  anchor: Rect,
  floating: Size,
  viewport: Size,
  { side = "bottom", align = "center", offset = 8, padding = 8 }: PositionOptions = {},
): Position {
  const preferred = place(anchor, floating, side, align, offset);
  const flipped = place(anchor, floating, OPPOSITE[side], align, offset);
  const chosen =
    overflows(preferred, floating, viewport, padding) &&
    !overflows(flipped, floating, viewport, padding)
      ? flipped
      : preferred;
  return {
    side: chosen.side,
    x: clamp(chosen.x, padding, viewport.width - floating.width - padding),
    y: clamp(chosen.y, padding, viewport.height - floating.height - padding),
  };
}

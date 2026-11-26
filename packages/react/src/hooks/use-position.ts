import { computePosition } from "@atomscraft/core";
import type { Align, Side } from "@atomscraft/core";
import { useCallback, useLayoutEffect, useState } from "react";
import type { CSSProperties, RefObject } from "react";

export type UsePositionOptions = { side?: Side; align?: Align; offset?: number; open: boolean };

const HIDDEN: CSSProperties = { position: "fixed", top: 0, left: 0, visibility: "hidden" };

type PositionState = {
  style: CSSProperties;
  side: Side;
  /** Width of the anchor, for layers that match their trigger, such as a listbox. */
  anchorWidth: number | undefined;
};

/** Keeps a fixed-position floating element next to its anchor while open. */
export function usePosition(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  { side = "bottom", align = "center", offset = 8, open }: UsePositionOptions,
): PositionState {
  const [state, setState] = useState<PositionState>({
    style: HIDDEN,
    side,
    anchorWidth: undefined,
  });

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const size = { width: floating.offsetWidth, height: floating.offsetHeight };
    const anchorRect = anchor.getBoundingClientRect();
    const position = computePosition(anchorRect, size, viewport, { side, align, offset });
    setState({
      style: { position: "fixed", top: position.y, left: position.x },
      side: position.side,
      anchorWidth: anchorRect.width,
    });
  }, [anchorRef, floatingRef, side, align, offset]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, update]);

  return state;
}

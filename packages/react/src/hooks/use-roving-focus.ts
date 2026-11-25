import { getNextIndex } from "@atomcraft/core";
import type { Orientation } from "@atomcraft/core";
import { useCallback } from "react";
import type { KeyboardEvent, RefObject } from "react";
import { useAtomCraft } from "../provider";
import { useTypeahead } from "./use-typeahead";

const ITEM_SELECTOR = "[data-roving-item]:not([disabled]):not([aria-disabled='true'])";

export type RovingFocusOptions = {
  orientation?: Orientation;
  loop?: boolean;
  /** Focus items by typing their first letters (menus, listboxes). */
  typeahead?: boolean;
};

/**
 * Arrow-key, Home/End (and optionally typeahead) navigation between the
 * `[data-roving-item]` descendants of a container. Returns the keydown handler.
 */
export function useRovingFocus(
  containerRef: RefObject<HTMLElement | null>,
  { orientation = "vertical", loop = true, typeahead = false }: RovingFocusOptions = {},
): (event: KeyboardEvent) => void {
  const { dir } = useAtomCraft();
  const matchTypeahead = useTypeahead();

  return useCallback(
    (event: KeyboardEvent) => {
      const items = [...(containerRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? [])];
      const current = items.findIndex((item) => item === document.activeElement);
      const next = getNextIndex(current, items.length, event.key, { orientation, loop, dir });
      const labels = items.map((item) => item.textContent ?? "");
      const target = next ?? (typeahead ? matchTypeahead(event, labels, current) : undefined);
      if (target === undefined) return;
      event.preventDefault();
      items[target]?.focus();
    },
    [containerRef, orientation, loop, dir, typeahead, matchTypeahead],
  );
}

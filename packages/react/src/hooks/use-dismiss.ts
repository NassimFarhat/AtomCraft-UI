import { useEffect, useRef } from "react";
import type { RefObject } from "react";

type DismissEntry = {
  refs: ReadonlyArray<RefObject<HTMLElement | null>>;
  onDismiss: () => void;
};

const activeEntries: DismissEntry[] = [];

/** Used by anchored layers to keep focus inside a nested active layer. */
export function isInsideDismissLayer(target: EventTarget | null): boolean {
  return activeEntries.some((entry) =>
    entry.refs.some((ref) => target instanceof Node && ref.current?.contains(target)),
  );
}

/**
 * Closes a floating layer on Escape or on a pointer press outside every given element.
 * The anchor is usually passed too, so pressing it toggles instead of reopening.
 */
export function useDismiss(
  refs: ReadonlyArray<RefObject<HTMLElement | null>>,
  onDismiss: () => void,
  enabled: boolean,
): void {
  const onDismissRef = useRef(onDismiss);
  const refsRef = useRef(refs);

  useEffect(() => {
    onDismissRef.current = onDismiss;
    refsRef.current = refs;
  });

  useEffect(() => {
    if (!enabled) return undefined;
    const entry: DismissEntry = {
      refs: refsRef.current,
      onDismiss: () => onDismissRef.current(),
    };
    activeEntries.push(entry);
    const isInside = (target: EventTarget | null) =>
      refsRef.current.some((ref) => target instanceof Node && ref.current?.contains(target));
    const handlePointerDown = (event: PointerEvent) => {
      if (activeEntries[activeEntries.length - 1] !== entry) return;
      if (!isInside(event.target)) onDismissRef.current();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeEntries[activeEntries.length - 1] !== entry) return;
      if (event.key === "Escape") onDismissRef.current();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      const index = activeEntries.indexOf(entry);
      if (index !== -1) activeEntries.splice(index, 1);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);
}

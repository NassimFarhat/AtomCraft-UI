import { useEffect, useRef } from "react";
import type { RefObject } from "react";

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
    const isInside = (target: EventTarget | null) =>
      refsRef.current.some((ref) => target instanceof Node && ref.current?.contains(target));
    const handlePointerDown = (event: PointerEvent) => {
      if (!isInside(event.target)) onDismissRef.current();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismissRef.current();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);
}

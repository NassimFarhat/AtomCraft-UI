import { useCallback } from "react";
import type { Ref, RefCallback, RefObject } from "react";

export type PossibleRef<T> = Ref<T> | undefined;

export function setRef<T>(ref: PossibleRef<T>, value: T | null): void {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    (ref as { current: T | null }).current = value;
  }
}

export function composeRefs<T>(...refs: PossibleRef<T>[]): (node: T | null) => void {
  return (node) => {
    refs.forEach((ref) => setRef(ref, node));
  };
}

/** Stable callback ref that forwards the node to both refs (own ref + forwarded ref). */
export function useComposedRefs<T>(
  first: PossibleRef<T>,
  second: PossibleRef<T>,
): (node: T | null) => void {
  return useCallback(
    (node: T | null) => {
      setRef(first, node);
      setRef(second, node);
    },
    [first, second],
  );
}

/**
 * Feeds a specific element into a ref that holds the generic `HTMLElement`.
 * The floating layers keep `HTMLElement` refs, so every consumer can share them.
 */
export const elementRef =
  <T extends HTMLElement>(ref: RefObject<HTMLElement | null>): RefCallback<T> =>
  (node) => {
    ref.current = node;
  };

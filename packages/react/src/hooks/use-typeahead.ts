import { findTypeaheadMatch } from "@atomcraft/core";
import { useCallback, useRef } from "react";
import type { KeyboardEvent } from "react";

/** Typing pauses longer than this start a new search, as native menus do. */
const RESET_MS = 500;

export type TypeaheadMatcher = (
  event: KeyboardEvent,
  labels: readonly string[],
  from: number,
) => number | undefined;

/**
 * "Type to find" for menus and listboxes: accumulates the typed letters and
 * returns the index of the next label that starts with them.
 */
export function useTypeahead(): TypeaheadMatcher {
  const query = useRef({ text: "", time: 0 });
  return useCallback((event, labels, from) => {
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return undefined;
    const isContinuation = event.timeStamp - query.current.time < RESET_MS;
    const text = (isContinuation ? query.current.text : "") + event.key;
    query.current = { text, time: event.timeStamp };
    /** A repeated single letter walks the matches; a longer query restarts the search. */
    return findTypeaheadMatch(labels, text, text.length > 1 ? from - 1 : from);
  }, []);
}

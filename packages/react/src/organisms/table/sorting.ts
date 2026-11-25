export type SortDirection = "ascending" | "descending";
export type SortState = { key: string; direction: SortDirection } | null;
export type SortValue = string | number | Date | boolean | null | undefined;

/** Next state when a header is pressed: ascending → descending → unsorted. */
export function nextSort(current: SortState, key: string): SortState {
  if (current?.key !== key) return { key, direction: "ascending" };
  return current.direction === "ascending" ? { key, direction: "descending" } : null;
}

function compareValues(first: SortValue, second: SortValue, collator: Intl.Collator): number {
  if (first === second) return 0;
  if (first === null || first === undefined) return 1;
  if (second === null || second === undefined) return -1;
  if (typeof first === "string" && typeof second === "string")
    return collator.compare(first, second);
  return Number(first) - Number(second);
}

/** Stable, locale-aware sort; empty values always last. */
export function sortRows<T>(
  rows: readonly T[],
  sort: SortState,
  getValue: (row: T, key: string) => SortValue,
  locale: string,
): T[] {
  if (!sort) return [...rows];
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" });
  const factor = sort.direction === "ascending" ? 1 : -1;
  return [...rows].sort(
    (a, b) => factor * compareValues(getValue(a, sort.key), getValue(b, sort.key), collator),
  );
}

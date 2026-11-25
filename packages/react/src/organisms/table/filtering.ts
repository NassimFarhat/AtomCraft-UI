import { includesText } from "@atomcraft/core";
import type { SortValue } from "./sorting";

/** True when any of the row's searchable values contains the query. */
export const rowMatches = (values: readonly SortValue[], query: string): boolean =>
  query.trim() === "" ||
  values.some(
    (value) => value !== null && value !== undefined && includesText(String(value), query),
  );

/** Client-side text filter. `getValues` returns the searchable values of a row. */
export function filterRows<T>(
  rows: readonly T[],
  query: string,
  getValues: (row: T) => SortValue[],
): T[] {
  if (query.trim() === "") return [...rows];
  return rows.filter((row) => rowMatches(getValues(row), query));
}

/** The slice of rows shown on `page`, counting pages from one. */
export function pageSlice<T>(rows: readonly T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export const pageCountOf = (total: number, pageSize: number): number =>
  Math.max(1, Math.ceil(total / pageSize));

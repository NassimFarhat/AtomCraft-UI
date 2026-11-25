export type PageItem = number | "ellipsis-start" | "ellipsis-end";

/**
 * Pages to display: always the first and last, `siblings` around the current one,
 * and an ellipsis where pages are skipped. The length stays constant while paging.
 */
export function getPageItems(current: number, total: number, siblings = 1): PageItem[] {
  const visible = siblings * 2 + 5;
  if (total <= visible) return Array.from({ length: total }, (_, index) => index + 1);

  const start = Math.max(2, Math.min(current - siblings, total - siblings * 2 - 2));
  const end = Math.min(total - 1, Math.max(current + siblings, siblings * 2 + 3));
  const middle = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return [
    1,
    ...(start > 2 ? (["ellipsis-start"] as const) : []),
    ...middle,
    ...(end < total - 1 ? (["ellipsis-end"] as const) : []),
    total,
  ];
}

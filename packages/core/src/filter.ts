/** Text matching for Combobox and CommandPalette: same rules in every consumer. */

/** Lowercase and strip diacritics, so "é" matches "e" and "Ş" matches "s". */
export const normalizeText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase();

export type MatchRange = { start: number; end: number };

/**
 * Case- and accent-insensitive substring match.
 * Returns the matched range in the original string, or null when there is no match.
 */
export function matchText(text: string, query: string): MatchRange | null {
  if (query.trim() === "") return { start: 0, end: 0 };
  const index = normalizeText(text).indexOf(normalizeText(query));
  return index === -1 ? null : { start: index, end: index + query.trim().length };
}

export const includesText = (text: string, query: string): boolean =>
  matchText(text, query) !== null;

/** Splits `text` into the part before the match, the match and the part after it. */
export function splitMatch(text: string, query: string): [string, string, string] {
  const range = matchText(text, query);
  if (!range || range.end === range.start) return [text, "", ""];
  return [text.slice(0, range.start), text.slice(range.start, range.end), text.slice(range.end)];
}

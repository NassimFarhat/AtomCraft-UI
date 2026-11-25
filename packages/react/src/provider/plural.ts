/**
 * Picks the `one` or `other` wording for a count.
 *
 * It asks `Intl.PluralRules` for the locale's category and keeps the two forms
 * English, French and Arabic need for the built-in labels. A locale with more
 * categories (dual, few, many) needs its own `messages`, so applications stay
 * in charge of their own copy.
 */
export function pluralize(
  locale: string,
  count: number,
  forms: { one: string; other: string },
): string {
  const category = new Intl.PluralRules(locale).select(count);
  return category === "one" ? forms.one : forms.other;
}

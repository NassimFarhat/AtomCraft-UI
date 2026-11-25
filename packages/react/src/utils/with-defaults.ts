/**
 * Fills in default props, keeping a default when the prop was passed as
 * `undefined` — which plain spreading would overwrite with that `undefined`.
 *
 * The result has every defaulted key present and defined, so components can
 * read `settings.paginated` without repeating `?? false` at each use.
 */
export function withDefaults<Props extends object, Defaults extends Partial<Props>>(
  props: Props,
  defaults: Defaults,
): Omit<Props, keyof Defaults> & Required<Defaults> {
  const given = Object.entries(props).filter(([, value]) => value !== undefined);
  return { ...defaults, ...Object.fromEntries(given) } as Omit<Props, keyof Defaults> &
    Required<Defaults>;
}

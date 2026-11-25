/**
 * Boolean data attribute: present (empty string) when true, absent when false.
 * Lets CSS target `[data-disabled]` instead of `[data-disabled="true"]`.
 */
export function dataAttr(condition: boolean | undefined): "" | undefined {
  return condition ? "" : undefined;
}

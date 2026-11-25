import type { ReactNode } from "react";

export type ListOption = {
  /** Submitted and compared value. Unique within the list. */
  value: string;
  /** Visible text. Also what typing filters and matches on. */
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
  /** Heading this option is listed under. */
  group?: string;
};

export type OptionGroup = {
  name: string | undefined;
  /** Options with the index they have in the flat list, which ARIA and the keyboard use. */
  items: { option: ListOption; index: number }[];
};

/** Groups options while keeping each one's position in the flat list. */
export function groupOptions(options: readonly ListOption[]): OptionGroup[] {
  const groups: OptionGroup[] = [];
  options.forEach((option, index) => {
    const name = option.group;
    const last = groups[groups.length - 1];
    if (last && last.name === name) last.items.push({ option, index });
    else groups.push({ name, items: [{ option, index }] });
  });
  return groups;
}

export const isSelectable = (option: ListOption | undefined): boolean =>
  option !== undefined && option.disabled !== true;

/** First selectable index at or after `from`, searching in `step` direction. */
export function findSelectable(options: readonly ListOption[], from: number, step: 1 | -1): number {
  for (let index = from; index >= 0 && index < options.length; index += step) {
    if (isSelectable(options[index])) return index;
  }
  return -1;
}

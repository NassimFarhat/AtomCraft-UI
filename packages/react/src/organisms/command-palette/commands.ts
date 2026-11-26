import { includesText } from "@atomscraft/core";
import type { ReactNode } from "react";

export type Command = {
  id: string;
  label: string;
  /** Heading this command is listed under, e.g. "Navigation". */
  group?: string;
  icon?: ReactNode;
  /** Shortcut hint shown on the right, e.g. "⌘S". */
  shortcut?: ReactNode;
  /** Extra words that should match this command, such as synonyms. */
  keywords?: readonly string[];
  disabled?: boolean;
  onSelect: () => void;
};

/** Matches the label and the keywords, so "theme" can find "Switch appearance". */
export const matchesCommand = (command: Command, query: string): boolean =>
  includesText(command.label, query) ||
  (command.keywords ?? []).some((keyword) => includesText(keyword, query));

export const filterCommands = (commands: readonly Command[], query: string): Command[] =>
  query.trim() === ""
    ? [...commands]
    : commands.filter((command) => matchesCommand(command, query));

export type CommandGroup = {
  name: string | undefined;
  items: { command: Command; index: number }[];
};

/** Groups commands while keeping each one's index in the flat list. */
export function groupCommands(commands: readonly Command[]): CommandGroup[] {
  const groups: CommandGroup[] = [];
  commands.forEach((command, index) => {
    const last = groups[groups.length - 1];
    if (last && last.name === command.group) last.items.push({ command, index });
    else groups.push({ name: command.group, items: [{ command, index }] });
  });
  return groups;
}

/** Next enabled index in `step` direction, wrapping around the ends. */
export function nextEnabled(commands: readonly Command[], from: number, step: 1 | -1): number {
  const count = commands.length;
  if (count === 0) return -1;
  for (let offset = 1; offset <= count; offset += 1) {
    const index = (((from + step * offset) % count) + count) % count;
    if (commands[index]?.disabled !== true) return index;
  }
  return -1;
}

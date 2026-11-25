import { useEffect, useId, useState } from "react";
import type { KeyboardEvent } from "react";
import { useControllableState } from "../../hooks";
import { filterCommands, nextEnabled } from "./commands";
import type { Command } from "./commands";

export type CommandPaletteOptions = {
  commands: readonly Command[];
  open: boolean | undefined;
  defaultOpen: boolean;
  onOpenChange: ((open: boolean) => void) | undefined;
  /** Key that opens the palette with Ctrl or Command held. `false` registers nothing. */
  hotkey: string | false;
};

/** Opens the palette on Ctrl/Command + the given key, anywhere in the page. */
function useHotkey(key: string | false, onTrigger: () => void) {
  useEffect(() => {
    if (key === false) return undefined;
    const handler = (event: globalThis.KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== key) return;
      event.preventDefault();
      onTrigger();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [key, onTrigger]);
}

/** Open state, query, active command and the keys that drive the palette. */
export function useCommandPalette({ commands, hotkey, ...options }: CommandPaletteOptions) {
  const baseId = useId();
  const [isOpen, setOpenState] = useControllableState({
    value: options.open,
    defaultValue: options.defaultOpen,
    onChange: options.onOpenChange,
  });
  const [query, setQuery] = useState("");
  const [requestedIndex, setRequestedIndex] = useState(0);
  const visible = filterCommands(commands, query);
  /** Derived, so a shrinking list never points past its last command. */
  const activeIndex = Math.min(requestedIndex, visible.length - 1);

  useHotkey(hotkey, () => setOpenState(true));

  const setOpen = (next: boolean) => {
    setOpenState(next);
    if (!next) setQuery("");
  };

  const search = (text: string) => {
    setQuery(text);
    setRequestedIndex(0);
  };

  const run = (command: Command | undefined) => {
    if (!command || command.disabled) return;
    setOpen(false);
    command.onSelect();
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    const steps: Readonly<Record<string, 1 | -1>> = { ArrowDown: 1, ArrowUp: -1 };
    const step = steps[event.key];
    if (step) {
      event.preventDefault();
      setRequestedIndex(nextEnabled(visible, activeIndex, step));
      return;
    }
    if (event.key !== "Enter") return;
    event.preventDefault();
    run(visible[activeIndex]);
  };

  return {
    isOpen,
    setOpen,
    query,
    search,
    visible,
    activeIndex,
    setActiveIndex: setRequestedIndex,
    run,
    handleKeyDown,
    listId: `${baseId}-list`,
    commandId: (index: number) => `${baseId}-command-${index}`,
  };
}

export type CommandPaletteState = ReturnType<typeof useCommandPalette>;

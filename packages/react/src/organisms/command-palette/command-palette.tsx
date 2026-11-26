import { cn } from "@atomscraft/core";
import type { ReactNode } from "react";
import { IconSearch } from "../../icons";
import { useMessages } from "../../provider";
import { Dialog, DialogContent, DialogTitle } from "../dialog";
import { CommandList } from "./command-list";
import type { Command } from "./commands";
import { useCommandPalette } from "./use-command-palette";

export type CommandPaletteProps = {
  commands: readonly Command[];
  open?: boolean | undefined;
  defaultOpen?: boolean;
  onOpenChange?: ((open: boolean) => void) | undefined;
  placeholder?: string;
  /** Shown when nothing matches. */
  empty?: ReactNode;
  /** Key that opens it with Ctrl or Command held. `false` registers no shortcut. */
  hotkey?: string | false;
  /** Accessible name of the dialog. */
  label?: string;
  className?: string;
};

/**
 * Searchable list of actions in a modal dialog, opened with ⌘K or Ctrl+K.
 *
 * Focus stays in the text box and the list follows through
 * `aria-activedescendant`, which is what the APG combobox pattern prescribes.
 */
export function CommandPalette({
  commands,
  open,
  defaultOpen = false,
  onOpenChange,
  placeholder,
  empty,
  hotkey = "k",
  label,
  className,
}: CommandPaletteProps) {
  const messages = useMessages();
  const state = useCommandPalette({ commands, open, defaultOpen, onOpenChange, hotkey });
  const name = label ?? messages.commandPalette;

  return (
    <Dialog open={state.isOpen} onOpenChange={state.setOpen}>
      <DialogContent size="md" showCloseButton={false} className={cn("ac-command", className)}>
        <DialogTitle className="ac-visually-hidden">{name}</DialogTitle>
        <div className="ac-command__search">
          <IconSearch className="ac-command__search-icon" />
          <input
            autoFocus
            type="text"
            role="combobox"
            autoComplete="off"
            value={state.query}
            placeholder={placeholder ?? messages.commandHint}
            aria-expanded="true"
            aria-controls={state.listId}
            aria-autocomplete="list"
            aria-label={name}
            aria-activedescendant={
              state.activeIndex === -1 ? undefined : state.commandId(state.activeIndex)
            }
            className="ac-command__input"
            onChange={(event) => state.search(event.target.value)}
            onKeyDown={state.handleKeyDown}
          />
        </div>
        <CommandList state={state} empty={empty} />
      </DialogContent>
    </Dialog>
  );
}

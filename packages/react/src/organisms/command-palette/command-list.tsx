import { dataAttr, splitMatch } from "@atomcraft/core";
import type { ReactNode } from "react";
import { useMessages } from "../../provider";
import { groupCommands } from "./commands";
import type { Command } from "./commands";
import type { CommandPaletteState } from "./use-command-palette";

/** Wraps the matching part of the label, so it can be highlighted. */
function CommandLabel({ label, query }: { label: string; query: string }) {
  const [before, match, after] = splitMatch(label, query);
  if (match === "") return label;
  return (
    <>
      {before}
      <mark className="ac-listbox__match">{match}</mark>
      {after}
    </>
  );
}

type ItemProps = {
  command: Command;
  index: number;
  state: CommandPaletteState;
};

function CommandItem({ command, index, state }: ItemProps) {
  const active = index === state.activeIndex;
  return (
    <div
      id={state.commandId(index)}
      role="option"
      aria-selected={active}
      aria-disabled={command.disabled || undefined}
      data-slot="command-item"
      data-active={dataAttr(active)}
      data-disabled={dataAttr(command.disabled ?? false)}
      className="ac-listbox__option"
      onPointerMove={() => state.setActiveIndex(index)}
      onClick={() => state.run(command)}
    >
      {command.icon && (
        <span className="ac-listbox__icon" aria-hidden="true">
          {command.icon}
        </span>
      )}
      <span className="ac-listbox__text">
        <span className="ac-listbox__label">
          <CommandLabel label={command.label} query={state.query} />
        </span>
      </span>
      {command.shortcut !== undefined && (
        <span className="ac-listbox__shortcut">{command.shortcut}</span>
      )}
    </div>
  );
}

/** The commands as an APG listbox, grouped by their `group`. */
export function CommandList({ state, empty }: { state: CommandPaletteState; empty: ReactNode }) {
  const messages = useMessages();
  if (state.visible.length === 0) {
    return (
      <div id={state.listId} role="listbox" className="ac-command__list">
        <div className="ac-listbox__empty" role="presentation">
          {empty ?? messages.noResults}
        </div>
      </div>
    );
  }
  return (
    <div id={state.listId} role="listbox" className="ac-command__list">
      {groupCommands(state.visible).map((group) => (
        <div
          key={group.name ?? "ungrouped"}
          role={group.name === undefined ? "presentation" : "group"}
          aria-label={group.name}
          className="ac-listbox__group"
        >
          {group.name !== undefined && (
            <div className="ac-listbox__group-label" role="presentation">
              {group.name}
            </div>
          )}
          {group.items.map(({ command, index }) => (
            <CommandItem key={command.id} command={command} index={index} state={state} />
          ))}
        </div>
      ))}
    </div>
  );
}

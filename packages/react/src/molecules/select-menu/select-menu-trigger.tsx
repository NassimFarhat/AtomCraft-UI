import { dataAttr } from "@atomscraft/core";
import type { ButtonHTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { useTypeahead } from "../../hooks";
import { IconChevronsUpDown } from "../../icons";
import { useMessages } from "../../provider";
import { elementRef } from "../../utils";
import type { Listbox, ListOption } from "../listbox";

export type SelectMenuTriggerProps = {
  listbox: Listbox;
  selected: ListOption | undefined;
  placeholder: string | undefined;
  renderValue: ((option: ListOption) => ReactNode) | undefined;
  disabled: boolean | undefined;
  invalid: boolean;
  buttonProps: ButtonHTMLAttributes<HTMLButtonElement>;
};

/** Letters jump to a matching option, open or closed, like a native select. */
function useSelectTypeahead(listbox: Listbox) {
  const matchTypeahead = useTypeahead();
  return (event: KeyboardEvent<HTMLButtonElement>) => {
    listbox.handleKeyDown(event);
    if (event.defaultPrevented) return;
    const labels = listbox.visible.map((option) => option.label);
    const match = matchTypeahead(event, labels, listbox.activeIndex);
    const option = match === undefined ? undefined : listbox.visible[match];
    if (!option || match === undefined) return;
    event.preventDefault();
    if (listbox.isOpen) listbox.setActiveIndex(match);
    else listbox.select(option);
  };
}

/** The button that shows the current choice and opens the listbox. */
export function SelectMenuTrigger({
  listbox,
  selected,
  placeholder,
  renderValue,
  disabled,
  invalid,
  buttonProps,
}: SelectMenuTriggerProps) {
  const messages = useMessages();
  const handleKeyDown = useSelectTypeahead(listbox);
  const activeId =
    listbox.isOpen && listbox.activeIndex !== -1
      ? listbox.optionId(listbox.activeIndex)
      : undefined;

  return (
    <button
      {...buttonProps}
      ref={elementRef<HTMLButtonElement>(listbox.triggerRef)}
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={listbox.isOpen}
      aria-controls={listbox.isOpen ? listbox.listId : undefined}
      aria-activedescendant={activeId}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      data-placeholder={dataAttr(selected === undefined)}
      className="ac-select-menu__trigger"
      onClick={() => (listbox.isOpen ? listbox.close() : listbox.open())}
      onKeyDown={handleKeyDown}
    >
      <span className="ac-select-menu__value">
        {selected
          ? (renderValue?.(selected) ?? selected.label)
          : (placeholder ?? messages.selectOption)}
      </span>
      <IconChevronsUpDown className="ac-select-menu__indicator" />
    </button>
  );
}

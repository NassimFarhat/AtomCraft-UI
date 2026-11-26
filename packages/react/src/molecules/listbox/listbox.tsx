import { cn, dataAttr, splitMatch } from "@atomscraft/core";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { IconCheck } from "../../icons";
import { useMessages } from "../../provider";
import type { ControlSize } from "../../types";
import { Portal, elementRef } from "../../utils";
import { groupOptions } from "./types";
import type { ListOption } from "./types";
import type { Listbox } from "./use-listbox";

/** Wraps the part of the label that matches the query, so it can be highlighted. */
function HighlightedLabel({ label, query }: { label: string; query: string }) {
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

type OptionProps = {
  option: ListOption;
  index: number;
  listbox: Listbox;
  query: string;
  multiple: boolean;
};

function ListboxOption({ option, index, listbox, query, multiple }: OptionProps) {
  const selected = listbox.isSelected(option.value);
  return (
    <div
      id={listbox.optionId(index)}
      role="option"
      aria-selected={selected}
      aria-disabled={option.disabled || undefined}
      data-slot="listbox-option"
      data-active={dataAttr(index === listbox.activeIndex)}
      data-disabled={dataAttr(option.disabled ?? false)}
      className="ac-listbox__option"
      onPointerMove={() => listbox.setActiveIndex(index)}
      onClick={() => listbox.select(option)}
    >
      {multiple && (
        <span className="ac-listbox__box" aria-hidden="true">
          {selected && <IconCheck />}
        </span>
      )}
      {option.icon && (
        <span className="ac-listbox__icon" aria-hidden="true">
          {option.icon}
        </span>
      )}
      <span className="ac-listbox__text">
        <span className="ac-listbox__label">
          <HighlightedLabel label={option.label} query={query} />
        </span>
        {option.description && (
          <span className="ac-listbox__description">{option.description}</span>
        )}
      </span>
      {!multiple && selected && <IconCheck className="ac-listbox__check" />}
    </div>
  );
}

export type ListboxItemsProps = {
  listbox: Listbox;
  query?: string;
  multiple?: boolean;
  /** Shown when the filter matches nothing. */
  empty?: ReactNode;
};

/** The options themselves, grouped. Shared by the popup list and the CommandPalette. */
export function ListboxItems({ listbox, query = "", multiple = false, empty }: ListboxItemsProps) {
  const messages = useMessages();
  if (listbox.visible.length === 0) {
    return (
      <div className="ac-listbox__empty" role="presentation">
        {empty ?? messages.noResults}
      </div>
    );
  }
  return groupOptions(listbox.visible).map((group) => {
    const options = group.items.map(({ option, index }) => (
      <ListboxOption
        key={option.value}
        option={option}
        index={index}
        listbox={listbox}
        query={query}
        multiple={multiple}
      />
    ));
    if (group.name === undefined) return options;
    return (
      <div key={group.name} role="group" aria-label={group.name} className="ac-listbox__group">
        <div className="ac-listbox__group-label" role="presentation">
          {group.name}
        </div>
        {options}
      </div>
    );
  });
}

export type ListboxContentProps = {
  listbox: Listbox;
  /** Highlighted inside the labels. */
  query?: string | undefined;
  multiple?: boolean | undefined;
  /** Shown when the filter matches nothing. */
  empty?: ReactNode;
  size?: ControlSize | undefined;
  /** Overrides the width, which otherwise matches the control. */
  width?: string | undefined;
  className?: string;
};

/** The popup list of a Combobox, MultiSelect or SelectMenu (APG listbox). */
export function ListboxContent({
  listbox,
  query = "",
  multiple = false,
  empty,
  size = "md",
  width,
  className,
}: ListboxContentProps) {
  const { isOpen, contentRef, listId, activeIndex, position } = listbox;

  useEffect(() => {
    if (!isOpen) return;
    const active = contentRef.current?.querySelector("[data-active]");
    /** Optional: jsdom and other non-visual DOMs do not implement scrolling. */
    active?.scrollIntoView?.({ block: "nearest" });
  }, [isOpen, activeIndex, contentRef]);

  if (!isOpen) return null;
  return (
    <Portal>
      <div
        ref={elementRef<HTMLDivElement>(contentRef)}
        id={listId}
        role="listbox"
        aria-multiselectable={multiple || undefined}
        data-slot="listbox"
        data-size={size}
        data-side={position.side}
        className={cn("ac-listbox", className)}
        style={{
          ...position.style,
          inlineSize: width ?? (position.anchorWidth ? `${position.anchorWidth}px` : undefined),
          minInlineSize: width === undefined && position.anchorWidth ? 0 : undefined,
        }}
      >
        <ListboxItems listbox={listbox} query={query} multiple={multiple} empty={empty} />
      </div>
    </Portal>
  );
}

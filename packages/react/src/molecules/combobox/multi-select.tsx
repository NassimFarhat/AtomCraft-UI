import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { isInvalid } from "../../atoms/input";
import { Tag } from "../../atoms/tag";
import { formatMessage, useMessages } from "../../provider";
import type { ControlSize } from "../../types";
import { elementRef } from "../../utils";
import { ListboxContent } from "../listbox";
import type { Listbox, ListOption } from "../listbox";
import {
  ComboboxFormValues,
  comboboxInputAttributes,
  comboboxRootAttributes,
} from "./combobox-parts";
import type { ComboboxInputProps } from "./combobox";
import { useComboboxState } from "./use-combobox-state";

export type MultiSelectProps = ComboboxInputProps & {
  options: readonly ListOption[];
  values?: readonly string[] | undefined;
  defaultValues?: readonly string[];
  onValuesChange?: ((values: string[]) => void) | undefined;
  placeholder?: string;
  size?: ControlSize;
  invalid?: boolean;
  disabled?: boolean;
  /** Shows the count instead of one tag per choice beyond this many. */
  maxTags?: number;
  empty?: ReactNode;
  /** Submits every selected value with a surrounding form. */
  name?: string | undefined;
  className?: string;
};

type ChoicesProps = {
  chosen: readonly ListOption[];
  maxTags: number;
  disabled: boolean | undefined;
  onRemove: (option: ListOption) => void;
};

/** The choices made so far, as removable tags or as a count once there are many. */
function MultiSelectChoices({ chosen, maxTags, disabled, onRemove }: ChoicesProps) {
  const messages = useMessages();
  if (chosen.length > maxTags) {
    return <Tag size="sm">{formatMessage(messages.selectedCount, { count: chosen.length })}</Tag>;
  }
  return chosen.map((option) => (
    <Tag
      key={option.value}
      size="sm"
      disabled={disabled ?? false}
      removeLabel={formatMessage(messages.removeOption, { option: option.label })}
      onRemove={() => onRemove(option)}
    >
      {option.label}
    </Tag>
  ));
}

type ControlProps = {
  listbox: Listbox;
  chosen: readonly ListOption[];
  query: string;
  onQueryChange: (query: string) => void;
  placeholder: string | undefined;
  maxTags: number;
  disabled: boolean | undefined;
  invalid: boolean;
  inputProps: ComboboxInputProps;
};

/** Tags and the text box, which together make up the control. */
function MultiSelectControl({ listbox, chosen, query, onQueryChange, ...props }: ControlProps) {
  const messages = useMessages();

  /** Backspace in an empty box removes the last choice, as in a mail recipient field. */
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const last = chosen[chosen.length - 1];
    if (event.key === "Backspace" && query === "" && last) listbox.select(last);
    else listbox.handleKeyDown(event);
  };

  return (
    <span className="ac-combobox__tags">
      <MultiSelectChoices
        chosen={chosen}
        maxTags={props.maxTags}
        disabled={props.disabled}
        onRemove={listbox.select}
      />
      <input
        {...props.inputProps}
        {...comboboxInputAttributes(listbox, props.invalid)}
        ref={elementRef<HTMLInputElement>(listbox.triggerRef)}
        value={query}
        placeholder={chosen.length === 0 ? (props.placeholder ?? messages.selectOption) : undefined}
        disabled={props.disabled}
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </span>
  );
}

/** Multiple-choice combobox: the choices stay visible as removable tags. */
export function MultiSelect({
  options,
  values,
  defaultValues = [],
  onValuesChange,
  placeholder,
  size,
  invalid = false,
  disabled,
  maxTags = 3,
  empty,
  name,
  className,
  "aria-invalid": ariaInvalid,
  ...inputProps
}: MultiSelectProps) {
  const { query, listbox, search, rootRef } = useComboboxState({
    options,
    multiple: true,
    values,
    defaultValues,
    onValuesChange,
    disabled,
  });
  const chosen = options.filter((option) => listbox.isSelected(option.value));
  const hasError = isInvalid(invalid, ariaInvalid);

  /** Clicking anywhere but a tag's remove button focuses the box and opens the list. */
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLButtonElement) return;
    listbox.triggerRef.current?.focus();
    listbox.open();
  };

  return (
    <div
      ref={rootRef}
      onClick={handleClick}
      {...comboboxRootAttributes({
        slot: "multi-select",
        size,
        invalid: hasError,
        disabled,
        multiple: true,
        className,
      })}
    >
      <MultiSelectControl
        listbox={listbox}
        chosen={chosen}
        query={query}
        onQueryChange={search}
        placeholder={placeholder}
        maxTags={maxTags}
        disabled={disabled}
        invalid={hasError}
        inputProps={inputProps}
      />
      <ComboboxFormValues name={name} values={listbox.selected} />
      <ListboxContent listbox={listbox} query={query} size={size} multiple empty={empty} />
    </div>
  );
}

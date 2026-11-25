import type { InputHTMLAttributes } from "react";
import { IconButton } from "../../atoms/button";
import { IconChevronDown, IconX } from "../../icons";
import { useMessages } from "../../provider";
import type { ControlSize } from "../../types";
import { controlAttributes, elementRef } from "../../utils";
import type { Listbox } from "../listbox";

export type ComboboxRootOptions = {
  slot: "combobox" | "multi-select";
  size: ControlSize | undefined;
  invalid: boolean;
  disabled: boolean | undefined;
  multiple?: boolean;
  className: string | undefined;
};

/** Data attributes read by the combobox styles, shared by the single and multi versions. */
export const comboboxRootAttributes = ({ slot, multiple, ...state }: ComboboxRootOptions) =>
  controlAttributes({
    ...state,
    slot,
    base: "ac-combobox",
    modifier: multiple === true && "ac-combobox--multi",
  });

/** ARIA wiring every combobox input needs, from the APG combobox pattern. */
export function comboboxInputAttributes(listbox: Listbox, invalid: boolean) {
  return {
    role: "combobox" as const,
    type: "text" as const,
    autoComplete: "off",
    "aria-expanded": listbox.isOpen,
    "aria-controls": listbox.isOpen ? listbox.listId : undefined,
    "aria-autocomplete": "list" as const,
    "aria-activedescendant":
      listbox.activeIndex === -1 ? undefined : listbox.optionId(listbox.activeIndex),
    "aria-invalid": invalid || undefined,
    className: "ac-combobox__input",
  };
}

export type ComboboxControlProps = {
  listbox: Listbox;
  /** Text shown in the box: the query while open, the chosen label while closed. */
  text: string;
  onTextChange: (text: string) => void;
  placeholder: string | undefined;
  disabled: boolean | undefined;
  invalid: boolean;
  clearable: boolean;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
};

/** The text box of a single-choice Combobox, with its clear and open buttons. */
export function ComboboxControl({
  listbox,
  text,
  onTextChange,
  inputProps,
  ...props
}: ComboboxControlProps) {
  const messages = useMessages();
  return (
    <>
      <input
        {...inputProps}
        {...comboboxInputAttributes(listbox, props.invalid)}
        ref={elementRef<HTMLInputElement>(listbox.triggerRef)}
        value={text}
        placeholder={props.placeholder ?? messages.selectOption}
        disabled={props.disabled}
        onChange={(event) => onTextChange(event.target.value)}
        onClick={() => listbox.open()}
        onKeyDown={listbox.handleKeyDown}
      />
      <ComboboxActions listbox={listbox} clearable={props.clearable} disabled={props.disabled} />
    </>
  );
}

export type ComboboxActionsProps = {
  listbox: Listbox;
  /** Shows the clear button. */
  clearable: boolean;
  disabled: boolean | undefined;
};

/** Clear and open buttons at the end of the control. Both stay out of the tab order. */
export function ComboboxActions({ listbox, clearable, disabled }: ComboboxActionsProps) {
  const messages = useMessages();
  return (
    <span className="ac-combobox__actions">
      {clearable && !disabled && (
        <IconButton
          label={messages.clear}
          variant="ghost"
          size="sm"
          tabIndex={-1}
          onClick={() => listbox.setSelected([])}
        >
          <IconX />
        </IconButton>
      )}
      <IconButton
        label={messages.showOptions}
        variant="ghost"
        size="sm"
        tabIndex={-1}
        disabled={disabled}
        onClick={() => (listbox.isOpen ? listbox.close() : listbox.open())}
      >
        <IconChevronDown />
      </IconButton>
    </span>
  );
}

/** Submits the chosen values with a surrounding form. */
export function ComboboxFormValues({
  name,
  values,
}: {
  name: string | undefined;
  values: readonly string[];
}) {
  if (name === undefined) return null;
  if (values.length === 0) return <input type="hidden" name={name} value="" />;
  return values.map((value) => <input key={value} type="hidden" name={name} value={value} />);
}

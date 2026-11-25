import type { InputHTMLAttributes, ReactNode } from "react";
import { isInvalid } from "../../atoms/input";
import type { ControlSize } from "../../types";
import { ListboxContent } from "../listbox";
import type { ListOption } from "../listbox";
import { ComboboxControl, ComboboxFormValues, comboboxRootAttributes } from "./combobox-parts";
import { useComboboxState } from "./use-combobox-state";

export type ComboboxInputProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "required" | "aria-label" | "aria-labelledby" | "aria-describedby" | "aria-invalid"
>;

export type ComboboxProps = ComboboxInputProps & {
  options: readonly ListOption[];
  value?: string | null | undefined;
  defaultValue?: string | null;
  onValueChange?: ((value: string | null) => void) | undefined;
  placeholder?: string;
  size?: ControlSize;
  invalid?: boolean;
  disabled?: boolean;
  /** Adds a button that clears the selection. */
  clearable?: boolean;
  /** Shown when the typed text matches nothing. */
  empty?: ReactNode;
  /** Submits the selected value with a surrounding form. */
  name?: string | undefined;
  className?: string;
};

const toValues = (value: string | null | undefined): readonly string[] | undefined =>
  value === undefined ? undefined : value === null ? [] : [value];

/**
 * Single-choice combobox (WAI-ARIA APG): a text box that filters a listbox.
 * Use SelectMenu when there is nothing to search, or Select for the native picker.
 */
export function Combobox({
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder,
  size,
  invalid = false,
  disabled,
  clearable = false,
  empty,
  name,
  className,
  "aria-invalid": ariaInvalid,
  ...inputProps
}: ComboboxProps) {
  const { query, listbox, search, rootRef } = useComboboxState({
    options,
    values: toValues(value),
    defaultValues: toValues(defaultValue) ?? [],
    onValuesChange: (values) => onValueChange?.(values[0] ?? null),
    disabled,
  });
  const selected = options.find((option) => option.value === listbox.selected[0]);
  const hasError = isInvalid(invalid, ariaInvalid);

  return (
    <div
      ref={rootRef}
      {...comboboxRootAttributes({
        slot: "combobox",
        size,
        invalid: hasError,
        disabled,
        className,
      })}
    >
      <ComboboxControl
        listbox={listbox}
        text={listbox.isOpen ? query : (selected?.label ?? "")}
        onTextChange={search}
        placeholder={placeholder}
        disabled={disabled}
        invalid={hasError}
        clearable={clearable && selected !== undefined}
        inputProps={inputProps}
      />
      <ComboboxFormValues name={name} values={listbox.selected} />
      <ListboxContent listbox={listbox} query={query} size={size} empty={empty} />
    </div>
  );
}

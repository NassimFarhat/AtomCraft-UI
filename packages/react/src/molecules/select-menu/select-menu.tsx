import type { ButtonHTMLAttributes, ReactNode } from "react";
import { isInvalid } from "../../atoms/input";
import type { ControlSize } from "../../types";
import { controlAttributes } from "../../utils";
import { ListboxContent, useListbox } from "../listbox";
import type { ListOption } from "../listbox";
import { SelectMenuTrigger } from "./select-menu-trigger";

export type SelectMenuProps = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "id" | "aria-label" | "aria-labelledby" | "aria-describedby" | "aria-invalid" | "aria-required"
> & {
  options: readonly ListOption[];
  value?: string | null | undefined;
  defaultValue?: string | null;
  onValueChange?: ((value: string | null) => void) | undefined;
  placeholder?: string;
  size?: ControlSize;
  invalid?: boolean;
  disabled?: boolean;
  /** Renders the chosen option in the button, instead of its label. */
  renderValue?: ((option: ListOption) => ReactNode) | undefined;
  /** Submits the selected value with a surrounding form. */
  name?: string | undefined;
  className?: string;
};

const toValues = (value: string | null | undefined): readonly string[] | undefined =>
  value === undefined ? undefined : value === null ? [] : [value];

/**
 * Custom single-choice select (APG select-only combobox): styled options,
 * icons and descriptions, with the keyboard behaviour of a native select.
 * Prefer the native Select atom on simple mobile forms.
 */
export function SelectMenu({
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder,
  size,
  invalid = false,
  disabled,
  renderValue,
  name,
  className,
  "aria-invalid": ariaInvalid,
  ...buttonProps
}: SelectMenuProps) {
  const listbox = useListbox({
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
      {...controlAttributes({
        slot: "select-menu",
        base: "ac-select-menu",
        size,
        invalid: hasError,
        disabled,
        className,
      })}
    >
      <SelectMenuTrigger
        listbox={listbox}
        selected={selected}
        placeholder={placeholder}
        renderValue={renderValue}
        disabled={disabled}
        invalid={hasError}
        buttonProps={buttonProps}
      />
      {name !== undefined && <input type="hidden" name={name} value={selected?.value ?? ""} />}
      <ListboxContent listbox={listbox} size={size} />
    </div>
  );
}

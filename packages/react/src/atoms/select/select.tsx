import { cn, dataAttr } from "@atomcraft/core";
import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { IconChevronDown } from "../../icons";
import type { ControlSize } from "../../types";
import { isInvalid } from "../input";

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
  size?: ControlSize;
  invalid?: boolean;
  /** Shown as a disabled first option until a value is picked. */
  placeholder?: string;
};

/**
 * Native select with AtomCraft styling: the platform picker stays fully accessible
 * and touch-friendly. Use Combobox (later) when search inside the list is needed.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    size = "md",
    invalid = false,
    placeholder,
    className,
    children,
    "aria-invalid": ariaInvalid,
    ...props
  },
  ref,
) {
  const hasError = isInvalid(invalid, ariaInvalid);
  const startsEmpty =
    placeholder !== undefined && props.value === undefined && props.defaultValue === undefined;
  return (
    <span className={cn("ac-select", className)} data-slot="select" data-size={size}>
      <select
        {...props}
        ref={ref}
        defaultValue={startsEmpty ? "" : props.defaultValue}
        aria-invalid={hasError || undefined}
        data-invalid={dataAttr(hasError)}
        className="ac-select__control"
      >
        {placeholder !== undefined && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <IconChevronDown className="ac-select__chevron" />
    </span>
  );
});

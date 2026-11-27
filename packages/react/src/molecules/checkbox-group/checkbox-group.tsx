import { cn } from "@atomscraft/core";
import { useId } from "react";
import type { ReactNode } from "react";
import { Checkbox } from "../../atoms/checkbox";
import { useControllableState } from "../../hooks";

export type CheckboxGroupOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type CheckboxGroupProps = {
  options: readonly CheckboxGroupOption[];
  value?: readonly string[] | undefined;
  defaultValue?: readonly string[];
  onValueChange?: ((value: string[]) => void) | undefined;
  label: string;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  className?: string;
};

/** Data-driven checkbox set with controlled and uncontrolled selected values. */
export function CheckboxGroup({
  options,
  value,
  defaultValue = [],
  onValueChange,
  label,
  orientation = "vertical",
  disabled = false,
  className,
}: CheckboxGroupProps) {
  const id = useId();
  const [selected, setSelected] = useControllableState({
    value: value === undefined ? undefined : [...value],
    defaultValue: [...defaultValue],
    onChange: onValueChange,
  });

  return (
    <fieldset
      data-slot="checkbox-group"
      data-orientation={orientation}
      className={cn("ac-checkbox-group", className)}
      disabled={disabled}
    >
      <legend className="ac-checkbox-group__legend">{label}</legend>
      <div className="ac-checkbox-group__options">
        {options.map((option, index) => {
          const inputId = `${id}-${index}`;
          const descriptionId = option.description ? `${inputId}-description` : undefined;
          const checked = selected.includes(option.value);
          return (
            <div className="ac-checkbox-group__option" key={option.value}>
              <Checkbox
                id={inputId}
                value={option.value}
                checked={checked}
                disabled={disabled || option.disabled}
                aria-describedby={descriptionId}
                onChange={(event) => {
                  const isChecked = event.currentTarget.checked;
                  setSelected((current) =>
                    isChecked
                      ? [...current, option.value]
                      : current.filter((item) => item !== option.value),
                  );
                }}
              />
              <div className="ac-checkbox-group__text">
                <label htmlFor={inputId} className="ac-checkbox-group__label">
                  {option.label}
                </label>
                {option.description && (
                  <p id={descriptionId} className="ac-checkbox-group__description">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

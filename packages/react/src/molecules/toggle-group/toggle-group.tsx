import { cn } from "@atomscraft/core";
import { Toggle } from "../../atoms/toggle";
import { useControllableState } from "../../hooks";
import type { ControlSize, Tone } from "../../types";
import type { SegmentedOption } from "../segmented-control";

export type ToggleGroupProps = {
  options: readonly SegmentedOption[];
  value?: readonly string[] | undefined;
  defaultValue?: readonly string[];
  onValueChange?: ((value: string[]) => void) | undefined;
  label: string;
  type?: "single" | "multiple";
  orientation?: "horizontal" | "vertical";
  allowEmpty?: boolean;
  size?: ControlSize;
  tone?: Tone;
  disabled?: boolean;
  className?: string;
};

/** Group of pressed-state toggles, supporting either one or multiple active values. */
export function ToggleGroup({
  options,
  value,
  defaultValue = [],
  onValueChange,
  label,
  type = "single",
  orientation = "horizontal",
  allowEmpty = true,
  size = "md",
  tone = "neutral",
  disabled = false,
  className,
}: ToggleGroupProps) {
  const [selected, setSelected] = useControllableState({
    value: value === undefined ? undefined : [...value],
    defaultValue: [...defaultValue],
    onChange: onValueChange,
  });

  return (
    <div
      role="group"
      aria-label={label}
      data-slot="toggle-group"
      data-type={type}
      data-orientation={orientation}
      className={cn("ac-toggle-group", className)}
    >
      {options.map((option) => {
        const pressed = selected.includes(option.value);
        return (
          <Toggle
            key={option.value}
            pressed={pressed}
            disabled={disabled || option.disabled}
            size={size}
            tone={tone}
            onPressedChange={(next) => {
              setSelected((current) => {
                if (type === "single") {
                  if (!next && !allowEmpty) return current;
                  return next ? [option.value] : [];
                }
                return next
                  ? [...current, option.value]
                  : current.filter((item) => item !== option.value);
              });
            }}
          >
            {option.label}
          </Toggle>
        );
      })}
    </div>
  );
}

import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { ChangeEvent, InputHTMLAttributes } from "react";
import { IconButton } from "../../atoms/button";
import type { InputProps } from "../../atoms/input";
import { useControllableState } from "../../hooks";
import { IconMinus, IconPlus } from "../../icons";

export type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "size"
> & {
  value?: number | null | undefined;
  defaultValue?: number | null;
  onValueChange?: ((value: number | null) => void) | undefined;
  onChange?: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined;
  step?: number | "any";
  size?: InputProps["size"];
  decreaseLabel: string;
  increaseLabel: string;
  showControls?: boolean;
};

/** Numeric field that preserves an empty draft while reporting numbers or null. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value,
    defaultValue = null,
    onValueChange,
    onChange,
    min,
    max,
    step = 1,
    size = "md",
    decreaseLabel,
    increaseLabel,
    showControls = true,
    disabled,
    className,
    ...props
  },
  ref,
) {
  const [text, setText] = useControllableState({
    value: value === undefined ? undefined : value === null ? "" : String(value),
    defaultValue: defaultValue === null ? "" : String(defaultValue),
    onChange: (next) => onValueChange?.(next === "" ? null : Number(next)),
  });
  const minValue = typeof min === "number" ? min : undefined;
  const maxValue = typeof max === "number" ? max : undefined;
  const stepValue = typeof step === "number" && step > 0 ? step : 1;

  const changeBy = (direction: -1 | 1) => {
    const base = text === "" ? (minValue ?? 0) : Number(text);
    const next = base + direction * stepValue;
    const bounded = Math.min(maxValue ?? Infinity, Math.max(minValue ?? -Infinity, next));
    setText(String(bounded));
  };

  return (
    <div data-slot="number-input" className={cn("ac-number-input", className)}>
      {showControls && (
        <IconButton
          label={decreaseLabel}
          variant="outline"
          tone="neutral"
          size="xs"
          disabled={disabled || (minValue !== undefined && Number(text) <= minValue)}
          onClick={() => changeBy(-1)}
        >
          <IconMinus />
        </IconButton>
      )}
      <input
        {...props}
        ref={ref}
        type="number"
        value={text}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        data-slot="number-input-control"
        data-size={size}
        className="ac-input ac-number-input__control"
        onChange={(event) => {
          setText(event.target.value);
          onChange?.(event);
        }}
      />
      {showControls && (
        <IconButton
          label={increaseLabel}
          variant="outline"
          tone="neutral"
          size="xs"
          disabled={disabled || (maxValue !== undefined && Number(text) >= maxValue)}
          onClick={() => changeBy(1)}
        >
          <IconPlus />
        </IconButton>
      )}
    </div>
  );
});

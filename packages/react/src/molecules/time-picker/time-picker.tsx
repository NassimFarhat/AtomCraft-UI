import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { ChangeEvent, InputHTMLAttributes } from "react";
import { useControllableState } from "../../hooks";
import { Input } from "../../atoms/input";

export type TimePickerProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "size"
> & {
  value?: string | undefined;
  defaultValue?: string;
  onValueChange?: ((value: string) => void) | undefined;
  onChange?: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined;
  size?: "sm" | "md" | "lg";
};

/** Native localized time control with controlled and uncontrolled string values. */
export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(
  {
    value,
    defaultValue = "",
    onValueChange,
    min,
    max,
    step,
    size = "md",
    className,
    onChange,
    ...props
  },
  ref,
) {
  const [time, setTime] = useControllableState({ value, defaultValue, onChange: onValueChange });
  return (
    <Input
      {...props}
      ref={ref}
      type="time"
      value={time}
      min={min}
      max={max}
      step={step}
      size={size}
      data-slot="time-picker"
      className={cn("ac-time-picker", className)}
      onChange={(event) => {
        setTime(event.target.value);
        onChange?.(event);
      }}
    />
  );
});

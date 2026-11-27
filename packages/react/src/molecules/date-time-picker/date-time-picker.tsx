import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { ChangeEvent, InputHTMLAttributes } from "react";
import { useControllableState } from "../../hooks";
import { Input } from "../../atoms/input";

const pad = (value: number) => String(value).padStart(2, "0");
const toLocalDateTime = (date: Date | null) =>
  date
    ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
    : "";

export type DateTimePickerProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "size"
> & {
  value?: Date | null | undefined;
  defaultValue?: Date | null;
  onValueChange?: ((value: Date | null) => void) | undefined;
  onChange?: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined;
  min?: Date;
  max?: Date;
  size?: "sm" | "md" | "lg";
};

/** Native local date-and-time input. Dates are passed back in the user's local timezone. */
export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  function DateTimePicker(
    {
      value,
      defaultValue = null,
      onValueChange,
      min,
      max,
      size = "md",
      className,
      onChange,
      ...props
    },
    ref,
  ) {
    const [date, setDate] = useControllableState({ value, defaultValue, onChange: onValueChange });
    return (
      <Input
        {...props}
        ref={ref}
        type="datetime-local"
        value={toLocalDateTime(date)}
        min={toLocalDateTime(min ?? null) || undefined}
        max={toLocalDateTime(max ?? null) || undefined}
        size={size}
        data-slot="date-time-picker"
        className={cn("ac-date-time-picker", className)}
        onChange={(event) => {
          setDate(event.target.value ? new Date(event.target.value) : null);
          onChange?.(event);
        }}
      />
    );
  },
);

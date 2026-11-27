import { cn } from "@atomscraft/core";
import { useControllableState } from "../../hooks";
import { DatePicker } from "../date-picker";

export type DateRangeValue = { start: Date | null; end: Date | null };

export type DateRangePickerProps = {
  value?: DateRangeValue | undefined;
  defaultValue?: DateRangeValue;
  onValueChange?: ((value: DateRangeValue) => void) | undefined;
  label: string;
  startLabel: string;
  endLabel: string;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  className?: string;
};

/** Date interval picker; it keeps its endpoints ordered and uses the shared Calendar popup. */
export function DateRangePicker({
  value,
  defaultValue = { start: null, end: null },
  onValueChange,
  label,
  startLabel,
  endLabel,
  min,
  max,
  disabled,
  className,
}: DateRangePickerProps) {
  const [range, setRange] = useControllableState({ value, defaultValue, onChange: onValueChange });

  const setStart = (start: Date | null) =>
    setRange((current) => ({
      start,
      end: start && current.end && start > current.end ? start : current.end,
    }));
  const setEnd = (end: Date | null) =>
    setRange((current) => ({
      start: end && current.start && end < current.start ? end : current.start,
      end,
    }));

  return (
    <fieldset
      data-slot="date-range-picker"
      className={cn("ac-date-range-picker", className)}
      disabled={disabled}
    >
      <legend className="ac-date-range-picker__label">{label}</legend>
      <div className="ac-date-range-picker__fields">
        <DatePicker
          aria-label={startLabel}
          value={range.start}
          min={min}
          max={range.end ?? max}
          disabled={Boolean(disabled)}
          onValueChange={setStart}
        />
        <DatePicker
          aria-label={endLabel}
          value={range.end}
          min={range.start ?? min}
          max={max}
          disabled={Boolean(disabled)}
          onValueChange={setEnd}
        />
      </div>
    </fieldset>
  );
}

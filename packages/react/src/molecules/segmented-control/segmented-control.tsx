import { cn } from "@atomscraft/core";
import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { useControllableState } from "../../hooks";

export type SegmentedOption = { value: string; label: ReactNode; disabled?: boolean };

export type SegmentedControlProps = {
  options: readonly SegmentedOption[];
  value?: string | undefined;
  defaultValue?: string;
  onValueChange?: ((value: string) => void) | undefined;
  label: string;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  className?: string;
};

/** Single-selection segmented control with radio semantics and arrow-key movement. */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  label,
  orientation = "horizontal",
  disabled = false,
  className,
}: SegmentedControlProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue:
      defaultValue ?? options.find((option) => !disabled && !option.disabled)?.value ?? "",
    onChange: onValueChange,
  });
  const enabled = options.filter((option) => !disabled && !option.disabled);

  const move = (event: KeyboardEvent<HTMLButtonElement>, current: string) => {
    const forward = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const backward = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const currentIndex = enabled.findIndex((option) => option.value === current);
    let nextIndex = -1;
    if (event.key === forward) nextIndex = (currentIndex + 1) % enabled.length;
    else if (event.key === backward)
      nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = enabled.length - 1;
    if (nextIndex < 0 || enabled.length === 0) return;
    event.preventDefault();
    const next = enabled[nextIndex];
    if (!next) return;
    setSelected(next.value);
    [
      ...(rootRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-slot='segmented-control-item']",
      ) ?? []),
    ]
      .find((button) => button.dataset.value === next.value)
      ?.focus();
  };

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      aria-label={label}
      aria-orientation={orientation}
      data-slot="segmented-control"
      data-orientation={orientation}
      data-disabled={disabled || undefined}
      className={cn("ac-segmented-control", className)}
    >
      {options.map((option) => {
        const isSelected = selected === option.value;
        const isDisabled = disabled || option.disabled;
        const tabStop = enabled.some((item) => item.value === selected)
          ? selected
          : enabled[0]?.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={tabStop === option.value ? 0 : -1}
            disabled={isDisabled}
            data-slot="segmented-control-item"
            data-state={isSelected ? "on" : "off"}
            data-value={option.value}
            className="ac-segmented-control__item"
            onClick={() => setSelected(option.value)}
            onKeyDown={(event) => move(event, option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

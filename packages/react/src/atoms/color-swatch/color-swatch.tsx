import { cn, dataAttr } from "@atomscraft/core";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { useControllableState } from "../../hooks";

export type ColorSwatchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "color" | "value" | "defaultValue" | "onChange"
> & {
  color: string;
  label: string;
  selected?: boolean | undefined;
  defaultSelected?: boolean;
  onSelectedChange?: ((selected: boolean) => void) | undefined;
  size?: "sm" | "md" | "lg";
};

/** A named color sample that can also act as a single-select control. */
export const ColorSwatch = forwardRef<HTMLButtonElement, ColorSwatchProps>(function ColorSwatch(
  {
    color,
    label,
    selected,
    defaultSelected = false,
    onSelectedChange,
    size = "md",
    className,
    style,
    onClick,
    disabled,
    ...props
  },
  ref,
) {
  const [isSelected, setSelected] = useControllableState({
    value: selected,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  });

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      disabled={disabled}
      aria-label={label}
      aria-pressed={isSelected}
      data-slot="color-swatch"
      data-size={size}
      data-selected={dataAttr(isSelected)}
      className={cn("ac-color-swatch", className)}
      style={{ ...style, "--_swatch-color": color } as CSSProperties}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setSelected((previous) => !previous);
      }}
    >
      <span
        aria-hidden="true"
        data-slot="color-swatch-sample"
        className="ac-color-swatch__sample"
      />
      <span data-slot="color-swatch-label" className="ac-color-swatch__label">
        {label}
      </span>
    </button>
  );
});

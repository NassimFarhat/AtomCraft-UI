import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { ChangeEvent, InputHTMLAttributes } from "react";
import { useControllableState } from "../../hooks";
import { Input } from "../../atoms/input";

export type ColorPickerProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "size"
> & {
  value?: string | undefined;
  defaultValue?: string;
  onValueChange?: ((value: string) => void) | undefined;
  onChange?: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined;
  size?: "sm" | "md" | "lg";
};

/** Native color chooser styled as a compact design-system control. */
export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(function ColorPicker(
  { value, defaultValue = "#4f46e5", onValueChange, size = "md", className, onChange, ...props },
  ref,
) {
  const [color, setColor] = useControllableState({ value, defaultValue, onChange: onValueChange });
  return (
    <Input
      {...props}
      ref={ref}
      type="color"
      value={color}
      size={size}
      data-slot="color-picker"
      className={cn("ac-color-picker", className)}
      onChange={(event) => {
        setColor(event.target.value);
        onChange?.(event);
      }}
    />
  );
});

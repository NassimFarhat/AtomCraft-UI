import { cn, dataAttr } from "@atomscraft/core";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useControllableState } from "../../hooks";
import type { ControlSize, Tone } from "../../types";

export type ToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "role" | "value" | "defaultValue" | "onChange"
> & {
  pressed?: boolean | undefined;
  defaultPressed?: boolean;
  onPressedChange?: ((pressed: boolean) => void) | undefined;
  size?: ControlSize;
  tone?: Tone;
  children?: ReactNode;
};

/** Button-like two-state control, distinct from the switch's on/off track. */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    pressed,
    defaultPressed = false,
    onPressedChange,
    size = "md",
    tone = "neutral",
    className,
    onClick,
    disabled,
    ...props
  },
  ref,
) {
  const [isPressed, setPressed] = useControllableState({
    value: pressed,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) setPressed((previous) => !previous);
  };

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      disabled={disabled}
      aria-pressed={isPressed}
      data-slot="toggle"
      data-size={size}
      data-tone={tone}
      data-state={isPressed ? "on" : "off"}
      data-disabled={dataAttr(Boolean(disabled))}
      className={cn("ac-toggle", className)}
      onClick={handleClick}
    />
  );
});

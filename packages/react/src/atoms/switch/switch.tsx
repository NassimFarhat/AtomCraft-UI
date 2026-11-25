import { cn } from "@atomcraft/core";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { useControllableState } from "../../hooks";
import type { ControlSize, Tone } from "../../types";

export type SwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "role" | "value" | "defaultValue" | "onChange"
> & {
  checked?: boolean | undefined;
  defaultChecked?: boolean;
  onCheckedChange?: ((checked: boolean) => void) | undefined;
  size?: ControlSize;
  tone?: Tone;
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    size = "md",
    tone = "primary",
    onClick,
    className,
    ...props
  },
  ref,
) {
  const [isChecked, setChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) setChecked((previous) => !previous);
  };

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isChecked}
      data-slot="switch"
      data-size={size}
      data-tone={tone}
      data-state={isChecked ? "checked" : "unchecked"}
      className={cn("ac-switch", className)}
      onClick={handleClick}
    >
      <span className="ac-switch__thumb" data-slot="switch-thumb" aria-hidden="true" />
    </button>
  );
});

import { cn, dataAttr } from "@atomcraft/core";
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import type { ControlSize } from "../../types";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: ControlSize;
  /** Marks the value as invalid for styling and assistive technologies. */
  invalid?: boolean;
};

/** True when either the `invalid` prop or an injected `aria-invalid` asks for it. */
export const isInvalid = (invalid: boolean, ariaInvalid: unknown): boolean =>
  invalid || ariaInvalid === true || ariaInvalid === "true";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "md", invalid = false, type = "text", className, "aria-invalid": ariaInvalid, ...props },
  ref,
) {
  const hasError = isInvalid(invalid, ariaInvalid);
  return (
    <input
      {...props}
      ref={ref}
      type={type}
      aria-invalid={hasError || undefined}
      data-slot="input"
      data-size={size}
      data-invalid={dataAttr(hasError)}
      className={cn("ac-input", className)}
    />
  );
});

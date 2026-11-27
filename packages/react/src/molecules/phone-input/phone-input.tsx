import { forwardRef } from "react";
import type { InputProps } from "../../atoms/input";
import { Input } from "../../atoms/input";

export type PhoneInputProps = Omit<InputProps, "type">;

/** Telephone input with browser phone-keyboard and autofill hints. Formatting remains caller-owned. */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  { autoComplete = "tel", inputMode = "tel", ...props },
  ref,
) {
  return (
    <Input {...props} ref={ref} type="tel" autoComplete={autoComplete} inputMode={inputMode} />
  );
});

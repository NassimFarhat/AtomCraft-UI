import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import type { ControlSize, Tone } from "../../types";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  size?: ControlSize;
  tone?: Tone;
};

/** A real radio input: grouping by `name` gives arrow-key navigation for free. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { size = "md", tone = "primary", className, style, ...props },
  ref,
) {
  return (
    <span
      className={cn("ac-radio", className)}
      style={style}
      data-slot="radio"
      data-size={size}
      data-tone={tone}
    >
      <input {...props} ref={ref} type="radio" className="ac-radio__input" />
      <span className="ac-radio__circle" aria-hidden="true" />
    </span>
  );
});

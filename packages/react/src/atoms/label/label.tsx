import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { LabelHTMLAttributes, ReactNode } from "react";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  /** Visual marker only; the control itself carries `required` for assistive technologies. */
  required?: boolean;
  /** Secondary text after the label, e.g. "Optional". */
  hint?: ReactNode;
};

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { required = false, hint, className, children, ...props },
  ref,
) {
  return (
    <label {...props} ref={ref} data-slot="label" className={cn("ac-label", className)}>
      {children}
      {required && (
        <span className="ac-label__required" aria-hidden="true">
          *
        </span>
      )}
      {hint && <span className="ac-label__hint">{hint}</span>}
    </label>
  );
});

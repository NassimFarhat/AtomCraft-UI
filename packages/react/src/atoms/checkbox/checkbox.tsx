import { cn, dataAttr } from "@atomscraft/core";
import { forwardRef, useEffect, useRef } from "react";
import type { InputHTMLAttributes } from "react";
import { IconCheck, IconMinus } from "../../icons";
import type { ControlSize, Tone } from "../../types";
import { useComposedRefs } from "../../utils";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  /** Mixed state, e.g. a "select all" box when only some rows are selected. */
  indeterminate?: boolean;
  invalid?: boolean;
  size?: ControlSize;
  tone?: Tone;
};

/** A real checkbox input (form submission, labels, keyboard) under a custom visual. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    indeterminate = false,
    invalid = false,
    size = "md",
    tone = "primary",
    className,
    style,
    ...props
  },
  forwardedRef,
) {
  const innerRef = useRef<HTMLInputElement>(null);
  const ref = useComposedRefs(forwardedRef, innerRef);

  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <span
      className={cn("ac-checkbox", className)}
      style={style}
      data-slot="checkbox"
      data-size={size}
      data-tone={tone}
      data-invalid={dataAttr(invalid)}
    >
      <input
        {...props}
        ref={ref}
        type="checkbox"
        aria-invalid={invalid || undefined}
        className="ac-checkbox__input"
      />
      <span className="ac-checkbox__box" aria-hidden="true">
        <IconCheck className="ac-checkbox__check" />
        <IconMinus className="ac-checkbox__dash" />
      </span>
    </span>
  );
});

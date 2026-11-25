import { cn, dataAttr } from "@atomcraft/core";
import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { isInvalid } from "../input";

export type TextareaResize = "none" | "vertical" | "auto";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
  /** `auto` grows with the content (CSS field-sizing), without JavaScript. */
  resize?: TextareaResize;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    invalid = false,
    resize = "vertical",
    rows = 3,
    className,
    "aria-invalid": ariaInvalid,
    ...props
  },
  ref,
) {
  const hasError = isInvalid(invalid, ariaInvalid);
  return (
    <textarea
      {...props}
      ref={ref}
      rows={rows}
      aria-invalid={hasError || undefined}
      data-slot="textarea"
      data-resize={resize}
      data-invalid={dataAttr(hasError)}
      className={cn("ac-textarea", className)}
    />
  );
});

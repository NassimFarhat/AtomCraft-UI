import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

/** Content for assistive technologies only. */
export const VisuallyHidden = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  function VisuallyHidden({ className, ...props }, ref) {
    return <span {...props} ref={ref} className={cn("ac-visually-hidden", className)} />;
  },
);

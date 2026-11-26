import { cn, dataAttr } from "@atomscraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import type { Tone } from "../../types";

export type BadgeVariant = "solid" | "soft" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  tone?: Tone;
  size?: BadgeSize;
  /** Leading status dot in the tone color. */
  dot?: boolean;
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "soft", tone = "neutral", size = "md", dot = false, className, children, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      data-slot="badge"
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-dot={dataAttr(dot)}
      className={cn("ac-badge", className)}
    >
      {dot && <span className="ac-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
});

import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "display-lg" | "display-md" | "display-sm" | `${HeadingLevel}`;

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  /** Document outline level (h1–h6). */
  level?: HeadingLevel;
  /** Visual size, independent from the level, so the outline stays correct. */
  size?: HeadingSize;
  tone?: "primary" | "secondary";
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 2, size, tone = "primary", className, ...props },
  ref,
) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      {...props}
      ref={ref}
      data-slot="heading"
      data-size={size ?? String(level)}
      data-tone={tone}
      className={cn("ac-heading", className)}
    />
  );
});

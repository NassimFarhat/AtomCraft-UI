import { cn, dataAttr } from "@atomscraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import type { Tone } from "../../types";
import { Slot } from "../../utils";

export type TextSize = "lg" | "md" | "sm" | "xs";
export type TextTone = "primary" | "secondary" | "tertiary" | Exclude<Tone, "primary" | "neutral">;
export type TextWeight = "regular" | "medium" | "semibold" | "bold";

export type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  /** Cuts the text to one line with an ellipsis. */
  truncate?: boolean;
  as?: "p" | "span" | "div" | "small" | "strong";
  asChild?: boolean;
};

export const Text = forwardRef<HTMLParagraphElement, TextProps>(function Text(
  {
    size = "md",
    tone = "primary",
    weight = "regular",
    truncate = false,
    as: Tag = "p",
    asChild = false,
    className,
    ...props
  },
  ref,
) {
  const Component = asChild ? Slot : Tag;
  return (
    <Component
      {...props}
      ref={ref}
      data-slot="text"
      data-size={size}
      data-tone={tone}
      data-weight={weight}
      data-truncate={dataAttr(truncate)}
      className={cn("ac-text", className)}
    />
  );
});

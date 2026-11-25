import { cn, dataAttr } from "@atomcraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

export type SeparatorOrientation = "horizontal" | "vertical";

export type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: SeparatorOrientation;
  /** Purely visual separators are hidden from assistive technologies. */
  decorative?: boolean;
  /** Centered text such as "or". Makes the line decorative; the text stays readable. */
  children?: ReactNode;
};

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", decorative = false, className, children, ...props },
  ref,
) {
  const hasLabel = children !== undefined && children !== null;
  const isDecorative = decorative || hasLabel;
  return (
    <div
      {...props}
      ref={ref}
      role={isDecorative ? "none" : "separator"}
      aria-orientation={!isDecorative && orientation === "vertical" ? "vertical" : undefined}
      data-slot="separator"
      data-orientation={orientation}
      data-labeled={dataAttr(hasLabel)}
      className={cn("ac-separator", className)}
    >
      {hasLabel && <span className="ac-separator__label">{children}</span>}
    </div>
  );
});

import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

/** Visually and semantically groups related buttons. */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { orientation = "horizontal", className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn("ac-button-group", className)}
    />
  );
});

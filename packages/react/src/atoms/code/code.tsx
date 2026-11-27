import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

export type CodeProps = HTMLAttributes<HTMLElement>;

/** Inline code styled with AtomCraft's semantic typography and surface tokens. */
export const Code = forwardRef<HTMLElement, CodeProps>(function Code({ className, ...props }, ref) {
  return <code {...props} ref={ref} data-slot="code" className={cn("ac-code", className)} />;
});

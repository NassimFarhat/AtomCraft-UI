import { cn } from "@atomcraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

export type KbdProps = HTMLAttributes<HTMLElement>;

export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd({ className, ...props }, ref) {
  return <kbd {...props} ref={ref} data-slot="kbd" className={cn("ac-kbd", className)} />;
});

import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { useMessages } from "../../provider";

export type SpinnerSize = "xs" | "sm" | "md" | "lg";

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  size?: SpinnerSize;
  /** Announced text. Defaults to the "loading" message; pass "" when a parent already announces it. */
  label?: string | undefined;
};

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = "md", label, className, ...props },
  ref,
) {
  const messages = useMessages();
  const text = label ?? messages.loading;
  const isDecorative = text === "";
  return (
    <span
      {...props}
      ref={ref}
      role={isDecorative ? undefined : "status"}
      aria-hidden={isDecorative || undefined}
      data-slot="spinner"
      data-size={size}
      className={cn("ac-spinner", className)}
    >
      {!isDecorative && <span className="ac-visually-hidden">{text}</span>}
    </span>
  );
});

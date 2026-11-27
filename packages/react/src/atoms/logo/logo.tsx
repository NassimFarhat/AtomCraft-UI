import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

export type LogoProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  mark?: ReactNode;
  size?: "sm" | "md" | "lg";
};

/** Brand lockup primitive; callers supply the mark and wordmark to keep branding configurable. */
export const Logo = forwardRef<HTMLSpanElement, LogoProps>(function Logo(
  { children, mark, size = "md", className, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      data-slot="logo"
      data-size={size}
      className={cn("ac-logo", className)}
    >
      {mark && (
        <span aria-hidden="true" data-slot="logo-mark" className="ac-logo__mark">
          {mark}
        </span>
      )}
      <span data-slot="logo-wordmark" className="ac-logo__wordmark">
        {children}
      </span>
    </span>
  );
});

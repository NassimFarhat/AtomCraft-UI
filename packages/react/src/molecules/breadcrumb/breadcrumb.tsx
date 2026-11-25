import { cn } from "@atomcraft/core";
import { forwardRef } from "react";
import type { AnchorHTMLAttributes, HTMLAttributes, LiHTMLAttributes } from "react";
import { useMessages } from "../../provider";
import { Slot } from "../../utils";

export const Breadcrumb = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Breadcrumb(
  { className, children, ...props },
  ref,
) {
  const messages = useMessages();
  return (
    <nav
      {...props}
      ref={ref}
      aria-label={messages.breadcrumb}
      data-slot="breadcrumb"
      className={cn("ac-breadcrumb", className)}
    >
      <ol className="ac-breadcrumb__list">{children}</ol>
    </nav>
  );
});

export const BreadcrumbItem = forwardRef<HTMLLIElement, LiHTMLAttributes<HTMLLIElement>>(
  function BreadcrumbItem({ className, ...props }, ref) {
    return (
      <li
        {...props}
        ref={ref}
        data-slot="breadcrumb-item"
        className={cn("ac-breadcrumb__item", className)}
      />
    );
  },
);

export type BreadcrumbLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean };

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  function BreadcrumbLink({ asChild = false, className, ...props }, ref) {
    const Component = asChild ? Slot : "a";
    return (
      <Component
        {...props}
        ref={ref}
        data-slot="breadcrumb-link"
        className={cn("ac-breadcrumb__link", className)}
      />
    );
  },
);

/** The current page: not a link, announced as the current location. */
export const BreadcrumbPage = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  function BreadcrumbPage({ className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        aria-current="page"
        data-slot="breadcrumb-page"
        className={cn("ac-breadcrumb__page", className)}
      />
    );
  },
);

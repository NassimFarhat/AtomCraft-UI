import { cn, dataAttr } from "@atomscraft/core";
import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Slot } from "../../utils";

export type NavItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  icon?: ReactNode;
  /** Marks the current page (aria-current="page"). */
  active?: boolean;
  /** Count or Badge at the end, e.g. unread items. */
  badge?: ReactNode;
  /** Renders a router link (Next.js Link, React Router NavLink) with these styles. */
  asChild?: boolean;
};

/**
 * One navigation entry, for sidebars, headers and mobile menus.
 * With `asChild`, the child provides the content; icon and badge are not added.
 */
export const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(function NavItem(
  { icon, active = false, badge, asChild = false, className, children, ...props },
  ref,
) {
  const shared = {
    ...props,
    "aria-current": active ? ("page" as const) : undefined,
    "data-slot": "nav-item",
    "data-active": dataAttr(active),
    className: cn("ac-nav-item", className),
  };
  if (asChild) {
    return (
      <Slot {...shared} ref={ref}>
        {children}
      </Slot>
    );
  }
  return (
    <a {...shared} ref={ref}>
      {icon && <span className="ac-nav-item__icon">{icon}</span>}
      <span className="ac-nav-item__label">{children}</span>
      {badge !== undefined && <span className="ac-nav-item__badge">{badge}</span>}
    </a>
  );
});

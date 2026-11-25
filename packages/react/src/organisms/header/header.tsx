import { cn, dataAttr } from "@atomcraft/core";
import { forwardRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { IconButton } from "../../atoms/button";
import { IconMenu } from "../../icons";
import { useMessages } from "../../provider";
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from "../dialog";

export type HeaderProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  /** Logo or product name. */
  brand?: ReactNode;
  /** Before the brand, e.g. a SidebarTrigger. */
  start?: ReactNode;
  /** After the navigation: search, theme switch, notifications, user menu. */
  actions?: ReactNode;
  /** Navigation items (NavItem). Collapsed into a drawer on small screens. */
  children?: ReactNode;
  navLabel?: string;
  sticky?: boolean;
};

/** Banner landmark with brand, primary navigation and actions; responsive by default. */
export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  { brand, start, actions, children, navLabel, sticky = true, className, ...props },
  ref,
) {
  const messages = useMessages();
  const [menuOpen, setMenuOpen] = useState(false);
  const label = navLabel ?? messages.mainNavigation;
  const hasNav = children !== undefined && children !== null;

  return (
    <header
      {...props}
      ref={ref}
      data-slot="header"
      data-sticky={dataAttr(sticky)}
      className={cn("ac-header", className)}
    >
      {hasNav && (
        <IconButton
          label={messages.openMenu}
          aria-expanded={menuOpen}
          className="ac-header__menu-button"
          onClick={() => setMenuOpen(true)}
        >
          <IconMenu />
        </IconButton>
      )}
      {start}
      {brand && <div className="ac-header__brand">{brand}</div>}
      {hasNav && (
        <nav aria-label={label} className="ac-header__nav">
          {children}
        </nav>
      )}
      {actions && <div className="ac-header__actions">{actions}</div>}
      {hasNav && (
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent side="start" className="ac-header__sheet">
            <SheetHeader>
              <SheetTitle>{brand ?? label}</SheetTitle>
            </SheetHeader>
            <SheetBody>
              <nav
                aria-label={label}
                className="ac-header__sheet-nav"
                onClick={() => setMenuOpen(false)}
              >
                {children}
              </nav>
            </SheetBody>
          </SheetContent>
        </Sheet>
      )}
    </header>
  );
});

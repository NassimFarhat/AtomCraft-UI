import { cn } from "@atomscraft/core";
import { createContext, forwardRef, useContext, useState } from "react";
import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { IconButton } from "../../atoms/button";
import { useControllableState, useMediaQuery } from "../../hooks";
import { IconPanelLeft } from "../../icons";
import { NavItem } from "../../molecules/nav-item";
import type { NavItemProps } from "../../molecules/nav-item";
import { Tooltip } from "../../molecules/tooltip";
import { useMessages } from "../../provider";
import { Sheet, SheetContent } from "../dialog";

/** Below this width the sidebar becomes a drawer. Matches the `lg` breakpoint token. */
export const SIDEBAR_MOBILE_QUERY = "(max-width: 1023.98px)";

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isMobile: boolean;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("Sidebar parts must be used inside a SidebarProvider.");
  return context;
}

export type SidebarProviderProps = {
  children: ReactNode;
  collapsed?: boolean | undefined;
  defaultCollapsed?: boolean;
  onCollapsedChange?: ((collapsed: boolean) => void) | undefined;
};

/** Shares the sidebar state with triggers placed elsewhere (in a Header, for example). */
export function SidebarProvider({
  children,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
}: SidebarProviderProps) {
  const [isCollapsed, setCollapsed] = useControllableState({
    value: collapsed,
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange,
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(SIDEBAR_MOBILE_QUERY);
  const value = {
    collapsed: isCollapsed && !isMobile,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
    isMobile,
  };
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export type SidebarProps = HTMLAttributes<HTMLElement> & {
  /** Name of the navigation landmark. Defaults to the "main navigation" message. */
  label?: string;
  side?: "start" | "end";
  /** `icon` keeps the icons visible when collapsed; `none` disables collapsing. */
  collapsible?: "icon" | "none";
};

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { label, side = "start", collapsible = "icon", className, children, ...props },
  ref,
) {
  const sidebar = useSidebar();
  const messages = useMessages();
  const name = label ?? messages.mainNavigation;
  const nav = (
    <nav
      {...props}
      ref={ref}
      aria-label={name}
      data-slot="sidebar"
      data-side={side}
      data-state={sidebar.collapsed && collapsible === "icon" ? "collapsed" : "expanded"}
      className={cn("ac-sidebar", className)}
    >
      {children}
    </nav>
  );
  if (!sidebar.isMobile) return nav;
  return (
    <Sheet open={sidebar.mobileOpen} onOpenChange={sidebar.setMobileOpen}>
      <SheetContent side={side} aria-label={name} className="ac-sidebar-sheet">
        {nav}
      </SheetContent>
    </Sheet>
  );
});

type DivProps = HTMLAttributes<HTMLDivElement>;

export function SidebarHeader({ className, ...props }: DivProps) {
  return (
    <div {...props} data-slot="sidebar-header" className={cn("ac-sidebar__header", className)} />
  );
}

export function SidebarContent({ className, ...props }: DivProps) {
  return (
    <div {...props} data-slot="sidebar-content" className={cn("ac-sidebar__content", className)} />
  );
}

export function SidebarFooter({ className, ...props }: DivProps) {
  return (
    <div {...props} data-slot="sidebar-footer" className={cn("ac-sidebar__footer", className)} />
  );
}

export type SidebarGroupProps = DivProps & { label?: ReactNode };

export function SidebarGroup({ label, className, children, ...props }: SidebarGroupProps) {
  return (
    <div {...props} data-slot="sidebar-group" className={cn("ac-sidebar__group", className)}>
      {label && <p className="ac-sidebar__group-label">{label}</p>}
      <ul className="ac-sidebar__items">{children}</ul>
    </div>
  );
}

export type SidebarItemProps = NavItemProps & {
  /** Plain-text name, used for the tooltip when the sidebar is collapsed. */
  tooltip?: string;
};

/** NavItem that shows a tooltip when collapsed and closes the drawer on mobile. */
export const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(function SidebarItem(
  { tooltip, onClick, ...props },
  ref,
) {
  const sidebar = useSidebar();
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (sidebar.isMobile) sidebar.setMobileOpen(false);
  };
  const item = <NavItem {...props} ref={ref} onClick={handleClick} />;
  return (
    <li className="ac-sidebar__item">
      {sidebar.collapsed && tooltip ? (
        <Tooltip content={tooltip} side="right">
          {item}
        </Tooltip>
      ) : (
        item
      )}
    </li>
  );
});

/** Collapses the sidebar on desktop, opens the drawer on mobile. */
export function SidebarTrigger({ className }: { className?: string }) {
  const sidebar = useSidebar();
  const messages = useMessages();
  const expanded = sidebar.isMobile ? sidebar.mobileOpen : !sidebar.collapsed;
  const toggle = () =>
    sidebar.isMobile
      ? sidebar.setMobileOpen(!sidebar.mobileOpen)
      : sidebar.setCollapsed(!sidebar.collapsed);
  return (
    <IconButton
      label={messages.toggleSidebar}
      aria-expanded={expanded}
      className={className}
      onClick={toggle}
    >
      <IconPanelLeft />
    </IconButton>
  );
}

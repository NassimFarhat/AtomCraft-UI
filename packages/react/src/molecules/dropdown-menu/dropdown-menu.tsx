import { cn, dataAttr } from "@atomscraft/core";
import { createContext, forwardRef, useContext, useEffect, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactElement, ReactNode } from "react";
import { useFloatingLayer, useRovingFocus } from "../../hooks";
import type { FloatingLayer, FloatingLayerOptions } from "../../hooks";
import { IconCheck } from "../../icons";
import { Portal, Slot, useComposedRefs } from "../../utils";

const ITEM = "[data-roving-item]:not([aria-disabled='true'])";

type Edge = "first" | "last";
type MenuContextValue = FloatingLayer & { focusEdge: Edge; setFocusEdge: (edge: Edge) => void };
const MenuContext = createContext<MenuContextValue | null>(null);

function useMenu(): MenuContextValue {
  const context = useContext(MenuContext);
  if (!context) throw new Error("DropdownMenu parts must be used inside a DropdownMenu.");
  return context;
}

export type DropdownMenuProps = FloatingLayerOptions & { children: ReactNode };

/** Menu button pattern (WAI-ARIA APG): actions and options in a popup list. */
export function DropdownMenu({ children, align = "start", ...options }: DropdownMenuProps) {
  const layer = useFloatingLayer({ align, ...options });
  const [focusEdge, setFocusEdge] = useState<Edge>("first");
  return (
    <MenuContext.Provider value={{ ...layer, focusEdge, setFocusEdge }}>
      {children}
    </MenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children }: { children: ReactElement }) {
  const { isOpen, setOpen, close, setFocusEdge, triggerRef, contentId } = useMenu();
  const openAndFocus = (edge: Edge) => {
    setFocusEdge(edge);
    setOpen(true);
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openAndFocus(event.key === "ArrowDown" ? "first" : "last");
    }
  };
  return (
    <Slot
      ref={triggerRef}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={isOpen ? contentId : undefined}
      data-state={isOpen ? "open" : "closed"}
      onClick={() => (isOpen ? close(false) : openAndFocus("first"))}
      onKeyDown={handleKeyDown}
    >
      {children}
    </Slot>
  );
}

export type DropdownMenuContentProps = HTMLAttributes<HTMLDivElement>;

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent({ className, children, onKeyDown, ...props }, forwardedRef) {
    const menu = useMenu();
    const ref = useComposedRefs(forwardedRef, menu.contentRef);
    const navigate = useRovingFocus(menu.contentRef, { orientation: "vertical", typeahead: true });

    useEffect(() => {
      if (!menu.isOpen) return;
      const items = menu.contentRef.current?.querySelectorAll<HTMLElement>(ITEM);
      const target = menu.focusEdge === "last" ? items?.[items.length - 1] : items?.[0];
      target?.focus();
    }, [menu.isOpen, menu.contentRef, menu.focusEdge]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.key === "Tab") menu.close(false);
      navigate(event);
    };

    if (!menu.isOpen) return null;
    return (
      <Portal>
        <div
          {...props}
          ref={ref}
          id={menu.contentId}
          role="menu"
          aria-orientation="vertical"
          data-slot="dropdown-menu"
          data-side={menu.position.side}
          className={cn("ac-menu", className)}
          style={{ ...props.style, ...menu.position.style }}
          onKeyDown={handleKeyDown}
        >
          {children}
        </div>
      </Portal>
    );
  },
);

type ItemBaseProps = Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> & {
  /** Runs when the item is chosen with a click, Enter or Space. The menu then closes. */
  onSelect?: (() => void) | undefined;
  disabled?: boolean;
  icon?: ReactNode;
  /** Keyboard shortcut hint, e.g. "⌘D". */
  shortcut?: ReactNode;
};

function useItemActivation(onSelect: (() => void) | undefined, disabled: boolean) {
  const menu = useMenu();
  const activate = () => {
    if (disabled) return;
    onSelect?.();
    menu.close();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  };
  return { onClick: activate, onKeyDown };
}

export type DropdownMenuItemProps = ItemBaseProps & { tone?: "neutral" | "danger" };

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem(
    { onSelect, disabled = false, icon, shortcut, tone = "neutral", className, children, ...props },
    ref,
  ) {
    const handlers = useItemActivation(onSelect, disabled);
    return (
      <div
        {...props}
        {...handlers}
        ref={ref}
        role="menuitem"
        tabIndex={-1}
        aria-disabled={disabled || undefined}
        data-roving-item=""
        data-tone={tone}
        data-disabled={dataAttr(disabled)}
        className={cn("ac-menu__item", className)}
      >
        {icon && <span className="ac-menu__icon">{icon}</span>}
        <span className="ac-menu__label">{children}</span>
        {shortcut && <span className="ac-menu__shortcut">{shortcut}</span>}
      </div>
    );
  },
);

export type DropdownMenuCheckboxItemProps = Omit<ItemBaseProps, "onSelect" | "icon"> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export const DropdownMenuCheckboxItem = forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  function DropdownMenuCheckboxItem(
    { checked, onCheckedChange, disabled = false, shortcut, className, children, ...props },
    ref,
  ) {
    const handlers = useItemActivation(() => onCheckedChange(!checked), disabled);
    return (
      <div
        {...props}
        {...handlers}
        ref={ref}
        role="menuitemcheckbox"
        aria-checked={checked}
        tabIndex={-1}
        aria-disabled={disabled || undefined}
        data-roving-item=""
        data-disabled={dataAttr(disabled)}
        className={cn("ac-menu__item", className)}
      >
        <span className="ac-menu__icon">{checked && <IconCheck />}</span>
        <span className="ac-menu__label">{children}</span>
        {shortcut && <span className="ac-menu__shortcut">{shortcut}</span>}
      </div>
    );
  },
);

export type DropdownMenuRadioItemProps = Omit<ItemBaseProps, "icon"> & {
  checked: boolean;
  /** Replaces the check mark, e.g. the icon of the theme being chosen. */
  icon?: ReactNode;
};

/** One choice among several (`menuitemradio`): the menu closes once it is made. */
export const DropdownMenuRadioItem = forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  function DropdownMenuRadioItem(
    { checked, onSelect, disabled = false, shortcut, icon, className, children, ...props },
    ref,
  ) {
    const handlers = useItemActivation(onSelect, disabled);
    return (
      <div
        {...props}
        {...handlers}
        ref={ref}
        role="menuitemradio"
        aria-checked={checked}
        tabIndex={-1}
        aria-disabled={disabled || undefined}
        data-roving-item=""
        data-disabled={dataAttr(disabled)}
        className={cn("ac-menu__item", className)}
      >
        <span className="ac-menu__icon">{icon ?? (checked && <IconCheck />)}</span>
        <span className="ac-menu__label">{children}</span>
        {shortcut && <span className="ac-menu__shortcut">{shortcut}</span>}
      </div>
    );
  },
);

export function DropdownMenuLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} role="presentation" className={cn("ac-menu__group-label", className)} />;
}

export function DropdownMenuGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} role="group" className={cn("ac-menu__group", className)} />;
}

export function DropdownMenuSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} role="separator" className={cn("ac-menu__separator", className)} />;
}

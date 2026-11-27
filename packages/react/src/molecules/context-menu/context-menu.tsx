import { cn } from "@atomscraft/core";
import { createContext, forwardRef, useContext, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes, KeyboardEvent, ReactElement, ReactNode } from "react";
import { useControllableState, useRovingFocus } from "../../hooks";
import { useAtomCraft } from "../../provider";
import { Portal, Slot, useComposedRefs } from "../../utils";

const ITEM = "[data-context-menu-item]:not([aria-disabled='true'])";

type ContextMenuState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  point: { x: number; y: number };
  setPoint: (point: { x: number; y: number }) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
};

const Context = createContext<ContextMenuState | null>(null);
function useContextMenu() {
  const value = useContext(Context);
  if (!value) throw new Error("ContextMenu parts must be used inside ContextMenu.");
  return value;
}

export type ContextMenuProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ContextMenu({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}: ContextMenuProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const id = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  return (
    <Context.Provider
      value={{ open: isOpen, setOpen, id, point, setPoint, triggerRef, contentRef }}
    >
      {children}
    </Context.Provider>
  );
}

export function ContextMenuTrigger({ children }: { children: ReactElement }) {
  const { open, id, setPoint, setOpen, triggerRef } = useContextMenu();
  const showAt = (x: number, y: number) => {
    setPoint({ x, y });
    setOpen(true);
  };
  return (
    <Slot
      ref={triggerRef}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? id : undefined}
      onContextMenu={(event) => {
        event.preventDefault();
        showAt(event.clientX, event.clientY);
      }}
      onKeyDown={(event: KeyboardEvent) => {
        if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
          event.preventDefault();
          const rect = triggerRef.current?.getBoundingClientRect();
          showAt(rect ? rect.left + rect.width / 2 : 0, rect ? rect.top + rect.height / 2 : 0);
        }
      }}
    >
      {children}
    </Slot>
  );
}

export type ContextMenuContentProps = HTMLAttributes<HTMLDivElement>;
export const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  function ContextMenuContent({ className, onKeyDown, style, ...props }, forwardedRef) {
    const menu = useContextMenu();
    const { dir } = useAtomCraft();
    const ref = useComposedRefs(forwardedRef, menu.contentRef);
    const navigate = useRovingFocus(menu.contentRef, { orientation: "vertical", typeahead: true });
    useEffect(() => {
      if (!menu.open) return;
      const handlePointerDown = (event: PointerEvent) => {
        if (
          !menu.contentRef.current?.contains(event.target as Node) &&
          !menu.triggerRef.current?.contains(event.target as Node)
        )
          menu.setOpen(false);
      };
      const handleKeyDown = (event: globalThis.KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          menu.setOpen(false);
          menu.triggerRef.current?.focus();
        }
      };
      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [menu]);

    useEffect(() => {
      if (!menu.open) return;
      menu.contentRef.current?.querySelector<HTMLElement>(ITEM)?.focus();
    }, [menu.open, menu.contentRef]);

    if (!menu.open) return null;
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      navigate(event);
    };
    return (
      <Portal>
        <div
          {...props}
          ref={ref}
          id={menu.id}
          role="menu"
          aria-orientation="vertical"
          data-slot="context-menu"
          className={cn("ac-menu ac-context-menu", className)}
          style={
            {
              ...style,
              position: "fixed",
              "--_context-x":
                dir === "rtl" ? `calc(100vw - ${menu.point.x}px)` : `${menu.point.x}px`,
              "--_context-y": `${menu.point.y}px`,
            } as CSSProperties
          }
          onKeyDown={handleKeyDown}
        />
      </Portal>
    );
  },
);

export type ContextMenuItemProps = Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> & {
  onSelect?: () => void;
  disabled?: boolean;
};
export const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  function ContextMenuItem(
    { onSelect, disabled = false, className, onClick, onKeyDown, ...props },
    ref,
  ) {
    const menu = useContextMenu();
    const activate = () => {
      if (!disabled) {
        onSelect?.();
        menu.setOpen(false);
        menu.triggerRef.current?.focus();
      }
    };
    return (
      <div
        {...props}
        ref={ref}
        role="menuitem"
        tabIndex={-1}
        aria-disabled={disabled || undefined}
        data-context-menu-item=""
        data-roving-item=""
        data-disabled={disabled || undefined}
        className={cn("ac-menu__item", className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) activate();
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (!event.defaultPrevented && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            activate();
          }
        }}
      />
    );
  },
);

export function ContextMenuLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} role="presentation" className={cn("ac-menu__group-label", className)} />;
}

export function ContextMenuSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} role="separator" className={cn("ac-menu__separator", className)} />;
}

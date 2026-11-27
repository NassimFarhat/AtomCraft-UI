import type { Align, Side } from "@atomscraft/core";
import { useCallback, useEffect, useId, useRef } from "react";
import type { ReactElement, ReactNode } from "react";
import { useControllableState, usePosition } from "../../hooks";
import { Portal, Slot } from "../../utils";

const CLOSE_GRACE_MS = 100;

export type HoverCardProps = {
  children: ReactElement;
  content: ReactNode;
  label: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  align?: Align;
  openDelay?: number;
  closeDelay?: number;
};

/** Rich, non-modal preview shown on hover or keyboard focus. */
export function HoverCard({
  children,
  content,
  label,
  open,
  defaultOpen = false,
  onOpenChange,
  side = "bottom",
  align = "start",
  openDelay = 300,
  closeDelay = CLOSE_GRACE_MS,
}: HoverCardProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const id = useId();
  const position = usePosition(triggerRef, contentRef, { open: isOpen, side, align, offset: 6 });

  const schedule = useCallback(
    (next: boolean, delay: number) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setOpen(next), delay);
    },
    [setOpen],
  );

  const closeAndFocus = useCallback(() => {
    clearTimeout(timerRef.current);
    setOpen(false);
    triggerRef.current?.focus();
  }, [setOpen]);

  useEffect(() => () => clearTimeout(timerRef.current), []);
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAndFocus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeAndFocus, isOpen]);

  return (
    <>
      <Slot
        ref={triggerRef}
        aria-describedby={isOpen ? id : undefined}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onPointerEnter={() => schedule(true, openDelay)}
        onPointerLeave={() => schedule(false, closeDelay)}
        onFocus={() => schedule(true, 0)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && isOpen) {
            event.preventDefault();
            closeAndFocus();
          }
        }}
        onBlur={(event) => {
          if (!contentRef.current?.contains(event.relatedTarget as Node | null))
            schedule(false, closeDelay);
        }}
      >
        {children}
      </Slot>
      {isOpen && (
        <Portal>
          <div
            ref={contentRef}
            id={id}
            role="dialog"
            aria-label={label}
            data-slot="hover-card"
            data-side={position.side}
            className="ac-hover-card"
            style={position.style}
            onPointerEnter={() => clearTimeout(timerRef.current)}
            onPointerLeave={() => schedule(false, closeDelay)}
            onFocus={() => clearTimeout(timerRef.current)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeAndFocus();
              }
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null))
                schedule(false, closeDelay);
            }}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}

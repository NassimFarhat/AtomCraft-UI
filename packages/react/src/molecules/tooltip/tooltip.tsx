import { cn } from "@atomcraft/core";
import type { Align, Side } from "@atomcraft/core";
import { useEffect, useId, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { usePosition } from "../../hooks";
import { Portal, Slot } from "../../utils";

export type TooltipProps = {
  /** Short, non-interactive text. Use a Popover for links or buttons. */
  content: ReactNode;
  /** The trigger: a single focusable element. */
  children: ReactElement;
  side?: Side;
  align?: Align;
  /** Delay before showing on hover, in ms. Focus shows it immediately. */
  delay?: number;
};

const HIDE_GRACE_MS = 100;

/**
 * Shows on hover and keyboard focus, hides on Escape, and stays open while
 * hovered so it can be read (WCAG 1.4.13).
 */
export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delay = 400,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();
  const position = usePosition(triggerRef, contentRef, { open, side, align, offset: 6 });

  const schedule = (next: boolean, wait: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), wait);
  };

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      <Slot
        ref={triggerRef}
        aria-describedby={open ? id : undefined}
        onPointerEnter={() => schedule(true, delay)}
        onPointerLeave={() => schedule(false, HIDE_GRACE_MS)}
        onFocus={() => schedule(true, 0)}
        onBlur={() => schedule(false, 0)}
      >
        {children}
      </Slot>
      {open && (
        <Portal>
          <div
            ref={contentRef}
            id={id}
            role="tooltip"
            data-slot="tooltip"
            data-side={position.side}
            className={cn("ac-tooltip")}
            style={position.style}
            onPointerEnter={() => clearTimeout(timer.current)}
            onPointerLeave={() => schedule(false, HIDE_GRACE_MS)}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}

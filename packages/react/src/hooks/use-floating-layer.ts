import type { Align, Side } from "@atomcraft/core";
import { useCallback, useEffect, useId, useRef } from "react";
import type { RefObject } from "react";
import { useControllableState } from "./use-controllable-state";
import { useDismiss } from "./use-dismiss";
import { usePosition } from "./use-position";

export type FloatingLayerOptions = {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  side?: Side | undefined;
  align?: Align | undefined;
  /**
   * Element the layer lines up with, when it is not the trigger itself:
   * a combobox opens under the whole control, not under its text box.
   */
  anchorRef?: RefObject<HTMLElement | null> | undefined;
};

/**
 * Shared state of every anchored layer (Popover, DropdownMenu): open state,
 * ids, positioning, dismissal and focus return to the trigger.
 */
export function useFloatingLayer({
  open,
  defaultOpen = false,
  onOpenChange,
  side,
  align,
  anchorRef,
}: FloatingLayerOptions) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const contentId = useId();
  const anchor = anchorRef ?? triggerRef;
  const position = usePosition(anchor, contentRef, {
    open: isOpen,
    ...(side ? { side } : {}),
    ...(align ? { align } : {}),
  });

  const close = useCallback(
    (returnFocus = true) => {
      setOpen(false);
      if (returnFocus) triggerRef.current?.focus();
    },
    [setOpen],
  );

  useDismiss([anchor, triggerRef, contentRef], close, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handleFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget;
      const isInside =
        next instanceof Node &&
        (contentRef.current?.contains(next) || triggerRef.current?.contains(next));
      if (next && !isInside) setOpen(false);
    };
    const content = contentRef.current;
    content?.addEventListener("focusout", handleFocusOut);
    return () => content?.removeEventListener("focusout", handleFocusOut);
  }, [isOpen, setOpen]);

  return { isOpen, setOpen, close, triggerRef, contentRef, contentId, position };
}

export type FloatingLayer = ReturnType<typeof useFloatingLayer>;

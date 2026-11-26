import { cn, getFocusableElements } from "@atomscraft/core";
import { createContext, forwardRef, useContext, useEffect } from "react";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { useFloatingLayer } from "../../hooks";
import type { FloatingLayer, FloatingLayerOptions } from "../../hooks";
import { Portal, Slot, useComposedRefs } from "../../utils";

const PopoverContext = createContext<FloatingLayer | null>(null);

function usePopover(): FloatingLayer {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("Popover parts must be used inside a Popover.");
  return context;
}

export type PopoverProps = FloatingLayerOptions & { children: ReactNode };

/** Non-modal dialog anchored to a trigger: rich content, links, small forms. */
export function Popover({ children, ...options }: PopoverProps) {
  const layer = useFloatingLayer(options);
  return <PopoverContext.Provider value={layer}>{children}</PopoverContext.Provider>;
}

export function PopoverTrigger({ children }: { children: ReactElement }) {
  const { isOpen, setOpen, triggerRef, contentId } = usePopover();
  return (
    <Slot
      ref={triggerRef}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={isOpen ? contentId : undefined}
      data-state={isOpen ? "open" : "closed"}
      onClick={() => setOpen(!isOpen)}
    >
      {children}
    </Slot>
  );
}

export type PopoverContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Accessible name of the dialog when it has no visible heading. */
  "aria-label"?: string;
};

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent({ className, children, ...props }, forwardedRef) {
    const { isOpen, contentRef, contentId, position } = usePopover();
    const ref = useComposedRefs(forwardedRef, contentRef);

    useEffect(() => {
      if (!isOpen || !contentRef.current) return;
      const [first] = getFocusableElements(contentRef.current);
      (first ?? contentRef.current).focus();
    }, [isOpen, contentRef]);

    if (!isOpen) return null;
    return (
      <Portal>
        <div
          {...props}
          ref={ref}
          id={contentId}
          role="dialog"
          tabIndex={-1}
          data-slot="popover"
          data-side={position.side}
          className={cn("ac-popover", className)}
          style={{ ...props.style, ...position.style }}
        >
          {children}
        </div>
      </Portal>
    );
  },
);

/** Closes the popover when its child is pressed, and returns focus to the trigger. */
export function PopoverClose({ children }: { children: ReactElement }) {
  const { close } = usePopover();
  return <Slot onClick={() => close()}>{children}</Slot>;
}

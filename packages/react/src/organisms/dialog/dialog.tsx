import { cn } from "@atomcraft/core";
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { HTMLAttributes, MouseEvent, ReactElement, ReactNode } from "react";
import { IconButton } from "../../atoms/button";
import { useControllableState } from "../../hooks";
import { IconX } from "../../icons";
import { useMessages } from "../../provider";
import { Slot, useComposedRefs } from "../../utils";

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog(): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) throw new Error("Dialog parts must be used inside a Dialog.");
  return context;
}

export type DialogProps = {
  open?: boolean | undefined;
  defaultOpen?: boolean;
  onOpenChange?: ((open: boolean) => void) | undefined;
  children: ReactNode;
};

/** Modal dialog built on the native <dialog>: top layer, inert page, Escape to close. */
export function Dialog({ open, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [hasDescription, setHasDescription] = useState(false);
  const id = useId();
  const value = {
    open: isOpen,
    setOpen,
    titleId: `${id}-title`,
    descriptionId: `${id}-description`,
    hasDescription,
    setHasDescription,
  };
  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children }: { children: ReactElement }) {
  const { open, setOpen } = useDialog();
  return (
    <Slot aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
      {children}
    </Slot>
  );
}

export function DialogClose({ children }: { children: ReactElement }) {
  const { setOpen } = useDialog();
  return <Slot onClick={() => setOpen(false)}>{children}</Slot>;
}

export type DialogPlacement = "center" | "start" | "end" | "top" | "bottom";

export type DialogContentProps = HTMLAttributes<HTMLDialogElement> & {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** `center` is a dialog; the other sides make it a sheet (drawer). */
  placement?: DialogPlacement;
  /** Alert dialog: needs an explicit choice, so clicking the backdrop does not close it. */
  alert?: boolean;
  showCloseButton?: boolean;
};

function useNativeDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusTo.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
    if (!open) returnFocusTo.current?.focus();
  }, [open]);
  return ref;
}

export const DialogContent = forwardRef<HTMLDialogElement, DialogContentProps>(
  function DialogContent(
    {
      size = "md",
      placement = "center",
      alert = false,
      showCloseButton = true,
      className,
      children,
      onClick,
      ...props
    },
    forwardedRef,
  ) {
    const dialog = useDialog();
    const messages = useMessages();
    const nativeRef = useNativeDialog(dialog.open);
    const ref = useComposedRefs(forwardedRef, nativeRef);

    const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
      onClick?.(event);
      if (event.target === event.currentTarget && !alert) dialog.setOpen(false);
    };

    return (
      <dialog
        {...props}
        ref={ref}
        role={alert ? "alertdialog" : undefined}
        aria-labelledby={dialog.titleId}
        aria-describedby={dialog.hasDescription ? dialog.descriptionId : undefined}
        data-slot="dialog"
        data-size={size}
        data-placement={placement}
        className={cn("ac-dialog", className)}
        onClose={() => dialog.setOpen(false)}
        onClick={handleBackdropClick}
      >
        {dialog.open && (
          <div className="ac-dialog__panel">
            {children}
            {showCloseButton && (
              <IconButton
                label={messages.close}
                size="sm"
                className="ac-dialog__close"
                onClick={() => dialog.setOpen(false)}
              >
                <IconX />
              </IconButton>
            )}
          </div>
        )}
      </dialog>
    );
  },
);

type DivProps = HTMLAttributes<HTMLDivElement>;

export function DialogHeader({ className, ...props }: DivProps) {
  return (
    <div {...props} data-slot="dialog-header" className={cn("ac-dialog__header", className)} />
  );
}

export function DialogBody({ className, ...props }: DivProps) {
  return <div {...props} data-slot="dialog-body" className={cn("ac-dialog__body", className)} />;
}

export function DialogFooter({ className, ...props }: DivProps) {
  return (
    <div {...props} data-slot="dialog-footer" className={cn("ac-dialog__footer", className)} />
  );
}

export function DialogTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  const { titleId } = useDialog();
  return (
    <h2
      {...props}
      id={titleId}
      data-slot="dialog-title"
      className={cn("ac-dialog__title", className)}
    />
  );
}

export function DialogDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId, setHasDescription } = useDialog();
  useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);
  return (
    <p
      {...props}
      id={descriptionId}
      data-slot="dialog-description"
      className={cn("ac-dialog__description", className)}
    />
  );
}

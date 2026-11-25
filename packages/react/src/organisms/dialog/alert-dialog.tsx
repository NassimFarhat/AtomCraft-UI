import type { ReactNode } from "react";
import { Button } from "../../atoms/button";
import { useMessages } from "../../provider";
import type { Tone } from "../../types";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import type { DialogProps } from "./dialog";

/** Modal that interrupts to confirm a consequential action. Same state API as Dialog. */
export const AlertDialog = (props: DialogProps) => <Dialog {...props} />;

export const AlertDialogTrigger = DialogTrigger;

export type AlertDialogContentProps = {
  title: ReactNode;
  /** Says what happens, including anything that cannot be undone. */
  description: ReactNode;
  /** Text of the confirming button. Name the action, e.g. "Delete invoice". */
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  /** `danger` for destructive actions, which is the default. */
  tone?: Tone;
  loading?: boolean;
  onConfirm: () => void;
  /** Extra content between the description and the buttons. */
  children?: ReactNode;
};

/**
 * The whole alert: `role="alertdialog"`, a backdrop that does not dismiss it,
 * and an explicit choice. Focus starts on Cancel, so a stray Enter is harmless.
 */
export function AlertDialogContent({
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = "danger",
  loading = false,
  onConfirm,
  children,
}: AlertDialogContentProps) {
  const messages = useMessages();
  return (
    <DialogContent alert size="sm" showCloseButton={false}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <DialogDescription>{description}</DialogDescription>
        {children}
      </DialogBody>
      <DialogFooter>
        <DialogClose>
          <Button variant="outline" tone="neutral" disabled={loading}>
            {cancelLabel ?? messages.cancel}
          </Button>
        </DialogClose>
        <Button tone={tone} loading={loading} onClick={onConfirm}>
          {confirmLabel ?? messages.confirm}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

import { forwardRef } from "react";
import { DialogContent } from "./dialog";
import type { DialogContentProps } from "./dialog";

export type SheetSide = "start" | "end" | "top" | "bottom";

export type SheetContentProps = Omit<DialogContentProps, "placement" | "size"> & {
  side?: SheetSide;
};

/** A dialog that slides from an edge (drawer). Shares Dialog's state, focus and dismissal rules. */
export const SheetContent = forwardRef<HTMLDialogElement, SheetContentProps>(function SheetContent(
  { side = "end", ...props },
  ref,
) {
  return <DialogContent {...props} ref={ref} placement={side} />;
});

export {
  Dialog as Sheet,
  DialogBody as SheetBody,
  DialogClose as SheetClose,
  DialogDescription as SheetDescription,
  DialogFooter as SheetFooter,
  DialogHeader as SheetHeader,
  DialogTitle as SheetTitle,
  DialogTrigger as SheetTrigger,
} from "./dialog";

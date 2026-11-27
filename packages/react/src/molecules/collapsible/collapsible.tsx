import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../accordion";
import { useControllableState } from "../../hooks";
import type { ReactNode } from "react";
import type { AccordionProps } from "../accordion";

export type CollapsibleProps = Omit<
  AccordionProps,
  "type" | "value" | "defaultValue" | "onValueChange"
> & {
  open?: boolean | undefined;
  defaultOpen?: boolean;
  onOpenChange?: ((open: boolean) => void) | undefined;
  children: ReactNode;
};

/** Single disclosure built on the existing APG accordion behavior and styles. */
export function Collapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: CollapsibleProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  return (
    <Accordion
      {...props}
      type="single"
      value={isOpen ? ["disclosure"] : []}
      onValueChange={(values) => setOpen(values.includes("disclosure"))}
    >
      <AccordionItem value="disclosure">{children}</AccordionItem>
    </Accordion>
  );
}

export const CollapsibleTrigger = AccordionTrigger;
export const CollapsibleContent = AccordionContent;

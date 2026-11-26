import { cn } from "@atomscraft/core";
import { createContext, forwardRef, useContext, useId, useRef } from "react";
import type { ButtonHTMLAttributes, Context, HTMLAttributes, KeyboardEvent } from "react";
import { useControllableState, useRovingFocus } from "../../hooks";
import { IconChevronDown } from "../../icons";
import { useComposedRefs } from "../../utils";

type AccordionContextValue = { openItems: string[]; toggle: (value: string) => void };
type ItemContextValue = { value: string; isOpen: boolean; triggerId: string; contentId: string };

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<ItemContextValue | null>(null);

function useRequiredContext<T>(context: Context<T | null>, part: string): T {
  const value = useContext(context);
  if (!value) throw new Error(`${part} must be used inside an Accordion.`);
  return value;
}

export type AccordionProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  /** `single` keeps at most one item open. */
  type?: "single" | "multiple";
  value?: string[] | undefined;
  defaultValue?: string[];
  onValueChange?: ((value: string[]) => void) | undefined;
  /** With `single`, allows closing the open item. */
  collapsible?: boolean;
  variant?: "separated" | "contained" | "plain";
};

function nextOpenItems(
  open: string[],
  value: string,
  type: "single" | "multiple",
  collapsible: boolean,
) {
  const isOpen = open.includes(value);
  if (type === "multiple") return isOpen ? open.filter((item) => item !== value) : [...open, value];
  if (isOpen) return collapsible ? [] : open;
  return [value];
}

/** Accordion pattern (WAI-ARIA APG). Up/Down/Home/End move between headers. */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    type = "single",
    value,
    defaultValue = [],
    onValueChange,
    collapsible = true,
    variant = "separated",
    className,
    onKeyDown,
    ...props
  },
  forwardedRef,
) {
  const [openItems, setOpenItems] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const ref = useComposedRefs(forwardedRef, rootRef);
  const navigate = useRovingFocus(rootRef, { orientation: "vertical", loop: true });
  const toggle = (item: string) =>
    setOpenItems((open) => nextOpenItems(open, item, type, collapsible));

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div
        {...props}
        ref={ref}
        data-slot="accordion"
        data-variant={variant}
        className={cn("ac-accordion", className)}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          onKeyDown?.(event);
          navigate(event);
        }}
      />
    </AccordionContext.Provider>
  );
});

export type AccordionItemProps = HTMLAttributes<HTMLDivElement> & { value: string };

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, className, ...props },
  ref,
) {
  const { openItems } = useRequiredContext(AccordionContext, "AccordionItem");
  const id = useId();
  const isOpen = openItems.includes(value);
  return (
    <ItemContext.Provider
      value={{ value, isOpen, triggerId: `${id}-trigger`, contentId: `${id}-content` }}
    >
      <div
        {...props}
        ref={ref}
        data-slot="accordion-item"
        data-state={isOpen ? "open" : "closed"}
        className={cn("ac-accordion__item", className)}
      />
    </ItemContext.Provider>
  );
});

export type AccordionTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Heading level wrapping the button, to fit the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ headingLevel = 3, className, children, onClick, ...props }, ref) {
    const { toggle } = useRequiredContext(AccordionContext, "AccordionTrigger");
    const item = useRequiredContext(ItemContext, "AccordionTrigger");
    const Heading = `h${headingLevel}` as const;
    return (
      <Heading className="ac-accordion__heading">
        <button
          {...props}
          ref={ref}
          type="button"
          id={item.triggerId}
          aria-expanded={item.isOpen}
          aria-controls={item.contentId}
          data-roving-item=""
          data-slot="accordion-trigger"
          className={cn("ac-accordion__trigger", className)}
          onClick={(event) => {
            onClick?.(event);
            toggle(item.value);
          }}
        >
          <span className="ac-accordion__title">{children}</span>
          <IconChevronDown className="ac-accordion__chevron" />
        </button>
      </Heading>
    );
  },
);

export const AccordionContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function AccordionContent({ className, children, ...props }, ref) {
    const item = useRequiredContext(ItemContext, "AccordionContent");
    return (
      <div
        {...props}
        ref={ref}
        role="region"
        id={item.contentId}
        aria-labelledby={item.triggerId}
        hidden={!item.isOpen}
        data-slot="accordion-content"
        className={cn("ac-accordion__content", className)}
      >
        <div className="ac-accordion__content-inner">{children}</div>
      </div>
    );
  },
);

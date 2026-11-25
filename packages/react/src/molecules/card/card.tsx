import { cn, dataAttr } from "@atomcraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { Slot } from "../../utils";

type DivProps = HTMLAttributes<HTMLDivElement>;

export type CardProps = DivProps & {
  variant?: "outline" | "elevated" | "filled";
  /** Hover and focus feedback, for cards that are links or buttons (use with asChild). */
  interactive?: boolean;
  asChild?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "outline", interactive = false, asChild = false, className, ...props },
  ref,
) {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      {...props}
      ref={ref}
      data-slot="card"
      data-variant={variant}
      data-interactive={dataAttr(interactive)}
      className={cn("ac-card", className)}
    />
  );
});

/** Builds a styled `div` section so every Card part follows the same contract. */
function createCardPart(slot: string, displayName: string) {
  const Part = forwardRef<HTMLDivElement, DivProps>(function CardPart(
    { className, ...props },
    ref,
  ) {
    return <div {...props} ref={ref} data-slot={slot} className={cn(`ac-${slot}`, className)} />;
  });
  Part.displayName = displayName;
  return Part;
}

export const CardHeader = createCardPart("card-header", "CardHeader");
export const CardContent = createCardPart("card-content", "CardContent");
export const CardFooter = createCardPart("card-footer", "CardFooter");
/** Top-end slot of the header: a menu, a badge, a link. */
export const CardAction = createCardPart("card-action", "CardAction");

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...props }, ref) {
    return (
      <h3 {...props} ref={ref} data-slot="card-title" className={cn("ac-card-title", className)} />
    );
  },
);

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      {...props}
      ref={ref}
      data-slot="card-description"
      className={cn("ac-card-description", className)}
    />
  );
});

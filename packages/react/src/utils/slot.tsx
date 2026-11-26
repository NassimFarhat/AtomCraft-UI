import { Children, cloneElement, forwardRef, version } from "react";
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { useComposedRefs } from "./compose-refs";
import { mergeProps } from "./merge-props";
import type { EventOrder } from "./merge-props";

export type SlotProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  /** Internal composition escape hatch for controls that must guard child events first. */
  eventOrder?: EventOrder;
};

type ChildElement = ReactElement<Record<string, unknown>> & { ref?: Ref<HTMLElement> };

const REF_IS_A_PROP = Number.parseInt(version, 10) >= 19;

function getChildRef(child: ChildElement): Ref<HTMLElement> | undefined {
  return REF_IS_A_PROP ? (child.props["ref"] as Ref<HTMLElement> | undefined) : child.ref;
}

/**
 * Renders its single child instead of a wrapper element, passing its own props down.
 * Powers the `asChild` pattern: `<Button asChild><a href="/">Home</a></Button>`.
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, eventOrder = "child-first", ...slotProps },
  forwardedRef,
) {
  const child = Children.only(children) as ChildElement;
  const ref = useComposedRefs(forwardedRef, getChildRef(child));
  return cloneElement(child, { ...mergeProps(slotProps, child.props, eventOrder), ref });
});

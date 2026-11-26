import { cn } from "@atomscraft/core";

type Props = Record<string, unknown>;
type Handler = (...args: unknown[]) => void;
export type EventOrder = "child-first" | "slot-first";

const EVENT_HANDLER = /^on[A-Z]/;

const isHandler = (value: unknown): value is Handler => typeof value === "function";

function mergeValue(
  key: string,
  slotValue: unknown,
  childValue: unknown,
  eventOrder: EventOrder,
): unknown {
  if (childValue === undefined) return slotValue;
  if (key === "className") return cn(slotValue as string, childValue as string);
  if (key === "style") return { ...(slotValue as object), ...(childValue as object) };
  if (EVENT_HANDLER.test(key) && isHandler(slotValue) && isHandler(childValue)) {
    return (...args: unknown[]) => {
      if (eventOrder === "slot-first") {
        slotValue(...args);
        const event = args[0] as { defaultPrevented?: boolean } | undefined;
        if (!event?.defaultPrevented) childValue(...args);
        return;
      }
      childValue(...args);
      slotValue(...args);
    };
  }
  return childValue;
}

/**
 * Merges the props a Slot receives with the props of its child.
 * The child wins for plain values; classes, styles and event handlers are combined.
 */
export function mergeProps(
  slotProps: Props,
  childProps: Props,
  eventOrder: EventOrder = "child-first",
): Props {
  const merged: Props = { ...slotProps, ...childProps };
  for (const key of Object.keys(slotProps)) {
    merged[key] = mergeValue(key, slotProps[key], childProps[key], eventOrder);
  }
  return merged;
}

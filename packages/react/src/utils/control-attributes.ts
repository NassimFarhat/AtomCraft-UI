import { cn, dataAttr } from "@atomcraft/core";
import type { ControlSize } from "../types";

export type ControlStateOptions = {
  /** Value of `data-slot`, and the name used in tests and styles. */
  slot: string;
  /** Base class of the component, e.g. `ac-combobox`. */
  base: string;
  size: ControlSize | undefined;
  invalid: boolean;
  disabled: boolean | undefined;
  className: string | undefined;
  /** Extra classes, e.g. a modifier. */
  modifier?: string | false | undefined;
};

/**
 * The attributes every composite form control exposes: its slot, size and the
 * invalid and disabled states the stylesheet hooks into.
 */
export function controlAttributes({
  slot,
  base,
  size = "md",
  invalid,
  disabled = false,
  className,
  modifier,
}: ControlStateOptions) {
  return {
    "data-slot": slot,
    "data-size": size,
    "data-invalid": dataAttr(invalid),
    "data-disabled": dataAttr(disabled),
    className: cn(base, modifier, className),
  };
}

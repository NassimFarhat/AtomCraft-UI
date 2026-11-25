import { cn } from "@atomcraft/core";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import type { ControlSize } from "../../types";
import { Slot } from "../../utils";

export type InputGroupProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  /** Icon, text ("https://") or small button before the input. */
  start?: ReactNode;
  /** Icon, text (".tn") or small button after the input. */
  end?: ReactNode;
  size?: ControlSize;
  /** The Input it decorates. */
  children: ReactElement;
};

/**
 * Wraps an Input with leading/trailing addons in one visual box.
 * Id and ARIA props given to the group (e.g. by Field) are forwarded to the input.
 */
export function InputGroup({
  start,
  end,
  size = "md",
  className,
  children,
  ...controlProps
}: InputGroupProps) {
  return (
    <div data-slot="input-group" data-size={size} className={cn("ac-input-group", className)}>
      {start && (
        <span className="ac-input-group__addon" data-position="start">
          {start}
        </span>
      )}
      <Slot {...controlProps}>{children}</Slot>
      {end && (
        <span className="ac-input-group__addon" data-position="end">
          {end}
        </span>
      )}
    </div>
  );
}

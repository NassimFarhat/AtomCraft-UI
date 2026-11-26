import { cn, dataAttr } from "@atomscraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { IconX } from "../../icons";
import { useMessages } from "../../provider";
import type { Tone } from "../../types";

export type TagVariant = "solid" | "soft" | "outline";
export type TagSize = "sm" | "md" | "lg";

export type TagProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: TagVariant;
  tone?: Tone;
  size?: TagSize;
  icon?: ReactNode;
  /** Shows a remove button. The tag's text names it for assistive technologies. */
  onRemove?: (() => void) | undefined;
  /** Overrides the remove button's accessible name, e.g. "Remove the Design filter". */
  removeLabel?: string;
  disabled?: boolean;
};

/**
 * Compact, removable label: a selected filter, a recipient, a keyword.
 * Use Badge instead for read-only status that the user cannot act on.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    variant = "soft",
    tone = "neutral",
    size = "md",
    icon,
    onRemove,
    removeLabel,
    disabled = false,
    className,
    children,
    ...props
  },
  ref,
) {
  const messages = useMessages();
  return (
    <span
      {...props}
      ref={ref}
      data-slot="tag"
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-disabled={dataAttr(disabled)}
      className={cn("ac-tag", className)}
    >
      {icon && (
        <span className="ac-tag__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="ac-tag__label">{children}</span>
      {onRemove && (
        <button
          type="button"
          className="ac-tag__remove"
          disabled={disabled}
          aria-label={removeLabel ?? messages.remove}
          onClick={onRemove}
        >
          <IconX />
        </button>
      )}
    </span>
  );
});

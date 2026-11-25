import { cn, dataAttr } from "@atomcraft/core";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { Tone } from "../../types";
import { Slot } from "../../utils";
import { Spinner } from "../spinner";

export type ButtonVariant = "solid" | "soft" | "outline" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  tone?: Tone;
  size?: ButtonSize;
  /** Disables the button and shows a spinner while an action is running. */
  loading?: boolean;
  /** Stretches the button to the width of its container. */
  block?: boolean;
  /** Renders the child element (a link, a router Link) with the button styles. */
  asChild?: boolean;
  children?: ReactNode;
};

type StyleProps = {
  variant: ButtonVariant | undefined;
  tone: Tone | undefined;
  size: ButtonSize | undefined;
  block: boolean | undefined;
  loading: boolean;
  className: string | undefined;
};

/** Data attributes read by button.css; shared by the native and the asChild rendering. */
function buttonAttributes({
  variant = "solid",
  tone = "primary",
  size = "md",
  block = false,
  loading,
  className,
}: StyleProps) {
  return {
    "data-slot": "button",
    "data-variant": variant,
    "data-tone": tone,
    "data-size": size,
    "data-block": dataAttr(block),
    "data-loading": dataAttr(loading),
    className: cn("ac-button", className),
  };
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    tone,
    size,
    block,
    loading = false,
    asChild = false,
    disabled,
    type = "button",
    className,
    children,
    ...props
  },
  ref,
) {
  const shared = {
    ...props,
    ...buttonAttributes({ variant, tone, size, block, loading, className }),
  };

  if (asChild) {
    return (
      <Slot {...shared} ref={ref}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      {...shared}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && <Spinner size="sm" label="" />}
      {children}
    </button>
  );
});

export type IconButtonProps = Omit<ButtonProps, "block" | "children"> & {
  /** Accessible name: an icon alone is not one. */
  label: string;
  children: ReactNode;
};

/** Square button holding a single icon. Same variants, tones and sizes as Button. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = "ghost", tone = "neutral", ...props },
  ref,
) {
  return (
    <Button
      {...props}
      ref={ref}
      variant={variant}
      tone={tone}
      aria-label={label}
      data-icon-only=""
    />
  );
});

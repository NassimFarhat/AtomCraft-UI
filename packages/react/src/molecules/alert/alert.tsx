import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { IconButton } from "../../atoms/button";
import { IconCircleAlert, IconCircleCheck, IconInfo, IconTriangleAlert, IconX } from "../../icons";
import { useMessages } from "../../provider";

export type AlertTone = "neutral" | "info" | "success" | "warning" | "danger";
export type AlertVariant = "soft" | "outline" | "solid";

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  tone?: AlertTone;
  variant?: AlertVariant;
  title?: ReactNode;
  /** Replaces the tone icon. Pass `null` to remove it. */
  icon?: ReactNode;
  /** Buttons or links under the text. */
  actions?: ReactNode;
  /** Shows a close button. */
  onDismiss?: (() => void) | undefined;
};

const TONE_ICONS = {
  neutral: IconInfo,
  info: IconInfo,
  success: IconCircleCheck,
  warning: IconTriangleAlert,
  danger: IconCircleAlert,
} as const;

/** Warnings and errors interrupt screen readers; other tones are announced politely. */
const URGENT: ReadonlySet<AlertTone> = new Set(["warning", "danger"]);

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    tone = "info",
    variant = "soft",
    title,
    icon,
    actions,
    onDismiss,
    className,
    children,
    ...props
  },
  ref,
) {
  const messages = useMessages();
  const ToneIcon = TONE_ICONS[tone];
  return (
    <div
      {...props}
      ref={ref}
      role={URGENT.has(tone) ? "alert" : "status"}
      data-slot="alert"
      data-tone={tone}
      data-variant={variant}
      className={cn("ac-alert", className)}
    >
      {icon !== null && <span className="ac-alert__icon">{icon ?? <ToneIcon />}</span>}
      <div className="ac-alert__body">
        {title && <p className="ac-alert__title">{title}</p>}
        {children && <div className="ac-alert__description">{children}</div>}
        {actions && <div className="ac-alert__actions">{actions}</div>}
      </div>
      {onDismiss && (
        <IconButton
          label={messages.dismiss}
          size="xs"
          tone="neutral"
          className="ac-alert__close"
          onClick={onDismiss}
        >
          <IconX />
        </IconButton>
      )}
    </div>
  );
});

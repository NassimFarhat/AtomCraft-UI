import { cn, dataAttr } from "@atomscraft/core";
import { useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { IconButton } from "../../atoms/button";
import { IconX } from "../../icons";
import { useMessages } from "../../provider";
import type { Tone } from "../../types";

export type BannerProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: ReactNode;
  children?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  action?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  role?: "status" | "alert" | "region";
};

/** Page-level announcement that shares the semantic tone system with Alert. */
export function Banner({
  title,
  children,
  tone = "info",
  icon,
  action,
  dismissible = false,
  onDismiss,
  role = tone === "danger" ? "alert" : "status",
  className,
  ...props
}: BannerProps) {
  const titleId = useId();
  const messages = useMessages();
  return (
    <div
      {...props}
      role={role}
      aria-labelledby={titleId}
      data-slot="banner"
      data-tone={tone}
      data-dismissible={dataAttr(dismissible)}
      className={cn("ac-banner", className)}
    >
      {icon && (
        <span aria-hidden="true" data-slot="banner-icon" className="ac-banner__icon">
          {icon}
        </span>
      )}
      <div className="ac-banner__body">
        <p id={titleId} className="ac-banner__title">
          {title}
        </p>
        {children && <div className="ac-banner__description">{children}</div>}
      </div>
      {action && <div className="ac-banner__action">{action}</div>}
      {dismissible && (
        <IconButton label={messages.dismiss} size="sm" tone={tone} onClick={onDismiss}>
          <IconX />
        </IconButton>
      )}
    </div>
  );
}

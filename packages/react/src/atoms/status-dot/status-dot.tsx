import { cn } from "@atomscraft/core";
import type { HTMLAttributes } from "react";
import type { Tone } from "../../types";

export type Status = "online" | "offline" | "away" | "busy" | "unknown";

export type StatusDotProps = HTMLAttributes<HTMLSpanElement> & {
  status: Status;
  label?: string;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
};

const STATUS_TONE: Record<Status, Tone> = {
  online: "success",
  offline: "neutral",
  away: "warning",
  busy: "danger",
  unknown: "info",
};

/** Status indicator; provide a label when the status is meaningful to the user. */
export function StatusDot({
  status,
  label,
  tone = STATUS_TONE[status],
  size = "md",
  className,
  ...props
}: StatusDotProps) {
  return (
    <span
      {...props}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-slot="status-dot"
      data-status={status}
      data-tone={tone}
      data-size={size}
      className={cn("ac-status-dot", className)}
    />
  );
}

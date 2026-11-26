import { cn, getInitials } from "@atomscraft/core";
import { forwardRef, useState } from "react";
import type { HTMLAttributes } from "react";
import type { Tone } from "../../types";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";
export type AvatarStatus = "online" | "away" | "busy" | "offline";

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  /** Person or entity shown; used as the accessible name and to build the initials. */
  name: string;
  src?: string | undefined;
  /** Replaces the computed initials. */
  fallback?: string | undefined;
  size?: AvatarSize;
  shape?: AvatarShape;
  tone?: Tone;
  /** Presence indicator, announced with the name. */
  status?: AvatarStatus | undefined;
  /** Label of the status, e.g. "En ligne". Defaults to the status key. */
  statusLabel?: string | undefined;
};

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    name,
    src,
    fallback,
    size = "md",
    shape = "circle",
    tone = "neutral",
    status,
    statusLabel,
    className,
    ...props
  },
  ref,
) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = src !== undefined && src !== failedSrc;
  const accessibleName = status ? `${name} (${statusLabel ?? status})` : name;

  return (
    <span
      {...props}
      ref={ref}
      role="img"
      aria-label={accessibleName}
      data-slot="avatar"
      data-size={size}
      data-shape={shape}
      data-tone={tone}
      className={cn("ac-avatar", className)}
    >
      {showImage ? (
        <img className="ac-avatar__image" src={src} alt="" onError={() => setFailedSrc(src)} />
      ) : (
        <span className="ac-avatar__fallback" aria-hidden="true">
          {fallback ?? getInitials(name)}
        </span>
      )}
      {status && <span className="ac-avatar__status" data-status={status} aria-hidden="true" />}
    </span>
  );
});

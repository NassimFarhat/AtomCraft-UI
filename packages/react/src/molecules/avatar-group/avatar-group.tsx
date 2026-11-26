import { cn } from "@atomscraft/core";
import { Children, forwardRef } from "react";
import type { HTMLAttributes, ReactElement } from "react";
import type { AvatarProps, AvatarSize } from "../../atoms/avatar";

export type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactElement<AvatarProps>[] | ReactElement<AvatarProps>;
  /** Avatars shown before the "+N" counter. */
  max?: number;
  size?: AvatarSize;
  /** Accessible label for the counter, e.g. "3 more members". Receives the hidden count. */
  overflowLabel?: (count: number) => string;
};

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { children, max = 4, size = "md", overflowLabel = (count) => `+${count}`, className, ...props },
  ref,
) {
  const avatars = Children.toArray(children);
  const hidden = avatars.length - max;
  return (
    <div
      {...props}
      ref={ref}
      role="group"
      data-slot="avatar-group"
      data-size={size}
      className={cn("ac-avatar-group", className)}
    >
      {avatars.slice(0, max)}
      {hidden > 0 && (
        <span
          className="ac-avatar ac-avatar-group__overflow"
          data-size={size}
          data-tone="neutral"
          role="img"
          aria-label={overflowLabel(hidden)}
        >
          <span aria-hidden="true">+{hidden}</span>
        </span>
      )}
    </div>
  );
});

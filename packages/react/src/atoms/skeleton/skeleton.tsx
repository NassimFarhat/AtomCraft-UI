import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

export type SkeletonShape = "text" | "rect" | "circle";

export type SkeletonProps = HTMLAttributes<HTMLSpanElement> & {
  shape?: SkeletonShape;
  /** Any CSS length. Text skeletons default to the full width. */
  width?: string | undefined;
  height?: string | undefined;
};

/** Placeholder while content loads. Hidden from assistive technologies: announce loading elsewhere. */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { shape = "text", width, height, className, style, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      aria-hidden="true"
      data-slot="skeleton"
      data-shape={shape}
      className={cn("ac-skeleton", className)}
      style={{ ...style, inlineSize: width, blockSize: height }}
    />
  );
});

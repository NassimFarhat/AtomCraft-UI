import { cn } from "@atomscraft/core";
import { forwardRef, useState } from "react";
import type { CSSProperties, ImgHTMLAttributes, ReactNode } from "react";

export type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  /** Required so the image's purpose is explicit; use an empty string when decorative. */
  alt: string;
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  aspectRatio?: number | string;
  fallback?: ReactNode;
  rootClassName?: string;
};

/** Responsive image frame with an optional caller-provided load-error fallback. */
export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { src, alt, fit = "cover", aspectRatio, fallback, rootClassName, className, onError, ...props },
  ref,
) {
  const [failedSource, setFailedSource] = useState<string>();
  const failed = failedSource === src;

  return (
    <span
      data-slot="image"
      data-state={failed ? "error" : "ready"}
      className={cn("ac-image", rootClassName)}
      style={aspectRatio ? ({ "--_image-ratio": String(aspectRatio) } as CSSProperties) : undefined}
    >
      {failed && fallback !== undefined ? (
        <span
          data-slot="image-fallback"
          className="ac-image__fallback"
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
        >
          {fallback}
        </span>
      ) : (
        <img
          {...props}
          ref={ref}
          src={src}
          alt={alt}
          data-slot="image-content"
          data-fit={fit}
          className={cn("ac-image__content", className)}
          onError={(event) => {
            onError?.(event);
            if (!event.defaultPrevented) setFailedSource(src);
          }}
        />
      )}
    </span>
  );
});

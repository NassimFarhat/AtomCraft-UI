import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import type { ControlSize, Tone } from "../../types";

export type ProgressProps = HTMLAttributes<HTMLDivElement> & {
  /** Current value. Leave undefined for an indeterminate (unknown duration) bar. */
  value?: number | undefined;
  max?: number;
  size?: ControlSize;
  tone?: Tone;
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, size = "md", tone = "primary", className, style, ...props },
  ref,
) {
  const isIndeterminate = value === undefined;
  const percent = isIndeterminate ? 0 : Math.min(Math.max(value / max, 0), 1) * 100;
  return (
    <div
      {...props}
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={isIndeterminate ? undefined : value}
      data-slot="progress"
      data-size={size}
      data-tone={tone}
      data-state={isIndeterminate ? "indeterminate" : "determinate"}
      className={cn("ac-progress", className)}
      style={{ ...style, "--_value": `${percent}%` } as CSSProperties}
    >
      <span className="ac-progress__bar" />
    </div>
  );
});

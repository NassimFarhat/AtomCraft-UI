import { cn } from "@atomcraft/core";
import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import { useAtomCraft } from "../../provider";
import type { ControlSize, Tone } from "../../types";

export type ProgressCircleProps = HTMLAttributes<HTMLDivElement> & {
  /** Current value. Leave undefined for an indeterminate (unknown duration) ring. */
  value?: number | undefined;
  max?: number;
  size?: ControlSize;
  tone?: Tone;
  /** Shows the percentage in the middle of the ring. */
  showValue?: boolean;
};

/** Circumference of the drawn circle, so a dash array can be given in percent. */
const PATH_LENGTH = 100;
const RADIUS = 16;
const STROKE = 4;

/** Ring-shaped progress: same semantics as Progress, for tight spaces and cards. */
export const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(
  function ProgressCircle(
    { value, max = 100, size = "md", tone = "primary", showValue = false, className, ...props },
    ref,
  ) {
    const { locale } = useAtomCraft();
    const isIndeterminate = value === undefined;
    const ratio = isIndeterminate ? 0 : Math.min(Math.max(value / max, 0), 1);
    return (
      <div
        {...props}
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={isIndeterminate ? undefined : value}
        data-slot="progress-circle"
        data-size={size}
        data-tone={tone}
        data-state={isIndeterminate ? "indeterminate" : "determinate"}
        className={cn("ac-progress-circle", className)}
      >
        <svg viewBox="0 0 40 40" className="ac-progress-circle__svg" aria-hidden="true">
          <circle
            className="ac-progress-circle__track"
            cx="20"
            cy="20"
            r={RADIUS}
            strokeWidth={STROKE}
          />
          <circle
            className="ac-progress-circle__indicator"
            cx="20"
            cy="20"
            r={RADIUS}
            strokeWidth={STROKE}
            pathLength={PATH_LENGTH}
            style={{ "--_dash": ratio * PATH_LENGTH } as CSSProperties}
          />
        </svg>
        {showValue && !isIndeterminate && (
          <span className="ac-progress-circle__value" aria-hidden="true">
            {new Intl.NumberFormat(locale, { style: "percent" }).format(ratio)}
          </span>
        )}
      </div>
    );
  },
);

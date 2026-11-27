import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { MeterHTMLAttributes } from "react";
import type { Tone } from "../../types";

export type MeterProps = MeterHTMLAttributes<HTMLMeterElement> & {
  tone?: Tone;
  size?: "sm" | "md" | "lg";
};

/** Native meter for a scalar value within a known range. */
export const Meter = forwardRef<HTMLMeterElement, MeterProps>(function Meter(
  { tone = "primary", size = "md", className, ...props },
  ref,
) {
  return (
    <meter
      {...props}
      ref={ref}
      data-slot="meter"
      data-tone={tone}
      data-size={size}
      className={cn("ac-meter", className)}
    />
  );
});

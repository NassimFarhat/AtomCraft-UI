import { cn } from "@atomcraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { IconArrowDown, IconArrowUp } from "../../icons";

export type StatProps = HTMLAttributes<HTMLDivElement> & {
  label: ReactNode;
  /** Already formatted value (use Intl.NumberFormat for numbers and currencies). */
  value: ReactNode;
  /** Already formatted change, e.g. "+12.5%". */
  delta?: ReactNode;
  /** Direction of the change. `up` is shown as positive unless `invertTrend` is set. */
  trend?: "up" | "down" | "flat";
  /** For metrics where going down is good (churn, errors). */
  invertTrend?: boolean;
  /** Text after the delta, e.g. "vs last month". */
  caption?: ReactNode;
  icon?: ReactNode;
};

const toneOf = (trend: StatProps["trend"], inverted: boolean) => {
  if (!trend || trend === "flat") return "neutral";
  return (trend === "up") !== inverted ? "success" : "danger";
};

/**
 * Key metric with its change. Color is never the only signal: an arrow shows the direction.
 * Values are isolated with <bdi> so numbers keep their order in right-to-left layouts.
 */
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, delta, trend, invertTrend = false, caption, icon, className, ...props },
  ref,
) {
  const Arrow = trend === "up" ? IconArrowUp : trend === "down" ? IconArrowDown : null;
  return (
    <div {...props} ref={ref} data-slot="stat" className={cn("ac-stat", className)}>
      <div className="ac-stat__header">
        <p className="ac-stat__label">{label}</p>
        {icon && (
          <span className="ac-stat__icon" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <p className="ac-stat__value">
        <bdi>{value}</bdi>
      </p>
      {(delta || caption) && (
        <p className="ac-stat__footer">
          {delta && (
            <span className="ac-stat__delta" data-tone={toneOf(trend, invertTrend)}>
              {Arrow && <Arrow />}
              <bdi>{delta}</bdi>
            </span>
          )}
          {caption && <span className="ac-stat__caption">{caption}</span>}
        </p>
      )}
    </div>
  );
});

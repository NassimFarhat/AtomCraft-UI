import { cn } from "@atomscraft/core";
import type { HTMLAttributes } from "react";
import { useAtomCraft } from "../../provider";

export type PriceDisplayProps = HTMLAttributes<HTMLSpanElement> & {
  amount: number;
  currency: string;
  locale?: string;
  previousAmount?: number;
  currencyDisplay?: "symbol" | "narrowSymbol" | "code" | "name";
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

/** Locale-aware currency display; numeric values remain machine-readable in the app. */
export function PriceDisplay({
  amount,
  currency,
  locale,
  previousAmount,
  currencyDisplay = "symbol",
  minimumFractionDigits,
  maximumFractionDigits,
  className,
  ...props
}: PriceDisplayProps) {
  const { locale: providerLocale } = useAtomCraft();
  const format = (value: number) =>
    new Intl.NumberFormat(locale ?? providerLocale, {
      style: "currency",
      currency,
      currencyDisplay,
      ...(minimumFractionDigits !== undefined ? { minimumFractionDigits } : {}),
      ...(maximumFractionDigits !== undefined ? { maximumFractionDigits } : {}),
    }).format(value);

  return (
    <span {...props} data-slot="price-display" className={cn("ac-price-display", className)}>
      {previousAmount !== undefined && (
        <del data-slot="price-display-previous" className="ac-price-display__previous">
          <bdi>{format(previousAmount)}</bdi>
        </del>
      )}
      <bdi data-slot="price-display-current" className="ac-price-display__current">
        {format(amount)}
      </bdi>
    </span>
  );
}

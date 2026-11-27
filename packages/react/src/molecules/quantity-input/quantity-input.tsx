import { forwardRef } from "react";
import type { NumberInputProps } from "../number-input";
import { NumberInput } from "../number-input";

export type QuantityInputProps = NumberInputProps;

/** Count control with quantity-friendly defaults; callers may override bounds and step. */
export const QuantityInput = forwardRef<HTMLInputElement, QuantityInputProps>(
  function QuantityInput({ min = 0, step = 1, className, ...props }, ref) {
    return (
      <div data-slot="quantity-input" className={className}>
        <NumberInput {...props} ref={ref} min={min} step={step} />
      </div>
    );
  },
);

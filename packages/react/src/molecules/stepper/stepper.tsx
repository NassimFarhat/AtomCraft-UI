import { cn, dataAttr } from "@atomscraft/core";
import type { HTMLAttributes, ReactNode } from "react";

export type StepperStep = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type StepperProps = Omit<HTMLAttributes<HTMLOListElement>, "children"> & {
  steps: readonly StepperStep[];
  /** One-based active step. Values outside the step list show no active step. */
  currentStep: number;
  label: string;
  orientation?: "horizontal" | "vertical";
};

/** Read-only progress through an ordered workflow; navigation remains app-owned. */
export function Stepper({
  steps,
  currentStep,
  label,
  orientation = "horizontal",
  className,
  ...props
}: StepperProps) {
  return (
    <ol
      {...props}
      aria-label={label}
      data-slot="stepper"
      data-orientation={orientation}
      className={cn("ac-stepper", className)}
    >
      {steps.map((step, index) => {
        const number = index + 1;
        const state =
          number < currentStep ? "complete" : number === currentStep ? "current" : "upcoming";
        return (
          <li
            key={step.id}
            aria-current={state === "current" ? "step" : undefined}
            aria-disabled={step.disabled || undefined}
            data-slot="stepper-item"
            data-state={state}
            className="ac-stepper__item"
          >
            <span
              aria-hidden="true"
              className="ac-stepper__indicator"
              data-disabled={dataAttr(Boolean(step.disabled))}
            >
              {state === "complete" ? "✓" : number}
            </span>
            <span className="ac-stepper__text">
              <span className="ac-stepper__label">{step.label}</span>
              {step.description && (
                <span className="ac-stepper__description">{step.description}</span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

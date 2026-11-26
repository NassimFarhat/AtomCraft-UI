import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { FieldsetHTMLAttributes, FormHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  /** Space between fields. */
  gap?: "3" | "4" | "5" | "6";
  /** `grid` lays fields out in two columns from the medium breakpoint up. */
  layout?: "stack" | "grid";
};

/**
 * Layout and rhythm for a set of fields.
 *
 * Native validation is off by default (`noValidate`): the browser's own bubbles
 * are not styleable and vanish on blur, so errors belong in Field and ErrorSummary.
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { gap = "5", layout = "stack", noValidate = true, className, ...props },
  ref,
) {
  return (
    <form
      {...props}
      ref={ref}
      noValidate={noValidate}
      data-slot="form"
      data-gap={gap}
      data-layout={layout}
      className={cn("ac-form", className)}
    />
  );
});

export type FormSectionProps = FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  /** Legend of the group. Give one whenever the fields belong together. */
  title: ReactNode;
  description?: ReactNode;
  /** Spans both columns in a `grid` form. */
  full?: boolean;
};

/** A titled group of fields, as a fieldset with a legend. */
export const FormSection = forwardRef<HTMLFieldSetElement, FormSectionProps>(function FormSection(
  { title, description, full = true, className, children, ...props },
  ref,
) {
  return (
    <fieldset
      {...props}
      ref={ref}
      data-slot="form-section"
      data-full={full ? "" : undefined}
      className={cn("ac-form__section", className)}
    >
      <legend className="ac-form__legend">{title}</legend>
      {description && <p className="ac-form__section-description">{description}</p>}
      <div className="ac-form__fields">{children}</div>
    </fieldset>
  );
});

export type FormActionsProps = HTMLAttributes<HTMLDivElement> & {
  align?: "start" | "end" | "between";
};

/** Row of buttons that submits or abandons the form. */
export function FormActions({ align = "end", className, ...props }: FormActionsProps) {
  return (
    <div
      {...props}
      data-slot="form-actions"
      data-align={align}
      className={cn("ac-form__actions", className)}
    />
  );
}

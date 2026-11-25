import { cn, dataAttr } from "@atomcraft/core";
import { useId } from "react";
import type { ReactElement, ReactNode } from "react";
import { Label } from "../../atoms/label";
import { IconCircleAlert } from "../../icons";
import { Slot } from "../../utils";

export type FieldProps = {
  label: ReactNode;
  /** A single control (Input, Select, Checkbox, InputGroup...). It receives the id and ARIA wiring. */
  children: ReactElement<{ id?: string }>;
  description?: ReactNode;
  /** Error message. When set, the control is marked invalid and described by it. */
  error?: ReactNode;
  required?: boolean;
  /** Text next to the label, such as "Optional". */
  hint?: ReactNode;
  /** `inline` puts the control before the label: checkboxes, radios and switches. */
  layout?: "stack" | "inline";
  className?: string;
};

function useFieldIds(childId: string | undefined, hasDescription: boolean, hasError: boolean) {
  const baseId = useId();
  return {
    controlId: childId ?? `${baseId}-control`,
    descriptionId: hasDescription ? `${baseId}-description` : undefined,
    errorId: hasError ? `${baseId}-error` : undefined,
  };
}

/** Connects a label, a help text and an error message to one control, accessibly. */
export function Field({
  label,
  children,
  description,
  error,
  required = false,
  hint,
  layout = "stack",
  className,
}: FieldProps) {
  const isInvalid = Boolean(error);
  const ids = useFieldIds(children.props.id, Boolean(description), isInvalid);
  const control = (
    <Slot
      id={ids.controlId}
      aria-describedby={cn(ids.descriptionId, ids.errorId) || undefined}
      aria-invalid={isInvalid || undefined}
      aria-required={required || undefined}
    >
      {children}
    </Slot>
  );

  return (
    <div
      data-slot="field"
      data-layout={layout}
      data-invalid={dataAttr(isInvalid)}
      className={cn("ac-field", className)}
    >
      {layout === "inline" && control}
      <div className="ac-field__text">
        <Label htmlFor={ids.controlId} required={required} hint={hint}>
          {label}
        </Label>
        {layout === "stack" && control}
        <FieldMessages
          description={description}
          descriptionId={ids.descriptionId}
          error={error}
          errorId={ids.errorId}
        />
      </div>
    </div>
  );
}

type FieldMessagesProps = {
  description: ReactNode;
  descriptionId: string | undefined;
  error: ReactNode;
  errorId: string | undefined;
};

function FieldMessages({ description, descriptionId, error, errorId }: FieldMessagesProps) {
  return (
    <>
      {description && (
        <p id={descriptionId} data-slot="field-description" className="ac-field__description">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} data-slot="field-error" className="ac-field__error">
          <IconCircleAlert size="sm" />
          {error}
        </p>
      )}
    </>
  );
}

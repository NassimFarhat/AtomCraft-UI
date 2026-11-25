import { cn } from "@atomcraft/core";
import { useEffect, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { IconCircleAlert } from "../../icons";
import { formatMessage, pluralize, useAtomCraft } from "../../provider";

export type FieldError = {
  /** `id` of the invalid control, so the summary can send focus to it. */
  fieldId: string;
  /** Label of the field, used as the link text. */
  label: string;
  message: string;
};

export type ErrorSummaryProps = {
  errors: readonly FieldError[];
  title?: ReactNode;
  /** Takes focus when errors appear, so screen readers reach them. */
  autoFocus?: boolean;
  className?: string;
};

/**
 * Lists the errors of a submitted form and links to each field.
 *
 * WCAG 3.3.1 asks for errors to be identified in text: this is the summary a
 * keyboard or screen-reader user lands on after a failed submit.
 */
export function ErrorSummary({ errors, title, autoFocus = true, className }: ErrorSummaryProps) {
  const { messages, locale } = useAtomCraft();
  const ref = useRef<HTMLDivElement>(null);
  const count = errors.length;

  useEffect(() => {
    if (count > 0 && autoFocus) ref.current?.focus();
  }, [count, autoFocus]);

  if (count === 0) return null;

  const heading =
    title ??
    formatMessage(
      pluralize(locale, count, { one: messages.errorSummary, other: messages.errorSummaryPlural }),
      { count },
    );

  const focusField = (event: MouseEvent<HTMLAnchorElement>, fieldId: string) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    event.preventDefault();
    field.focus();
    field.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      data-slot="error-summary"
      className={cn("ac-error-summary", className)}
    >
      <p className="ac-error-summary__title">
        <IconCircleAlert size="sm" />
        {heading}
      </p>
      <ul className="ac-error-summary__list">
        {errors.map((error) => (
          <li key={error.fieldId}>
            <a href={`#${error.fieldId}`} onClick={(event) => focusField(event, error.fieldId)}>
              {error.label}: {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

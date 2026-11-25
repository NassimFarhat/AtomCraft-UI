import { cn, fromIsoDate, toIsoDate } from "@atomcraft/core";
import { useEffect, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { IconButton } from "../../atoms/button";
import { isInvalid } from "../../atoms/input";
import { useControllableState, useFloatingLayer } from "../../hooks";
import type { FloatingLayer } from "../../hooks";
import { IconCalendar } from "../../icons";
import { formatMessage, useAtomCraft } from "../../provider";
import type { ControlSize } from "../../types";
import { Portal, controlAttributes, elementRef } from "../../utils";
import { Calendar } from "../calendar";

/** The accepted text format, which is also the placeholder. */
const ISO_HINT = "2026-12-31";
const DAY_SELECTOR = '[data-slot="calendar-day"][tabindex="0"]';

export type DatePickerProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | "id"
  | "name"
  | "required"
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
  | "aria-invalid"
> & {
  value?: Date | null | undefined;
  defaultValue?: Date | null;
  onValueChange?: ((date: Date | null) => void) | undefined;
  min?: Date | undefined;
  max?: Date | undefined;
  isDateDisabled?: ((date: Date) => boolean) | undefined;
  size?: ControlSize;
  invalid?: boolean;
  disabled?: boolean;
  /** Describes the accepted text format under the field. */
  showFormatHint?: boolean;
  className?: string;
};

type PopupProps = {
  layer: FloatingLayer;
  value: Date | null;
  min: Date | undefined;
  max: Date | undefined;
  isDateDisabled: ((date: Date) => boolean) | undefined;
  onSelect: (date: Date) => void;
};

/** The calendar in its own dialog layer, with focus moved onto the focused day. */
function DatePickerPopup({ layer, value, onSelect, ...limits }: PopupProps) {
  const { messages } = useAtomCraft();

  useEffect(() => {
    if (!layer.isOpen) return;
    layer.contentRef.current?.querySelector<HTMLElement>(DAY_SELECTOR)?.focus();
  }, [layer.isOpen, layer.contentRef]);

  if (!layer.isOpen) return null;
  return (
    <Portal>
      <div
        ref={elementRef<HTMLDivElement>(layer.contentRef)}
        id={layer.contentId}
        role="dialog"
        aria-label={messages.calendar}
        data-slot="date-picker-popup"
        className="ac-date-picker__popup"
        style={layer.position.style}
      >
        <Calendar
          value={value}
          min={limits.min}
          max={limits.max}
          isDateDisabled={limits.isDateDisabled}
          onValueChange={onSelect}
        />
      </div>
    </Portal>
  );
}

type ControlProps = {
  layer: FloatingLayer;
  text: string;
  onTextChange: (text: string) => void;
  disabled: boolean | undefined;
  invalid: boolean;
  describedBy: string | undefined;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  /** Shows the accepted format under the field. */
  showFormatHint: boolean;
  hintId: string;
};

/** The text field and the button that opens the calendar. */
function DatePickerControl({ layer, text, onTextChange, ...props }: ControlProps) {
  const { messages } = useAtomCraft();
  return (
    <>
      <div className="ac-date-picker__control">
        <input
          {...props.inputProps}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={text}
          placeholder={ISO_HINT}
          disabled={props.disabled}
          aria-invalid={props.invalid || undefined}
          aria-describedby={props.describedBy}
          className="ac-date-picker__input"
          onChange={(event) => onTextChange(event.target.value)}
        />
        <IconButton
          ref={elementRef<HTMLButtonElement>(layer.triggerRef)}
          label={messages.openCalendar}
          variant="ghost"
          size="sm"
          disabled={props.disabled}
          aria-haspopup="dialog"
          aria-expanded={layer.isOpen}
          aria-controls={layer.isOpen ? layer.contentId : undefined}
          onClick={() => layer.setOpen(!layer.isOpen)}
        >
          <IconCalendar />
        </IconButton>
      </div>
      {props.showFormatHint && (
        <p id={props.hintId} className="ac-date-picker__hint">
          {formatMessage(messages.dateFormatHint, { format: ISO_HINT })}
        </p>
      )}
    </>
  );
}

type ValueOptions = {
  value: Date | null | undefined;
  defaultValue: Date | null;
  onValueChange: ((date: Date | null) => void) | undefined;
  onPicked: () => void;
};

/**
 * The selected date and the text being typed.
 *
 * The field normally shows the selection; the draft exists only while the text
 * is not a date yet, so a half-typed "2026-1" is never thrown away.
 */
function useDatePickerValue({ onPicked, ...options }: ValueOptions) {
  const [selected, setSelected] = useControllableState<Date | null>({
    value: options.value,
    defaultValue: options.defaultValue,
    onChange: options.onValueChange,
  });
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (next: string) => {
    const parsed = fromIsoDate(next);
    const isComplete = parsed !== null || next.trim() === "";
    setDraft(isComplete ? null : next);
    if (isComplete) setSelected(parsed);
  };

  const choose = (date: Date) => {
    setSelected(date);
    setDraft(null);
    onPicked();
  };

  return { selected, text: draft ?? (selected ? toIsoDate(selected) : ""), commit, choose };
}

/**
 * Text field plus calendar popup. The text format is ISO `yyyy-mm-dd`, like
 * `<input type="date">`, so a typed date is unambiguous in every locale.
 */
export function DatePicker({
  value,
  defaultValue = null,
  onValueChange,
  size,
  invalid = false,
  disabled,
  showFormatHint = false,
  className,
  "aria-invalid": ariaInvalid,
  "aria-describedby": describedBy,
  ...rest
}: DatePickerProps) {
  const { min, max, isDateDisabled, ...inputProps } = rest;
  const layer = useFloatingLayer({ align: "start" });
  const date = useDatePickerValue({
    value,
    defaultValue,
    onValueChange,
    onPicked: layer.close,
  });
  const hasError = isInvalid(invalid, ariaInvalid);
  const hintId = `${layer.contentId}-hint`;

  return (
    <div
      {...controlAttributes({
        slot: "date-picker",
        base: "ac-date-picker",
        size,
        invalid: hasError,
        disabled,
        className,
      })}
    >
      <DatePickerControl
        layer={layer}
        text={date.text}
        onTextChange={date.commit}
        disabled={disabled}
        invalid={hasError}
        describedBy={cn(describedBy, showFormatHint ? hintId : undefined) || undefined}
        inputProps={inputProps}
        showFormatHint={showFormatHint}
        hintId={hintId}
      />
      <DatePickerPopup
        layer={layer}
        value={date.selected}
        min={min}
        max={max}
        isDateDisabled={isDateDisabled}
        onSelect={date.choose}
      />
    </div>
  );
}

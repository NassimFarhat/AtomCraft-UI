import { cn } from "@atomcraft/core";
import { useEffect, useId, useRef } from "react";
import { IconButton } from "../../atoms/button";
import { IconChevronLeft, IconChevronRight } from "../../icons";
import { useAtomCraft } from "../../provider";
import { CalendarGrid } from "./calendar-grid";
import { useCalendarLabels, useCalendarState } from "./use-calendar";

export type CalendarProps = {
  value?: Date | null | undefined;
  defaultValue?: Date | null;
  onValueChange?: ((date: Date) => void) | undefined;
  /** Visible month. Controlled when set. */
  month?: Date | undefined;
  defaultMonth?: Date;
  onMonthChange?: ((month: Date) => void) | undefined;
  min?: Date | undefined;
  max?: Date | undefined;
  /** Blocks individual days, e.g. weekends or booked dates. */
  isDateDisabled?: ((date: Date) => boolean) | undefined;
  /** 0 for Sunday, 1 for Monday. Defaults to the locale's first day. */
  weekStartsOn?: number | undefined;
  showOutsideDays?: boolean;
  /** Accessible name of the calendar. */
  label?: string | undefined;
  className?: string;
};

const DAY_SELECTOR = '[data-slot="calendar-day"][tabindex="0"]';

type HeaderProps = {
  titleId: string;
  title: string;
  onPrevious: () => void;
  onNext: () => void;
};

function CalendarHeader({ titleId, title, onPrevious, onNext }: HeaderProps) {
  const { messages } = useAtomCraft();
  return (
    <div className="ac-calendar__header">
      <IconButton label={messages.previousMonth} variant="ghost" size="sm" onClick={onPrevious}>
        <IconChevronLeft />
      </IconButton>
      <div id={titleId} className="ac-calendar__title" aria-live="polite">
        {title}
      </div>
      <IconButton label={messages.nextMonth} variant="ghost" size="sm" onClick={onNext}>
        <IconChevronRight />
      </IconButton>
    </div>
  );
}

/** Month view with APG keyboard support: arrows move by day, Page keys by month. */
export function Calendar({
  showOutsideDays = true,
  label,
  className,
  defaultValue = null,
  ...options
}: CalendarProps) {
  const { locale, messages } = useAtomCraft();
  const labels = useCalendarLabels(locale);
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const calendar = useCalendarState({
    value: options.value,
    defaultValue,
    onValueChange: options.onValueChange,
    month: options.month,
    defaultMonth: options.defaultMonth,
    onMonthChange: options.onMonthChange,
    min: options.min,
    max: options.max,
    isDateDisabled: options.isDateDisabled,
    weekStartsOn: options.weekStartsOn,
  });

  useEffect(() => {
    if (!calendar.focus.navigating) return;
    rootRef.current?.querySelector<HTMLElement>(DAY_SELECTOR)?.focus();
  }, [calendar.focus.navigating, calendar.focus.focused]);

  return (
    <div
      ref={rootRef}
      data-slot="calendar"
      role="group"
      aria-label={label ?? messages.calendar}
      className={cn("ac-calendar", className)}
    >
      <CalendarHeader
        titleId={titleId}
        title={labels.month.format(calendar.month)}
        onPrevious={() => calendar.goToMonth(-1)}
        onNext={() => calendar.goToMonth(1)}
      />
      <CalendarGrid
        month={calendar.month}
        focused={calendar.focus.focused}
        selected={calendar.selected ? [calendar.selected] : []}
        today={calendar.today}
        weekStartsOn={calendar.weekStartsOn}
        locale={locale}
        labelledBy={titleId}
        showOutsideDays={showOutsideDays}
        isDisabled={calendar.isDisabled}
        isInRange={() => false}
        onSelect={calendar.select}
        onKeyDown={calendar.focus.handleKeyDown}
      />
    </div>
  );
}

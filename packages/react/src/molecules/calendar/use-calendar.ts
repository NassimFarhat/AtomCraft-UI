import {
  addDays,
  addMonths,
  addYears,
  endOfWeek,
  getWeekStart,
  isSameMonth,
  startOfDay,
  startOfWeek,
} from "@atomscraft/core";
import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { useControllableState } from "../../hooks";
import { useAtomCraft } from "../../provider";

export type CalendarKeyOptions = {
  weekStartsOn: number;
  dir: "ltr" | "rtl";
};

/** One move per key, as the APG date picker grid defines them. */
const MOVES: Readonly<
  Record<string, (date: Date, event: { shiftKey: boolean }, options: CalendarKeyOptions) => Date>
> = {
  ArrowLeft: (date, _event, { dir }) => addDays(date, dir === "rtl" ? 1 : -1),
  ArrowRight: (date, _event, { dir }) => addDays(date, dir === "rtl" ? -1 : 1),
  ArrowUp: (date) => addDays(date, -7),
  ArrowDown: (date) => addDays(date, 7),
  Home: (date, _event, { weekStartsOn }) => startOfWeek(date, weekStartsOn),
  End: (date, _event, { weekStartsOn }) => endOfWeek(date, weekStartsOn),
  PageUp: (date, event) => (event.shiftKey ? addYears(date, -1) : addMonths(date, -1)),
  PageDown: (date, event) => (event.shiftKey ? addYears(date, 1) : addMonths(date, 1)),
};

/** Date to focus after a key press, or undefined when the key does not move. */
export function nextFocusedDate(
  date: Date,
  event: { key: string; shiftKey: boolean },
  options: CalendarKeyOptions,
): Date | undefined {
  return MOVES[event.key]?.(date, event, options);
}

type CalendarFocusOptions = CalendarKeyOptions & {
  initial: Date;
  onMonthChange: (month: Date) => void;
};

/** Roving focus over the day grid: one tabbable day, arrows move it. */
export function useCalendarFocus({ initial, onMonthChange, ...keyOptions }: CalendarFocusOptions) {
  const [focused, setFocused] = useState(() => startOfDay(initial));
  /** True once the user moved with the keyboard, so the grid may take focus. */
  const [navigating, setNavigating] = useState(false);

  const moveTo = (date: Date) => {
    setFocused(date);
    setNavigating(true);
    onMonthChange(date);
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    const next = nextFocusedDate(focused, event, keyOptions);
    if (!next) return;
    event.preventDefault();
    moveTo(next);
  };

  return { focused, setFocused, navigating, setNavigating, moveTo, handleKeyDown };
}

/** The locale's own month, weekday and day names, built once per locale. */
export function useCalendarLabels(locale: string) {
  return useMemo(
    () => ({
      month: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
      weekdayShort: new Intl.DateTimeFormat(locale, { weekday: "short" }),
      weekdayLong: new Intl.DateTimeFormat(locale, { weekday: "long" }),
      day: new Intl.DateTimeFormat(locale, { day: "numeric" }),
      full: new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
    }),
    [locale],
  );
}

const firstOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

export type CalendarStateOptions = {
  value: Date | null | undefined;
  defaultValue: Date | null;
  onValueChange: ((date: Date) => void) | undefined;
  month: Date | undefined;
  defaultMonth: Date | undefined;
  onMonthChange: ((month: Date) => void) | undefined;
  min: Date | undefined;
  max: Date | undefined;
  isDateDisabled: ((date: Date) => boolean) | undefined;
  weekStartsOn: number | undefined;
};

/** Selection, visible month, roving focus and the disabled rule of a Calendar. */
export function useCalendarState(options: CalendarStateOptions) {
  const { locale, dir } = useAtomCraft();
  const today = startOfDay(new Date());
  const weekStartsOn = options.weekStartsOn ?? getWeekStart(locale);

  const [selected, setSelected] = useControllableState<Date | null>({
    value: options.value,
    defaultValue: options.defaultValue,
    onChange: options.onValueChange as ((date: Date | null) => void) | undefined,
  });
  const [month, setMonth] = useControllableState({
    value: options.month,
    defaultValue: firstOfMonth(options.defaultMonth ?? selected ?? today),
    onChange: options.onMonthChange,
  });
  const focus = useCalendarFocus({
    initial: selected ?? today,
    weekStartsOn,
    dir,
    onMonthChange: (date) => {
      if (!isSameMonth(date, month)) setMonth(firstOfMonth(date));
    },
  });

  const isDisabled = (date: Date): boolean =>
    (options.min !== undefined && startOfDay(date) < startOfDay(options.min)) ||
    (options.max !== undefined && startOfDay(date) > startOfDay(options.max)) ||
    (options.isDateDisabled?.(date) ?? false);

  /** Moves the view by whole months, keeping the focused day inside it. */
  const goToMonth = (amount: number) => {
    const next = addMonths(month, amount);
    setMonth(next);
    focus.setFocused(next);
    focus.setNavigating(false);
  };

  const select = (date: Date) => {
    setSelected(date);
    focus.moveTo(date);
  };

  return { today, weekStartsOn, selected, month, focus, isDisabled, goToMonth, select };
}

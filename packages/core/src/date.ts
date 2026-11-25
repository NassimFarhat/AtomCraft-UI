/** Calendar arithmetic on plain `Date` objects, in local time and free of any library. */

export type DateRange = { start: Date | null; end: Date | null };

/** Midnight of the given day: the canonical form of a calendar date. */
export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const isSameDay = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const isSameMonth = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth();

export const addDays = (date: Date, amount: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

/** Adds months, keeping the day inside the target month (31 Jan + 1 month = 28/29 Feb). */
export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

export const addYears = (date: Date, amount: number): Date => addMonths(date, amount * 12);

export function clampDate(date: Date, min?: Date | undefined, max?: Date | undefined): Date {
  if (min && date < min) return min;
  if (max && date > max) return max;
  return date;
}

/** Midnight of the first day of the week containing `date`. */
export function startOfWeek(date: Date, weekStartsOn = 1): Date {
  const offset = (date.getDay() - weekStartsOn + 7) % 7;
  return addDays(startOfDay(date), -offset);
}

export const endOfWeek = (date: Date, weekStartsOn = 1): Date =>
  addDays(startOfWeek(date, weekStartsOn), 6);

export type DayCell = {
  date: Date;
  /** False for the leading and trailing days that pad the first and last week. */
  inMonth: boolean;
};

/**
 * The six weeks shown by a month view, always 42 days, so the grid never
 * changes height between months.
 * @param weekStartsOn 0 for Sunday, 1 for Monday, as `Date.getDay()` numbers them.
 */
export function getMonthGrid(month: Date, weekStartsOn = 1): DayCell[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index);
    return { date, inMonth: isSameMonth(date, month) };
  });
}

/** Splits a flat day list into weeks of seven. */
export const toWeeks = <T>(days: readonly T[]): T[][] =>
  Array.from({ length: Math.ceil(days.length / 7) }, (_, week) =>
    days.slice(week * 7, week * 7 + 7),
  );

/** Weekday numbers in display order, e.g. [1,2,3,4,5,6,0] for a Monday-first week. */
export const getWeekdays = (weekStartsOn = 1): number[] =>
  Array.from({ length: 7 }, (_, index) => (weekStartsOn + index) % 7);

/** `Intl.Locale.getWeekInfo` is not in every runtime, nor in the TypeScript lib yet. */
type LocaleWithWeekInfo = Intl.Locale & { getWeekInfo?: () => { firstDay: number } };

/**
 * First day of the week in this locale, as a `Date.getDay()` number.
 * Falls back to Monday where the runtime has no week data.
 */
export function getWeekStart(locale: string): number {
  const firstDay = (new Intl.Locale(locale) as LocaleWithWeekInfo).getWeekInfo?.().firstDay;
  return firstDay === undefined ? 1 : firstDay % 7;
}

/** ISO `yyyy-mm-dd`, which is also the value format of `<input type="date">`. */
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Parses `yyyy-mm-dd` as a local date. Returns null for anything else. */
export function fromIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const isReal = date.getMonth() === Number(month) - 1 && date.getDate() === Number(day);
  return isReal ? date : null;
}

export const isDateInRange = (date: Date, { start, end }: DateRange): boolean =>
  start !== null &&
  end !== null &&
  startOfDay(date) >= startOfDay(start) &&
  startOfDay(date) <= startOfDay(end);

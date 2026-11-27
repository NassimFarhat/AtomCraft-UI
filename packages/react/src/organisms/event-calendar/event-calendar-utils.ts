import { addDays, getMonthGrid, startOfDay, startOfWeek, toWeeks } from "@atomscraft/core";
import type { CalendarEvent, EventCalendarRange, EventCalendarView } from "./types";

export type EventCalendarLabels = {
  month: Intl.DateTimeFormat;
  day: Intl.DateTimeFormat;
  weekdayShort: Intl.DateTimeFormat;
  weekdayLong: Intl.DateTimeFormat;
  fullDate: Intl.DateTimeFormat;
  time: Intl.DateTimeFormat;
};

export function createEventCalendarLabels(locale: string): EventCalendarLabels {
  return {
    month: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    day: new Intl.DateTimeFormat(locale, { day: "numeric" }),
    weekdayShort: new Intl.DateTimeFormat(locale, { weekday: "short" }),
    weekdayLong: new Intl.DateTimeFormat(locale, { weekday: "long" }),
    fullDate: new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
    time: new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }),
  };
}

export function getEventCalendarRange(
  date: Date,
  view: EventCalendarView,
  weekStartsOn: number,
): EventCalendarRange {
  if (view === "month") {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const start = startOfWeek(first, weekStartsOn);
    return { start, end: addDays(start, 42) };
  }
  if (view === "day") {
    const start = startOfDay(date);
    return { start, end: addDays(start, 1) };
  }
  const start = startOfWeek(date, weekStartsOn);
  return { start, end: addDays(start, 7) };
}

export function getVisibleDates(date: Date, view: EventCalendarView, weekStartsOn: number): Date[] {
  if (view === "day") return [startOfDay(date)];
  if (view === "month")
    return toWeeks(getMonthGrid(date, weekStartsOn))
      .flat()
      .map((cell) => cell.date);
  const start = startOfWeek(date, weekStartsOn);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function weekdayDate(weekday: number): Date {
  // 1 January 2023 was a Sunday; this gives a stable sample for weekday labels.
  return new Date(2023, 0, 1 + weekday);
}

export function eventEnd(event: CalendarEvent): Date {
  if (event.end && event.end > event.start) return event.end;
  if (event.allDay) return addDays(startOfDay(event.start), 1);
  return new Date(event.start.getTime() + 30 * 60 * 1000);
}

export function eventOccursOn(event: CalendarEvent, date: Date): boolean {
  const dayStart = startOfDay(date);
  const dayEnd = addDays(dayStart, 1);
  return event.start < dayEnd && eventEnd(event) > dayStart;
}

export function eventsOnDate(events: readonly CalendarEvent[], date: Date): CalendarEvent[] {
  return events
    .filter((event) => eventOccursOn(event, date))
    .sort((first, second) => first.start.getTime() - second.start.getTime());
}

export function eventTimeLabel(
  event: CalendarEvent,
  date: Date,
  labels: EventCalendarLabels,
): string {
  if (event.allDay) return "";
  const dayStart = startOfDay(date);
  const start = event.start < dayStart ? dayStart : event.start;
  const eventEndDate = eventEnd(event);
  const end = eventEndDate > addDays(dayStart, 1) ? addDays(dayStart, 1) : eventEndDate;
  return `${labels.time.format(start)} – ${labels.time.format(end)}`;
}

export function eventStartTimeLabel(
  event: CalendarEvent,
  date: Date,
  labels: EventCalendarLabels,
): string {
  if (event.allDay) return "";
  const dayStart = startOfDay(date);
  const start = event.start < dayStart ? dayStart : event.start;
  return labels.time.format(start);
}

import type { Tone } from "../../types";

export type EventCalendarView = "month" | "week" | "day" | "agenda";

export type CalendarEvent = {
  id: string;
  title: string;
  /** Start of the event. Event intervals include this instant and exclude `end`. */
  start: Date;
  /** All-day dates should use local midnight; timed events use their actual end instant. */
  end?: Date;
  allDay?: boolean;
  tone?: Tone;
  description?: string;
};

/** Visible date interval. `end` is exclusive. */
export type EventCalendarRange = { start: Date; end: Date };

export type EventCalendarProps = {
  events: readonly CalendarEvent[];
  date?: Date | undefined;
  defaultDate?: Date;
  onDateChange?: ((date: Date) => void) | undefined;
  view?: EventCalendarView | undefined;
  defaultView?: EventCalendarView;
  onViewChange?: ((view: EventCalendarView) => void) | undefined;
  onDateSelect?: ((date: Date) => void) | undefined;
  onEventSelect?: ((event: CalendarEvent) => void) | undefined;
  onRangeChange?: ((range: EventCalendarRange) => void) | undefined;
  views?: readonly EventCalendarView[];
  weekStartsOn?: number | undefined;
  dayStartHour?: number;
  dayEndHour?: number;
  slotDuration?: number;
  maxEventsPerDay?: number;
  label?: string;
  className?: string;
};

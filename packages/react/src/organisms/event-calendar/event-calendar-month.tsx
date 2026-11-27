import {
  addDays,
  addMonths,
  getMonthGrid,
  getWeekdays,
  toIsoDate,
  toWeeks,
} from "@atomscraft/core";
import type { KeyboardEvent } from "react";
import { Button } from "../../atoms/button";
import { EventCalendarEvent } from "./event-calendar-event";
import { eventsOnDate, weekdayDate } from "./event-calendar-utils";
import type { EventCalendarLabels } from "./event-calendar-utils";
import type { CalendarEvent } from "./types";

type Direction = "ltr" | "rtl";

function moveCalendarDate(
  date: Date,
  key: string,
  dir: Direction,
  weekStartsOn: number,
  shiftKey: boolean,
): Date | undefined {
  const offset = (date.getDay() - weekStartsOn + 7) % 7;
  const horizontal = dir === "rtl" ? 1 : -1;
  const dayMovement: Record<string, number> = {
    ArrowDown: 7,
    ArrowUp: -7,
    ArrowLeft: horizontal,
    ArrowRight: -horizontal,
  };
  if (key in dayMovement) return addDays(date, dayMovement[key] ?? 0);
  if (key === "Home") return addDays(date, -offset);
  if (key === "End") return addDays(date, 6 - offset);
  if (key === "PageUp" || key === "PageDown") {
    const direction = key === "PageUp" ? -1 : 1;
    return addMonths(date, direction * (shiftKey ? 12 : 1));
  }
  return undefined;
}

function handleDateKeyDown(
  event: KeyboardEvent<HTMLButtonElement>,
  date: Date,
  dir: Direction,
  weekStartsOn: number,
  onDateSelect: (date: Date) => void,
) {
  const nextDate = moveCalendarDate(date, event.key, dir, weekStartsOn, event.shiftKey);
  if (!nextDate) return;
  event.preventDefault();
  const table = event.currentTarget.closest("table");
  const dateKey = toIsoDate(nextDate);
  onDateSelect(nextDate);
  requestAnimationFrame(() =>
    table?.querySelector<HTMLButtonElement>(`[data-calendar-date="${dateKey}"]`)?.focus(),
  );
}

type MonthDateButtonProps = {
  date: Date;
  currentDate: Date;
  dir: Direction;
  weekStartsOn: number;
  labels: EventCalendarLabels;
  today: Date;
  onDateSelect: (date: Date) => void;
};

function MonthDateButton({
  date,
  currentDate,
  dir,
  weekStartsOn,
  labels,
  today,
  onDateSelect,
}: MonthDateButtonProps) {
  const isToday = date.toDateString() === today.toDateString();
  const isCurrentDate = toIsoDate(date) === toIsoDate(currentDate);
  return (
    <Button
      variant={isToday ? "soft" : "ghost"}
      tone={isToday ? "primary" : "neutral"}
      size="xs"
      className="ac-event-calendar__date"
      aria-current={isToday ? "date" : undefined}
      aria-label={labels.fullDate.format(date)}
      data-calendar-date={toIsoDate(date)}
      tabIndex={isCurrentDate ? 0 : -1}
      onKeyDown={(event) => handleDateKeyDown(event, date, dir, weekStartsOn, onDateSelect)}
      onClick={() => onDateSelect(date)}
    >
      {labels.day.format(date)}
    </Button>
  );
}

type MonthEventsProps = {
  date: Date;
  events: readonly CalendarEvent[];
  labels: EventCalendarLabels;
  maxEventsPerDay: number;
  moreLabel: (count: number) => string;
  onEventSelect: (event: CalendarEvent) => void;
  onShowMore: (date: Date) => void;
};

function MonthEvents({
  date,
  events,
  labels,
  maxEventsPerDay,
  moreLabel,
  onEventSelect,
  onShowMore,
}: MonthEventsProps) {
  const dayEvents = eventsOnDate(events, date);
  const shownEvents = dayEvents.slice(0, maxEventsPerDay);
  const hiddenCount = dayEvents.length - shownEvents.length;
  return (
    <div className="ac-event-calendar__month-events">
      {shownEvents.map((event) => (
        <EventCalendarEvent
          key={event.id}
          event={event}
          date={date}
          labels={labels}
          compact
          onSelect={onEventSelect}
        />
      ))}
      {hiddenCount > 0 && (
        <button
          type="button"
          className="ac-event-calendar__more"
          aria-label={moreLabel(hiddenCount)}
          onClick={() => onShowMore(date)}
        >
          {moreLabel(hiddenCount)}
        </button>
      )}
    </div>
  );
}

type MonthCellProps = MonthDateButtonProps & MonthEventsProps & { inMonth: boolean };

function EventCalendarMonthCell({ inMonth, ...props }: MonthCellProps) {
  return (
    <td
      className="ac-event-calendar__month-cell"
      data-outside={!inMonth || undefined}
      data-today={props.date.toDateString() === props.today.toDateString() || undefined}
    >
      <MonthDateButton {...props} />
      <MonthEvents {...props} />
    </td>
  );
}

type EventCalendarMonthProps = {
  date: Date;
  dir: Direction;
  events: readonly CalendarEvent[];
  labels: EventCalendarLabels;
  weekStartsOn: number;
  maxEventsPerDay: number;
  today: Date;
  moreLabel: (count: number) => string;
  onDateSelect: (date: Date) => void;
  onEventSelect: (event: CalendarEvent) => void;
  onShowMore: (date: Date) => void;
};

export function EventCalendarMonth(props: EventCalendarMonthProps) {
  const weeks = toWeeks(getMonthGrid(props.date, props.weekStartsOn));
  const weekdays = getWeekdays(props.weekStartsOn);
  return (
    <div className="ac-event-calendar__month-scroll">
      <table
        className="ac-event-calendar__month"
        aria-label={props.labels.month.format(props.date)}
      >
        <thead>
          <tr>
            {weekdays.map((weekday) => {
              const sample = weekdayDate(weekday);
              return (
                <th key={weekday} scope="col" abbr={props.labels.weekdayLong.format(sample)}>
                  {props.labels.weekdayShort.format(sample)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={toIsoDate(week[0]?.date ?? props.date)}>
              {week.map(({ date, inMonth }) => (
                <EventCalendarMonthCell
                  key={toIsoDate(date)}
                  date={date}
                  currentDate={props.date}
                  dir={props.dir}
                  weekStartsOn={props.weekStartsOn}
                  inMonth={inMonth}
                  events={props.events}
                  labels={props.labels}
                  today={props.today}
                  maxEventsPerDay={props.maxEventsPerDay}
                  moreLabel={props.moreLabel}
                  onDateSelect={props.onDateSelect}
                  onEventSelect={props.onEventSelect}
                  onShowMore={props.onShowMore}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

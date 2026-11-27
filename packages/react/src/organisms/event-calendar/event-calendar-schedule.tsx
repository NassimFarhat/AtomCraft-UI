import { startOfDay, toIsoDate } from "@atomscraft/core";
import type { CSSProperties } from "react";
import { EventCalendarEvent } from "./event-calendar-event";
import { eventEnd, eventsOnDate } from "./event-calendar-utils";
import type { EventCalendarLabels } from "./event-calendar-utils";
import type { CalendarEvent, EventCalendarView } from "./types";

type EventCalendarScheduleProps = {
  view: Extract<EventCalendarView, "week" | "day">;
  dates: readonly Date[];
  events: readonly CalendarEvent[];
  labels: EventCalendarLabels;
  timeLabel: string;
  allDayLabel: string;
  startHour: number;
  endHour: number;
  slotDuration: number;
  today: Date;
  onDateSelect: (date: Date) => void;
  onEventSelect: (event: CalendarEvent) => void;
};

type Placement = { top: number; height: number; lane: number; lanes: number };

function placeEvents(
  events: readonly CalendarEvent[],
  date: Date,
  startHour: number,
  endHour: number,
): Map<string, Placement> {
  const dayStart = startOfDay(date).getTime();
  const rangeStart = dayStart + startHour * 60 * 60 * 1000;
  const rangeEnd = dayStart + endHour * 60 * 60 * 1000;
  const active = events
    .filter(
      (event) =>
        !event.allDay && event.start.getTime() < rangeEnd && eventEnd(event).getTime() > rangeStart,
    )
    .map((event) => ({
      event,
      start: Math.max(event.start.getTime(), rangeStart),
      end: Math.min(eventEnd(event).getTime(), rangeEnd),
    }))
    .sort((first, second) => first.start - second.start || first.end - second.end);
  const rangeDuration = (endHour - startHour) * 60 * 60 * 1000;
  const placements = new Map<string, Placement>();
  let cluster: typeof active = [];
  let clusterEnd = Number.NEGATIVE_INFINITY;

  const placeCluster = () => {
    if (cluster.length === 0) return;
    const laneEnds: number[] = [];
    const assignments = cluster.map((item) => {
      let lane = laneEnds.findIndex((end) => end <= item.start);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = item.end;
      return { ...item, lane };
    });
    const lanes = Math.max(laneEnds.length, 1);
    assignments.forEach(({ event, start, end, lane }) => {
      placements.set(event.id, {
        top: ((start - rangeStart) / rangeDuration) * 100,
        height: Math.max(((end - start) / rangeDuration) * 100, 3),
        lane,
        lanes,
      });
    });
  };

  for (const item of active) {
    if (item.start >= clusterEnd) {
      placeCluster();
      cluster = [];
      clusterEnd = Number.NEGATIVE_INFINITY;
    }
    cluster.push(item);
    clusterEnd = Math.max(clusterEnd, item.end);
  }
  placeCluster();
  return placements;
}

function EventCalendarScheduleHeader({
  dates,
  labels,
  timeLabel,
  today,
  onDateSelect,
}: Pick<EventCalendarScheduleProps, "dates" | "labels" | "timeLabel" | "today" | "onDateSelect">) {
  return (
    <div className="ac-event-calendar__schedule-header">
      <span className="ac-event-calendar__time-heading">{timeLabel}</span>
      {dates.map((date) => {
        const isToday = date.toDateString() === today.toDateString();
        return (
          <button
            key={toIsoDate(date)}
            type="button"
            className="ac-event-calendar__day-heading"
            aria-current={isToday ? "date" : undefined}
            onClick={() => onDateSelect(date)}
          >
            <span>{labels.weekdayShort.format(date)}</span>
            <bdi>{labels.day.format(date)}</bdi>
          </button>
        );
      })}
    </div>
  );
}

function EventCalendarAllDayRow({
  dates,
  events,
  labels,
  allDayLabel,
  onEventSelect,
}: Pick<
  EventCalendarScheduleProps,
  "dates" | "events" | "labels" | "allDayLabel" | "onEventSelect"
>) {
  return (
    <div className="ac-event-calendar__all-day-row">
      <span className="ac-event-calendar__all-day-label">{allDayLabel}</span>
      {dates.map((date) => (
        <div key={toIsoDate(date)} className="ac-event-calendar__all-day-cell">
          {eventsOnDate(events, date)
            .filter((event) => event.allDay)
            .map((event) => (
              <EventCalendarEvent
                key={event.id}
                event={event}
                date={date}
                labels={labels}
                compact
                onSelect={onEventSelect}
              />
            ))}
        </div>
      ))}
    </div>
  );
}

type ScheduleDayColumnProps = {
  date: Date;
  events: readonly CalendarEvent[];
  labels: EventCalendarLabels;
  startHour: number;
  endHour: number;
  today: Date;
  onEventSelect: (event: CalendarEvent) => void;
  bodyStyle: CSSProperties;
};

function ScheduleDayColumn({
  date,
  events,
  labels,
  startHour,
  endHour,
  today,
  onEventSelect,
  bodyStyle,
}: ScheduleDayColumnProps) {
  const placements = placeEvents(events, date, startHour, endHour);
  const dayEvents = eventsOnDate(events, date).filter((event) => !event.allDay);
  return (
    <div
      className="ac-event-calendar__day-column"
      data-today={date.toDateString() === today.toDateString() || undefined}
      style={bodyStyle}
    >
      {dayEvents.map((event) => {
        const placement = placements.get(event.id);
        if (!placement) return null;
        const duration = eventEnd(event).getTime() - event.start.getTime();
        return (
          <EventCalendarEvent
            key={event.id}
            event={event}
            date={date}
            labels={labels}
            placement={placement}
            compact={placement.lanes > 1 || duration < 2 * 60 * 60 * 1000}
            onSelect={onEventSelect}
          />
        );
      })}
    </div>
  );
}

function EventCalendarTimeline(props: EventCalendarScheduleProps) {
  const slotCount = Math.ceil(((props.endHour - props.startHour) * 60) / props.slotDuration);
  const slots = Array.from({ length: slotCount }, (_, index) => {
    const minuteOfDay = props.startHour * 60 + index * props.slotDuration;
    return new Date(2026, 0, 1, Math.floor(minuteOfDay / 60), minuteOfDay % 60);
  });
  const bodyStyle = { blockSize: `${slotCount * (props.slotDuration / 60) * 3}rem` };

  return (
    <div className="ac-event-calendar__timeline">
      <div className="ac-event-calendar__time-axis" style={bodyStyle} aria-hidden="true">
        {slots.map((slot, index) => (
          <span key={index}>{slot.getMinutes() === 0 ? props.labels.time.format(slot) : ""}</span>
        ))}
      </div>
      <div className="ac-event-calendar__day-columns">
        {props.dates.map((date) => (
          <ScheduleDayColumn
            key={toIsoDate(date)}
            date={date}
            events={props.events}
            labels={props.labels}
            startHour={props.startHour}
            endHour={props.endHour}
            today={props.today}
            onEventSelect={props.onEventSelect}
            bodyStyle={bodyStyle}
          />
        ))}
      </div>
    </div>
  );
}

export function EventCalendarSchedule(props: EventCalendarScheduleProps) {
  const slotCount = Math.ceil(((props.endHour - props.startHour) * 60) / props.slotDuration);
  const gridStyle = {
    "--_day-count": props.dates.length,
    "--_slot-count": slotCount,
    "--_slot-height": `${(props.slotDuration / 60) * 3}rem`,
    "--_schedule-min-width": `${4 + props.dates.length * 6}rem`,
  } as CSSProperties;

  return (
    <div className="ac-event-calendar__schedule" data-view={props.view} style={gridStyle}>
      <EventCalendarScheduleHeader {...props} />
      <EventCalendarAllDayRow {...props} />
      <EventCalendarTimeline {...props} />
    </div>
  );
}

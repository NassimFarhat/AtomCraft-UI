import { cn } from "@atomscraft/core";
import type { CSSProperties } from "react";
import { eventStartTimeLabel, eventTimeLabel } from "./event-calendar-utils";
import type { EventCalendarLabels } from "./event-calendar-utils";
import type { CalendarEvent } from "./types";

type Placement = { top: number; height: number; lane: number; lanes: number };

type EventCalendarEventProps = {
  event: CalendarEvent;
  date: Date;
  labels: EventCalendarLabels;
  onSelect: (event: CalendarEvent) => void;
  compact?: boolean;
  placement?: Placement;
};

function eventStyle(placement?: Placement): CSSProperties | undefined {
  if (!placement) return undefined;
  return {
    "--_event-top": `${placement.top}%`,
    "--_event-height": `${placement.height}%`,
    "--_event-left": `${(placement.lane * 100) / placement.lanes}%`,
    "--_event-width": `${100 / placement.lanes}%`,
  } as CSSProperties;
}

function EventCalendarEventContent({
  event,
  compact,
  time,
}: {
  event: CalendarEvent;
  compact: boolean;
  time: string;
}) {
  return (
    <>
      {time && (
        <time className="ac-event-calendar__event-time">
          <bdi>{time}</bdi>
        </time>
      )}
      <span className="ac-event-calendar__event-title">
        <bdi>{event.title}</bdi>
      </span>
      {!compact && event.description && (
        <span className="ac-event-calendar__event-description">
          <bdi>{event.description}</bdi>
        </span>
      )}
    </>
  );
}

export function EventCalendarEvent({
  event,
  date,
  labels,
  onSelect,
  compact = false,
  placement,
}: EventCalendarEventProps) {
  const fullTime = eventTimeLabel(event, date, labels);
  const time = compact ? eventStartTimeLabel(event, date, labels) : fullTime;
  const title = event.description ? `${event.title}: ${event.description}` : event.title;
  const ariaLabel = `${event.title}${event.description ? `, ${event.description}` : ""}, ${labels.fullDate.format(date)}${fullTime ? `, ${fullTime}` : ""}`;

  return (
    <button
      type="button"
      className={cn("ac-event-calendar__event", compact && "ac-event-calendar__event--compact")}
      data-slot="event-calendar-event"
      data-tone={event.tone ?? "primary"}
      data-all-day={event.allDay || undefined}
      style={eventStyle(placement)}
      aria-label={ariaLabel}
      title={title}
      onClick={() => onSelect(event)}
    >
      <EventCalendarEventContent event={event} compact={compact} time={time} />
    </button>
  );
}

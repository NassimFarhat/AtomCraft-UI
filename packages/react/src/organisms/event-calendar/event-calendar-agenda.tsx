import { toIsoDate } from "@atomscraft/core";
import { eventsOnDate } from "./event-calendar-utils";
import type { EventCalendarLabels } from "./event-calendar-utils";
import type { CalendarEvent } from "./types";
import { EventCalendarEvent } from "./event-calendar-event";

type EventCalendarAgendaProps = {
  dates: readonly Date[];
  events: readonly CalendarEvent[];
  labels: EventCalendarLabels;
  emptyLabel: string;
  onEventSelect: (event: CalendarEvent) => void;
};

export function EventCalendarAgenda({
  dates,
  events,
  labels,
  emptyLabel,
  onEventSelect,
}: EventCalendarAgendaProps) {
  const hasEvents = dates.some((date) => eventsOnDate(events, date).length > 0);
  if (!hasEvents) {
    return <p className="ac-event-calendar__empty">{emptyLabel}</p>;
  }

  return (
    <div className="ac-event-calendar__agenda">
      {dates.map((date) => {
        const dayEvents = eventsOnDate(events, date);
        if (dayEvents.length === 0) return null;
        return (
          <section key={toIsoDate(date)} className="ac-event-calendar__agenda-day">
            <h3 className="ac-event-calendar__agenda-date">{labels.fullDate.format(date)}</h3>
            <ul className="ac-event-calendar__agenda-events">
              {dayEvents.map((event) => (
                <li key={event.id}>
                  <EventCalendarEvent
                    event={event}
                    date={date}
                    labels={labels}
                    onSelect={onEventSelect}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

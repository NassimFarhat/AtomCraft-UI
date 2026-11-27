import { EventCalendar } from "./event-calendar";
import type { EventCalendarProps } from "./types";

export type AgendaProps = Omit<EventCalendarProps, "view" | "defaultView" | "views">;

/** Compact agenda-only display built on the shared event calendar. */
export function Agenda(props: AgendaProps) {
  return <EventCalendar {...props} defaultView="agenda" views={["agenda"]} />;
}

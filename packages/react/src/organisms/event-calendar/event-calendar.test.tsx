import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EventCalendar } from "./event-calendar";
import type { CalendarEvent } from "./types";

const anchorDate = new Date(2026, 10, 26);
const events: CalendarEvent[] = [
  {
    id: "review",
    title: "Design review",
    start: new Date(2026, 10, 26, 9),
    end: new Date(2026, 10, 26, 10),
  },
];

describe("EventCalendar", () => {
  it("shows event data and emits the selected event", async () => {
    const onEventSelect = vi.fn();
    render(
      <EventCalendar
        events={events}
        defaultDate={anchorDate}
        defaultView="week"
        onEventSelect={onEventSelect}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /Design review/ }));
    expect(onEventSelect).toHaveBeenCalledWith(events[0]);
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps unrelated events full-width and uses compact labels for short events", () => {
    const scheduledEvents: CalendarEvent[] = [
      {
        id: "first",
        title: "Planning",
        start: new Date(2026, 10, 26, 9),
        end: new Date(2026, 10, 26, 10),
      },
      {
        id: "overlap",
        title: "Review",
        start: new Date(2026, 10, 26, 9, 30),
        end: new Date(2026, 10, 26, 10, 30),
      },
      {
        id: "later",
        title: "Follow-up",
        start: new Date(2026, 10, 26, 11),
        end: new Date(2026, 10, 26, 12),
      },
    ];
    render(
      <EventCalendar
        events={scheduledEvents}
        defaultDate={anchorDate}
        defaultView="day"
        dayStartHour={8}
        dayEndHour={18}
      />,
    );

    const planning = screen.getByRole("button", { name: /Planning/ });
    const review = screen.getByRole("button", { name: /Review/ });
    const followUp = screen.getByRole("button", { name: /Follow-up/ });
    expect(planning).toHaveStyle({ "--_event-width": "50%" });
    expect(review).toHaveStyle({ "--_event-width": "50%" });
    expect(followUp).toHaveStyle({ "--_event-width": "100%" });
    expect(followUp).toHaveClass("ac-event-calendar__event--compact");
    expect(followUp).toHaveTextContent("11:00 AM");
    expect(followUp).not.toHaveTextContent("12:00 PM");
  });

  it("switches views and reports the visible date range", async () => {
    const onRangeChange = vi.fn();
    render(
      <EventCalendar
        events={events}
        defaultDate={anchorDate}
        defaultView="month"
        onRangeChange={onRangeChange}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Week" }));
    expect(
      document.querySelector('.ac-event-calendar__schedule[data-view="week"]'),
    ).toBeInTheDocument();
    const latestRange = onRangeChange.mock.lastCall?.[0];
    expect(latestRange).toBeDefined();
    expect(latestRange && latestRange.end.getTime() - latestRange.start.getTime()).toBe(
      7 * 24 * 60 * 60 * 1000,
    );
  });

  it("announces an empty agenda", () => {
    render(<EventCalendar events={[]} defaultDate={anchorDate} defaultView="agenda" />);
    expect(screen.getByText("No events in this period.")).toBeInTheDocument();
  });

  it("moves the month date focus with the arrow keys", async () => {
    const onDateSelect = vi.fn();
    render(
      <EventCalendar
        events={[]}
        defaultDate={anchorDate}
        defaultView="month"
        onDateSelect={onDateSelect}
      />,
    );
    const focusedDate = screen.getByRole("button", { name: /Thursday, November 26, 2026/ });
    focusedDate.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onDateSelect).toHaveBeenCalledWith(new Date(2026, 10, 27));
  });
});

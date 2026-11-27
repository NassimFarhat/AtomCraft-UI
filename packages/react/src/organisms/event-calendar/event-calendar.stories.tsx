import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { EventCalendar } from "./event-calendar";
import type { CalendarEvent } from "./types";

const weekOf = new Date(2026, 10, 26);

const events: CalendarEvent[] = [
  {
    id: "release-window",
    title: "Release window",
    description: "Final checks and production rollout",
    start: new Date(2026, 10, 25),
    end: new Date(2026, 10, 28),
    allDay: true,
    tone: "info",
  },
  {
    id: "sprint-planning",
    title: "Sprint planning",
    description: "Agree on the goals for the next sprint",
    start: new Date(2026, 10, 23, 9, 30),
    end: new Date(2026, 10, 23, 10, 30),
    tone: "primary",
  },
  {
    id: "design-review",
    title: "Design review",
    description: "Review the updated component examples",
    start: new Date(2026, 10, 24, 10),
    end: new Date(2026, 10, 24, 11, 30),
    tone: "success",
  },
  {
    id: "api-review",
    title: "API review",
    description: "Public component API and package exports",
    start: new Date(2026, 10, 24, 10, 30),
    end: new Date(2026, 10, 24, 12),
    tone: "warning",
  },
  {
    id: "team-sync",
    title: "Team sync",
    start: new Date(2026, 10, 26, 9),
    end: new Date(2026, 10, 26, 9, 45),
    tone: "info",
  },
  {
    id: "accessibility-pass",
    title: "Accessibility pass",
    description: "Keyboard and screen-reader review",
    start: new Date(2026, 10, 26, 11),
    end: new Date(2026, 10, 26, 12, 30),
    tone: "success",
  },
  {
    id: "launch-check",
    title: "Launch checklist",
    start: new Date(2026, 10, 27, 14),
    end: new Date(2026, 10, 27, 15),
    tone: "danger",
  },
  {
    id: "design-workshop",
    title: "Design workshop",
    description: "Tokens, themes and density presets",
    start: new Date(2026, 10, 27, 14, 30),
    end: new Date(2026, 10, 27, 16),
    tone: "primary",
  },
];

const meta = {
  title: "Organisms/EventCalendar",
  component: EventCalendar,
  parameters: {
    docs: {
      description: {
        component:
          "A data-driven event calendar with month, week, day and agenda views. In the Actions panel, onDateChange logs the navigated date, onViewChange logs the selected view, onDateSelect logs a chosen date, onEventSelect logs the selected CalendarEvent, and onRangeChange logs the visible { start, end } interval. Event creation and editing stay with the consuming application. The DatePicker remains a separate form control.",
      },
    },
  },
  args: {
    events,
    defaultDate: weekOf,
    onDateChange: fn(),
    onViewChange: fn(),
    onDateSelect: fn(),
    onEventSelect: fn(),
    onRangeChange: fn(),
  },
} satisfies Meta<typeof EventCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Month: Story = {
  args: { defaultView: "month", maxEventsPerDay: 2 },
};

export const WeekSchedule: Story = {
  args: { defaultView: "week", dayStartHour: 8, dayEndHour: 18, slotDuration: 30 },
};

export const DaySchedule: Story = {
  args: { defaultView: "day", dayStartHour: 8, dayEndHour: 18 },
};

export const Agenda: Story = {
  args: { defaultView: "agenda" },
};

export const EmptyAgenda: Story = {
  args: { events: [], defaultView: "agenda" },
};

import { addDays, addMonths, cn, getWeekStart, startOfDay, toIsoDate } from "@atomscraft/core";
import { useEffect, useMemo } from "react";
import { Button, IconButton } from "../../atoms/button";
import { IconChevronLeft, IconChevronRight } from "../../icons";
import { useControllableState } from "../../hooks";
import { formatMessage, useAtomCraft } from "../../provider";
import { EventCalendarAgenda } from "./event-calendar-agenda";
import { EventCalendarMonth } from "./event-calendar-month";
import { EventCalendarSchedule } from "./event-calendar-schedule";
import {
  createEventCalendarLabels,
  getEventCalendarRange,
  getVisibleDates,
} from "./event-calendar-utils";
import type { EventCalendarLabels } from "./event-calendar-utils";
import type {
  CalendarEvent,
  EventCalendarProps,
  EventCalendarRange,
  EventCalendarView,
} from "./types";

const DEFAULT_VIEWS: readonly EventCalendarView[] = ["month", "week", "day", "agenda"];
type CalendarMessages = ReturnType<typeof useAtomCraft>["messages"];

function viewLabel(view: EventCalendarView, messages: CalendarMessages) {
  const labels: Record<EventCalendarView, string> = {
    month: messages.eventCalendarMonth,
    week: messages.eventCalendarWeek,
    day: messages.eventCalendarDay,
    agenda: messages.eventCalendarAgenda,
  };
  return labels[view];
}

function periodLabel(
  date: Date,
  view: EventCalendarView,
  range: EventCalendarRange,
  locale: string,
  labels: EventCalendarLabels,
) {
  if (view === "month") return labels.month.format(date);
  if (view === "day") return labels.fullDate.format(date);
  const rangeFormat = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
  return `${rangeFormat.format(range.start)} - ${rangeFormat.format(addDays(range.end, -1))}`;
}

function shiftDate(date: Date, view: EventCalendarView, amount: -1 | 1) {
  if (view === "month") return addMonths(date, amount);
  return addDays(date, amount * (view === "day" ? 1 : 7));
}

function EventCalendarNavigation({
  date,
  view,
  onDateChange,
}: {
  date: Date;
  view: EventCalendarView;
  onDateChange: (date: Date) => void;
}) {
  const { dir, messages } = useAtomCraft();
  return (
    <div className="ac-event-calendar__navigation" role="group" aria-label={messages.eventCalendar}>
      <IconButton
        label={messages.eventCalendarPrevious}
        variant="ghost"
        tone="neutral"
        onClick={() => onDateChange(shiftDate(date, view, -1))}
      >
        {dir === "rtl" ? <IconChevronRight /> : <IconChevronLeft />}
      </IconButton>
      <Button variant="outline" tone="neutral" size="sm" onClick={() => onDateChange(new Date())}>
        {messages.today}
      </Button>
      <IconButton
        label={messages.eventCalendarNext}
        variant="ghost"
        tone="neutral"
        onClick={() => onDateChange(shiftDate(date, view, 1))}
      >
        {dir === "rtl" ? <IconChevronLeft /> : <IconChevronRight />}
      </IconButton>
    </div>
  );
}

function EventCalendarViewSwitcher({
  view,
  views,
  onViewChange,
}: {
  view: EventCalendarView;
  views: readonly EventCalendarView[];
  onViewChange: (view: EventCalendarView) => void;
}) {
  const { messages } = useAtomCraft();
  return (
    <div
      className="ac-event-calendar__view-switcher"
      role="group"
      aria-label={messages.eventCalendar}
    >
      {views.map((option) => (
        <Button
          key={option}
          size="sm"
          variant={view === option ? "solid" : "ghost"}
          tone={view === option ? "primary" : "neutral"}
          aria-pressed={view === option}
          onClick={() => onViewChange(option)}
        >
          {viewLabel(option, messages)}
        </Button>
      ))}
    </div>
  );
}

function EventCalendarToolbar({
  date,
  view,
  views,
  range,
  locale,
  onDateChange,
  onViewChange,
}: {
  date: Date;
  view: EventCalendarView;
  views: readonly EventCalendarView[];
  range: EventCalendarRange;
  locale: string;
  onDateChange: (date: Date) => void;
  onViewChange: (view: EventCalendarView) => void;
}) {
  const labels = createEventCalendarLabels(locale);
  return (
    <div className="ac-event-calendar__toolbar">
      <EventCalendarNavigation date={date} view={view} onDateChange={onDateChange} />
      <h2 className="ac-event-calendar__period" aria-live="polite">
        <bdi>{periodLabel(date, view, range, locale, labels)}</bdi>
      </h2>
      <EventCalendarViewSwitcher view={view} views={views} onViewChange={onViewChange} />
    </div>
  );
}

function calendarWeekStart(locale: string, requested?: number) {
  const fallback = getWeekStart(locale);
  if (requested !== undefined && Number.isInteger(requested) && requested >= 0 && requested <= 6) {
    return requested;
  }
  return fallback;
}

function scheduleSettings(dayStartHour: number, dayEndHour: number, slotDuration: number) {
  const startHour = Math.min(
    Math.max(Number.isFinite(dayStartHour) ? Math.trunc(dayStartHour) : 7, 0),
    23,
  );
  const requestedEnd = Number.isFinite(dayEndHour) ? Math.trunc(dayEndHour) : 21;
  const endHour = Math.min(Math.max(requestedEnd, startHour + 1), 24);
  const safeSlotDuration = Math.min(
    Math.max(Number.isFinite(slotDuration) ? Math.trunc(slotDuration) : 60, 15),
    120,
  );
  return { startHour, endHour, slotDuration: safeSlotDuration };
}

function useEventCalendarDisplay(
  date: Date,
  view: EventCalendarView,
  locale: string,
  weekStartsOn: number | undefined,
) {
  const firstDay = calendarWeekStart(locale, weekStartsOn);
  const labels = useMemo(() => createEventCalendarLabels(locale), [locale]);
  const range = useMemo(() => getEventCalendarRange(date, view, firstDay), [date, view, firstDay]);
  const dates = useMemo(() => getVisibleDates(date, view, firstDay), [date, view, firstDay]);
  return { firstDay, labels, range, dates, today: startOfDay(new Date()) };
}
type EventCalendarDisplay = ReturnType<typeof useEventCalendarDisplay>;
type ScheduleSettings = ReturnType<typeof scheduleSettings>;

function visibleCalendarView(current: EventCalendarView, views: readonly EventCalendarView[]) {
  if (views.includes(current)) return current;
  return views[0] ?? "month";
}

function eventLimit(value: number) {
  return Math.max(Number.isFinite(value) ? Math.trunc(value) : 3, 1);
}

type EventCalendarContentProps = {
  view: EventCalendarView;
  dir: "ltr" | "rtl";
  date: Date;
  events: readonly CalendarEvent[];
  dates: readonly Date[];
  labels: EventCalendarLabels;
  weekStartsOn: number;
  maxEventsPerDay: number;
  dayStartHour: number;
  dayEndHour: number;
  slotDuration: number;
  today: Date;
  onDateSelect: (date: Date) => void;
  onEventSelect: (event: CalendarEvent) => void;
  onShowMore: (date: Date) => void;
};

function EventCalendarContent(props: EventCalendarContentProps) {
  const { messages } = useAtomCraft();
  switch (props.view) {
    case "month":
      return (
        <EventCalendarMonth
          date={props.date}
          dir={props.dir}
          events={props.events}
          labels={props.labels}
          weekStartsOn={props.weekStartsOn}
          maxEventsPerDay={props.maxEventsPerDay}
          today={props.today}
          moreLabel={(count) => formatMessage(messages.eventCalendarMoreEvents, { count })}
          onDateSelect={props.onDateSelect}
          onEventSelect={props.onEventSelect}
          onShowMore={props.onShowMore}
        />
      );
    case "week":
    case "day":
      return (
        <EventCalendarSchedule
          view={props.view}
          dates={props.dates}
          events={props.events}
          labels={props.labels}
          timeLabel={messages.eventCalendarTime}
          allDayLabel={messages.eventCalendarAllDay}
          startHour={props.dayStartHour}
          endHour={props.dayEndHour}
          slotDuration={props.slotDuration}
          today={props.today}
          onDateSelect={props.onDateSelect}
          onEventSelect={props.onEventSelect}
        />
      );
    case "agenda":
      return (
        <EventCalendarAgenda
          dates={props.dates}
          events={props.events}
          labels={props.labels}
          emptyLabel={messages.eventCalendarNoEvents}
          onEventSelect={props.onEventSelect}
        />
      );
  }
}

type EventCalendarFrameProps = {
  label?: string | undefined;
  className?: string | undefined;
  dir: "ltr" | "rtl";
  locale: string;
  messages: CalendarMessages;
  currentDate: Date;
  currentView: EventCalendarView;
  views: readonly EventCalendarView[];
  display: EventCalendarDisplay;
  schedule: ScheduleSettings;
  events: readonly CalendarEvent[];
  maxEventsPerDay: number;
  onDateChange: (date: Date) => void;
  onViewChange: (view: EventCalendarView) => void;
  onDateSelect: (date: Date) => void;
  onEventSelect: (event: CalendarEvent) => void;
  onShowMore: (date: Date) => void;
};

function EventCalendarFrame(props: EventCalendarFrameProps) {
  return (
    <section
      data-slot="event-calendar"
      data-view={props.currentView}
      dir={props.dir}
      aria-label={props.label ?? props.messages.eventCalendar}
      className={cn("ac-event-calendar", props.className)}
    >
      <EventCalendarToolbar
        date={props.currentDate}
        view={props.currentView}
        views={props.views}
        range={props.display.range}
        locale={props.locale}
        onDateChange={props.onDateChange}
        onViewChange={props.onViewChange}
      />
      <EventCalendarContent
        view={props.currentView}
        dir={props.dir}
        date={props.currentDate}
        events={props.events}
        dates={props.display.dates}
        labels={props.display.labels}
        weekStartsOn={props.display.firstDay}
        maxEventsPerDay={props.maxEventsPerDay}
        dayStartHour={props.schedule.startHour}
        dayEndHour={props.schedule.endHour}
        slotDuration={props.schedule.slotDuration}
        today={props.display.today}
        onDateSelect={props.onDateSelect}
        onEventSelect={props.onEventSelect}
        onShowMore={props.onShowMore}
      />
    </section>
  );
}

/** Event calendar with month, week, day and agenda views. It receives event data and emits selections. */
export function EventCalendar(props: EventCalendarProps) {
  const { locale, dir, messages } = useAtomCraft();
  const [currentDate, setCurrentDate] = useControllableState<Date>({
    value: props.date,
    defaultValue: props.defaultDate ?? new Date(),
    onChange: props.onDateChange,
  });
  const [currentView, setCurrentView] = useControllableState<EventCalendarView>({
    value: props.view,
    defaultValue: props.defaultView ?? "month",
    onChange: props.onViewChange,
  });
  const availableViews = props.views?.length ? props.views : DEFAULT_VIEWS;
  const visibleView = visibleCalendarView(currentView, availableViews);
  const display = useEventCalendarDisplay(currentDate, visibleView, locale, props.weekStartsOn);
  const schedule = scheduleSettings(
    props.dayStartHour ?? 7,
    props.dayEndHour ?? 21,
    props.slotDuration ?? 60,
  );
  const safeMaxEvents = eventLimit(props.maxEventsPerDay ?? 3);
  const startKey = toIsoDate(display.range.start);
  const endKey = toIsoDate(display.range.end);
  const onRangeChange = props.onRangeChange;

  useEffect(() => {
    onRangeChange?.({ start: display.range.start, end: display.range.end });
  }, [onRangeChange, startKey, endKey, display.range]);

  const selectDate = (selectedDate: Date) => {
    if (toIsoDate(currentDate) !== toIsoDate(selectedDate)) setCurrentDate(selectedDate);
    props.onDateSelect?.(selectedDate);
  };
  const showMore = (selectedDate: Date) => {
    selectDate(selectedDate);
    setCurrentView("day");
  };

  return (
    <EventCalendarFrame
      label={props.label}
      className={props.className}
      dir={dir}
      locale={locale}
      messages={messages}
      currentDate={currentDate}
      currentView={visibleView}
      views={availableViews}
      display={display}
      schedule={schedule}
      events={props.events}
      maxEventsPerDay={safeMaxEvents}
      onDateChange={setCurrentDate}
      onViewChange={setCurrentView}
      onDateSelect={selectDate}
      onEventSelect={(selectedEvent) => props.onEventSelect?.(selectedEvent)}
      onShowMore={showMore}
    />
  );
}

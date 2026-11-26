import {
  dataAttr,
  getMonthGrid,
  getWeekdays,
  isSameDay,
  isSameMonth,
  toIsoDate,
  toWeeks,
} from "@atomscraft/core";
import type { KeyboardEvent } from "react";
import { useCalendarLabels } from "./use-calendar";

type Labels = ReturnType<typeof useCalendarLabels>;

/** A reference week, used only to read the locale's weekday names. */
const WEEKDAY_SAMPLE = new Date(2026, 2, 1);

const weekdaySample = (weekday: number): Date =>
  new Date(
    WEEKDAY_SAMPLE.getFullYear(),
    WEEKDAY_SAMPLE.getMonth(),
    1 + ((weekday - WEEKDAY_SAMPLE.getDay() + 7) % 7),
  );

function CalendarWeekdays({ weekStartsOn, labels }: { weekStartsOn: number; labels: Labels }) {
  return (
    <thead>
      <tr>
        {getWeekdays(weekStartsOn).map((weekday) => {
          const sample = weekdaySample(weekday);
          return (
            <th key={weekday} scope="col" abbr={labels.weekdayLong.format(sample)}>
              {labels.weekdayShort.format(sample)}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

type DayProps = {
  date: Date;
  month: Date;
  labels: Labels;
  selected: boolean;
  focused: boolean;
  today: boolean;
  inRange: boolean;
  disabled: boolean;
  onSelect: (date: Date) => void;
};

function CalendarDay({ date, month, labels, ...state }: DayProps) {
  return (
    <button
      type="button"
      tabIndex={state.focused ? 0 : -1}
      aria-disabled={state.disabled || undefined}
      aria-current={state.today ? "date" : undefined}
      aria-label={labels.full.format(date)}
      data-slot="calendar-day"
      data-outside={dataAttr(!isSameMonth(date, month))}
      data-selected={dataAttr(state.selected)}
      data-today={dataAttr(state.today)}
      data-in-range={dataAttr(state.inRange)}
      className="ac-calendar__day"
      onClick={() => (state.disabled ? undefined : state.onSelect(date))}
    >
      <span aria-hidden="true">{labels.day.format(date)}</span>
    </button>
  );
}

export type CalendarGridProps = {
  month: Date;
  focused: Date;
  selected: readonly Date[];
  today: Date;
  weekStartsOn: number;
  locale: string;
  labelledBy: string;
  showOutsideDays: boolean;
  isDisabled: (date: Date) => boolean;
  /** True for days between the two ends of a selected range. */
  isInRange: (date: Date) => boolean;
  onSelect: (date: Date) => void;
  onKeyDown: (event: KeyboardEvent) => void;
};

/** The month as a `role="grid"` table: one tabbable day, as the APG pattern requires. */
export function CalendarGrid(props: CalendarGridProps) {
  const { month, weekStartsOn, locale, showOutsideDays } = props;
  const labels = useCalendarLabels(locale);

  return (
    <table role="grid" aria-labelledby={props.labelledBy} className="ac-calendar__grid">
      <CalendarWeekdays weekStartsOn={weekStartsOn} labels={labels} />
      <tbody onKeyDown={props.onKeyDown}>
        {toWeeks(getMonthGrid(month, weekStartsOn)).map((week) => (
          <tr key={toIsoDate(week[0]?.date ?? month)}>
            {week.map(({ date, inMonth }) => {
              const selected = props.selected.some((value) => isSameDay(value, date));
              return (
                <td
                  key={toIsoDate(date)}
                  role="gridcell"
                  aria-selected={selected}
                  className="ac-calendar__cell"
                >
                  {(inMonth || showOutsideDays) && (
                    <CalendarDay
                      date={date}
                      month={month}
                      labels={labels}
                      selected={selected}
                      focused={isSameDay(date, props.focused)}
                      today={isSameDay(date, props.today)}
                      inRange={props.isInRange(date)}
                      disabled={props.isDisabled(date)}
                      onSelect={props.onSelect}
                    />
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

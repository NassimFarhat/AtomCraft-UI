import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  clampDate,
  fromIsoDate,
  getMonthGrid,
  getWeekdays,
  isDateInRange,
  isSameDay,
  startOfWeek,
  toIsoDate,
  toWeeks,
} from "./date";

const march = new Date(2026, 2, 15);

describe("addMonths", () => {
  it("keeps the day inside the target month", () => {
    expect(toIsoDate(addMonths(new Date(2026, 0, 31), 1))).toBe("2026-02-28");
    expect(toIsoDate(addMonths(new Date(2024, 0, 31), 1))).toBe("2024-02-29");
  });

  it("crosses year boundaries", () => {
    expect(toIsoDate(addMonths(new Date(2026, 11, 10), 1))).toBe("2027-01-10");
    expect(toIsoDate(addMonths(new Date(2026, 0, 10), -1))).toBe("2025-12-10");
  });
});

describe("getMonthGrid", () => {
  it("always returns six full weeks", () => {
    for (let month = 0; month < 12; month += 1) {
      expect(getMonthGrid(new Date(2026, month, 1))).toHaveLength(42);
    }
  });

  it("starts on the first day of the week and pads with neighbouring days", () => {
    const monday = getMonthGrid(march, 1);
    expect(monday[0]?.date.getDay()).toBe(1);
    expect(monday[0]?.inMonth).toBe(false);
    expect(toIsoDate(monday[0]?.date ?? march)).toBe("2026-02-23");

    const sunday = getMonthGrid(march, 0);
    expect(sunday[0]?.date.getDay()).toBe(0);
  });

  it("marks every day of the month as in-month", () => {
    const inMonth = getMonthGrid(march).filter((cell) => cell.inMonth);
    expect(inMonth).toHaveLength(31);
  });
});

describe("getWeekdays", () => {
  it("orders the week from the given first day", () => {
    expect(getWeekdays(1)).toEqual([1, 2, 3, 4, 5, 6, 0]);
    expect(getWeekdays(0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(getWeekdays(6)).toEqual([6, 0, 1, 2, 3, 4, 5]);
  });
});

describe("ISO dates", () => {
  it("round-trips a date", () => {
    expect(fromIsoDate(toIsoDate(march))).toEqual(march);
  });

  it.each(["", "15/03/2026", "2026-13-01", "2026-02-30", "not a date"])("rejects %s", (value) => {
    expect(fromIsoDate(value)).toBeNull();
  });
});

describe("clampDate", () => {
  it("keeps the date inside the bounds", () => {
    const min = new Date(2026, 2, 10);
    const max = new Date(2026, 2, 20);
    expect(clampDate(march, min, max)).toEqual(march);
    expect(clampDate(new Date(2026, 2, 1), min, max)).toEqual(min);
    expect(clampDate(new Date(2026, 2, 28), min, max)).toEqual(max);
    expect(clampDate(march)).toEqual(march);
  });
});

describe("isSameDay and isDateInRange", () => {
  it("ignores the time of day", () => {
    expect(isSameDay(march, new Date(2026, 2, 15, 23, 59))).toBe(true);
    expect(isSameDay(march, addDays(march, 1))).toBe(false);
  });

  it("includes both ends of the range", () => {
    const range = { start: new Date(2026, 2, 10), end: new Date(2026, 2, 20) };
    expect(isDateInRange(range.start, range)).toBe(true);
    expect(isDateInRange(range.end, range)).toBe(true);
    expect(isDateInRange(march, range)).toBe(true);
    expect(isDateInRange(new Date(2026, 2, 21), range)).toBe(false);
    expect(isDateInRange(march, { start: range.start, end: null })).toBe(false);
  });
});

describe("startOfWeek and toWeeks", () => {
  it("finds the first day of the week", () => {
    expect(toIsoDate(startOfWeek(new Date(2026, 2, 15), 1))).toBe("2026-03-09");
    expect(toIsoDate(startOfWeek(new Date(2026, 2, 15), 0))).toBe("2026-03-15");
  });

  it("splits a month grid into six weeks of seven days", () => {
    const weeks = toWeeks(getMonthGrid(new Date(2026, 2, 1)));
    expect(weeks).toHaveLength(6);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { includesText, matchText, normalizeText, splitMatch } from "./filter";

describe("normalizeText", () => {
  it("lowercases and drops diacritics", () => {
    expect(normalizeText("Médina Studio")).toBe("medina studio");
    expect(normalizeText("Sfax")).toBe("sfax");
  });
});

describe("matchText", () => {
  it("matches accent- and case-insensitively", () => {
    expect(matchText("Médina", "medi")).toEqual({ start: 0, end: 4 });
    expect(matchText("Carthage Labs", "LABS")).toEqual({ start: 9, end: 13 });
  });

  it("returns an empty range for an empty query and null for a miss", () => {
    expect(matchText("Sfax", "  ")).toEqual({ start: 0, end: 0 });
    expect(matchText("Sfax", "tunis")).toBeNull();
  });
});

describe("includesText", () => {
  it.each([
    ["Kerkennah", "kerk", true],
    ["Kerkennah", "nah", true],
    ["Kerkennah", "zz", false],
  ])("%s ~ %s", (text, query, expected) => {
    expect(includesText(text, query)).toBe(expected);
  });
});

describe("splitMatch", () => {
  it("splits around the match so it can be highlighted", () => {
    expect(splitMatch("Carthage", "rth")).toEqual(["Ca", "rth", "age"]);
  });

  it("returns the whole text when there is nothing to highlight", () => {
    expect(splitMatch("Carthage", "")).toEqual(["Carthage", "", ""]);
    expect(splitMatch("Carthage", "zz")).toEqual(["Carthage", "", ""]);
  });
});

import { describe, expect, it } from "vitest";
import { contrastRatio, hexToRgb } from "./contrast";

describe("hexToRgb", () => {
  it("parses a 6-digit hex color", () => {
    expect(hexToRgb("#2563eb")).toEqual([37, 99, 235]);
  });

  it("rejects an invalid color", () => {
    expect(() => hexToRgb("blue")).toThrow(/6-digit hex/);
  });
});

describe("contrastRatio", () => {
  it("is 21 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  it("is 1 for identical colors", () => {
    expect(contrastRatio("#777777", "#777777")).toBeCloseTo(1, 5);
  });

  it("does not depend on argument order", () => {
    expect(contrastRatio("#2563eb", "#ffffff")).toBe(contrastRatio("#ffffff", "#2563eb"));
  });
});

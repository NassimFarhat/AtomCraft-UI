import { describe, expect, it } from "vitest";
import { nextSliderValue, ratioOf, snapToStep, valueFromRatio } from "./slider";

const scale = { min: 0, max: 100, step: 5 };

describe("snapToStep", () => {
  it("rounds to the step grid and clamps to the bounds", () => {
    expect(snapToStep(23, scale)).toBe(25);
    expect(snapToStep(-10, scale)).toBe(0);
    expect(snapToStep(140, scale)).toBe(100);
  });

  it("keeps the precision of a fractional step", () => {
    expect(snapToStep(0.34, { min: 0, max: 1, step: 0.1 })).toBe(0.3);
  });

  it("works on a scale that does not start at zero", () => {
    expect(snapToStep(7, { min: 1, max: 10, step: 2 })).toBe(7);
    expect(snapToStep(8, { min: 1, max: 10, step: 2 })).toBe(9);
  });
});

describe("ratioOf and valueFromRatio", () => {
  it("maps a value to its position and back", () => {
    expect(ratioOf(25, scale)).toBe(0.25);
    expect(valueFromRatio(0.25, scale)).toBe(25);
  });

  it("keeps the ratio inside 0 and 1", () => {
    expect(ratioOf(-5, scale)).toBe(0);
    expect(ratioOf(500, scale)).toBe(1);
    expect(ratioOf(1, { min: 1, max: 1, step: 1 })).toBe(0);
  });
});

describe("nextSliderValue", () => {
  it("steps with the arrow keys", () => {
    expect(nextSliderValue(50, "ArrowUp", scale)).toBe(55);
    expect(nextSliderValue(50, "ArrowDown", scale)).toBe(45);
  });

  it("jumps by ten steps with Page keys and to the bounds with Home and End", () => {
    expect(nextSliderValue(50, "PageUp", scale)).toBe(100);
    expect(nextSliderValue(50, "PageDown", scale)).toBe(0);
    expect(nextSliderValue(50, "Home", scale)).toBe(0);
    expect(nextSliderValue(50, "End", scale)).toBe(100);
  });

  it("mirrors the horizontal arrows in right-to-left layouts", () => {
    expect(nextSliderValue(50, "ArrowRight", { ...scale, dir: "rtl" })).toBe(45);
    expect(nextSliderValue(50, "ArrowLeft", { ...scale, dir: "rtl" })).toBe(55);
    expect(nextSliderValue(50, "ArrowUp", { ...scale, dir: "rtl" })).toBe(55);
  });

  it("ignores keys that do not move the slider", () => {
    expect(nextSliderValue(50, "Enter", scale)).toBe(50);
  });
});

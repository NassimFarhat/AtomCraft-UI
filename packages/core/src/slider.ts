/** Value arithmetic of a slider: ratios, stepping and keyboard moves, without any DOM. */

export type SliderScale = {
  min: number;
  max: number;
  step: number;
};

const decimalsOf = (step: number): number => (String(step).split(".")[1] ?? "").length;

/** Rounds to the step grid and clamps to the bounds, keeping the step's precision. */
export function snapToStep(value: number, { min, max, step }: SliderScale): number {
  const steps = Math.round((value - min) / step);
  const snapped = min + steps * step;
  return Number(Math.min(Math.max(snapped, min), max).toFixed(decimalsOf(step)));
}

/** Position of a value on the track, from 0 (min) to 1 (max). */
export const ratioOf = (value: number, { min, max }: SliderScale): number =>
  max === min ? 0 : Math.min(Math.max((value - min) / (max - min), 0), 1);

export const valueFromRatio = (ratio: number, scale: SliderScale): number =>
  snapToStep(scale.min + ratio * (scale.max - scale.min), scale);

type SliderKeyOptions = SliderScale & {
  /** Jump of PageUp and PageDown. Defaults to ten steps. */
  largeStep?: number;
  dir?: "ltr" | "rtl";
};

const DECREASE = new Set(["ArrowDown", "ArrowLeft"]);
const INCREASE = new Set(["ArrowUp", "ArrowRight"]);

function deltaFor(key: string, step: number, largeStep: number): number | undefined {
  if (key === "PageUp") return largeStep;
  if (key === "PageDown") return -largeStep;
  if (INCREASE.has(key)) return step;
  if (DECREASE.has(key)) return -step;
  return undefined;
}

/** Value after a key press, or undefined when the key does not move the slider. */
export function nextSliderValue(current: number, key: string, options: SliderKeyOptions): number {
  const { largeStep = options.step * 10, dir = "ltr" } = options;
  if (key === "Home") return options.min;
  if (key === "End") return options.max;
  const delta = deltaFor(key, options.step, largeStep);
  if (delta === undefined) return current;
  const horizontal = key === "ArrowLeft" || key === "ArrowRight";
  const mirrored = dir === "rtl" && horizontal ? -delta : delta;
  return snapToStep(current + mirrored, options);
}

export const SLIDER_KEYS: readonly string[] = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "PageUp",
  "PageDown",
  "Home",
  "End",
];

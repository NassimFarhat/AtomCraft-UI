import { useControllableState } from "../../hooks";
import { useMessages } from "../../provider";
import type { ControlSize, Tone } from "../../types";
import { SliderBase } from "./slider-base";
import type { SliderMark, SliderOrientation } from "./types";

type SharedSliderProps = {
  min?: number;
  max?: number;
  step?: number;
  /** Jump of PageUp and PageDown. Defaults to ten steps. */
  largeStep?: number | undefined;
  disabled?: boolean;
  orientation?: SliderOrientation;
  size?: ControlSize;
  tone?: Tone;
  /** Ticks under the track, with an optional label each. */
  marks?: readonly SliderMark[] | undefined;
  /** Spoken value, e.g. "40 dinars". Defaults to the number itself. */
  formatValue?: ((value: number) => string) | undefined;
  /** Id of the visible label, when the name comes from a Label instead of `label`. */
  labelledBy?: string | undefined;
  className?: string | undefined;
};

export type SliderProps = SharedSliderProps & {
  value?: number | undefined;
  defaultValue?: number;
  onValueChange?: ((value: number) => void) | undefined;
  /** Accessible name of the thumb. Required unless `labelledBy` is given. */
  label?: string | undefined;
  /** Submits the value with a surrounding form. */
  name?: string | undefined;
};

const scaleOf = (min: number, max: number, step: number) => ({ min, max, step });

/** Submits a slider value with the surrounding form. */
const FormValue = ({ name, value }: { name: string | undefined; value: number }) =>
  name === undefined ? null : <input type="hidden" name={name} value={value} />;

/** Single-value slider (WAI-ARIA APG): drag, arrows, Page keys, Home and End. */
export function Slider({
  value,
  defaultValue = 0,
  onValueChange,
  label,
  name,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  orientation = "horizontal",
  size = "md",
  tone = "primary",
  ...rest
}: SliderProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  return (
    <>
      <SliderBase
        {...rest}
        values={[current]}
        onValuesChange={(next) => setCurrent(next[0] ?? current)}
        thumbLabels={[label]}
        scale={scaleOf(min, max, step)}
        disabled={disabled}
        orientation={orientation}
        size={size}
        tone={tone}
      />
      <FormValue name={name} value={current} />
    </>
  );
}

export type SliderRangeValue = [start: number, end: number];

/** Keeps the pair shape after an update, whatever the base reports. */
const toRange = (next: readonly number[], previous: SliderRangeValue): SliderRangeValue => [
  next[0] ?? previous[0],
  next[1] ?? previous[1],
];

export type SliderRangeProps = SharedSliderProps & {
  value?: SliderRangeValue | undefined;
  defaultValue?: SliderRangeValue;
  onValueChange?: ((value: SliderRangeValue) => void) | undefined;
  /** Accessible names of the two thumbs. Defaults to the built-in labels. */
  labels?: readonly [string, string] | undefined;
  /** Submits the two values with a surrounding form. */
  startName?: string | undefined;
  endName?: string | undefined;
};

/** Two-thumb slider for a range, e.g. a price filter. The thumbs cannot cross. */
export function SliderRange({
  value,
  defaultValue = [0, 100],
  onValueChange,
  labels,
  startName,
  endName,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  orientation = "horizontal",
  size = "md",
  tone = "primary",
  ...rest
}: SliderRangeProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const messages = useMessages();
  const [start, end] = current;
  return (
    <>
      <SliderBase
        {...rest}
        values={current}
        onValuesChange={(next) => setCurrent(toRange(next, current))}
        thumbLabels={labels ?? [messages.rangeStart, messages.rangeEnd]}
        scale={scaleOf(min, max, step)}
        disabled={disabled}
        orientation={orientation}
        size={size}
        tone={tone}
      />
      <FormValue name={startName} value={start} />
      <FormValue name={endName} value={end} />
    </>
  );
}

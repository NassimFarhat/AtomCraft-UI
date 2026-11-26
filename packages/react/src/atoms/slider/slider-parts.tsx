import { dataAttr, ratioOf } from "@atomscraft/core";
import type { SliderScale } from "@atomscraft/core";
import type { CSSProperties, KeyboardEvent, RefObject } from "react";
import type { SliderMark, SliderOrientation } from "./types";

export const atPercent = (value: number, scale: SliderScale): CSSProperties =>
  ({ "--_at": `${ratioOf(value, scale) * 100}%` }) as CSSProperties;

export function SliderMarks({
  marks,
  scale,
  from,
  to,
}: {
  marks: readonly SliderMark[];
  scale: SliderScale;
  from: number;
  to: number;
}) {
  return marks.map((mark) => (
    <span
      key={mark.value}
      className="ac-slider__mark"
      data-slot="slider-mark"
      data-active={dataAttr(mark.value >= from && mark.value <= to)}
      style={atPercent(mark.value, scale)}
    >
      {mark.label !== undefined && <span className="ac-slider__mark-label">{mark.label}</span>}
    </span>
  ));
}

export type SliderThumbsProps = {
  values: readonly number[];
  labels: readonly (string | undefined)[];
  /** Id of a visible label, used when `labels` are not given. */
  labelledBy: string | undefined;
  bounds: (index: number) => { min: number; max: number };
  scale: SliderScale;
  orientation: SliderOrientation;
  disabled: boolean;
  formatValue: ((value: number) => string) | undefined;
  thumbsRef: RefObject<(HTMLSpanElement | null)[]>;
  onKeyDown: (index: number, event: KeyboardEvent<HTMLSpanElement>) => void;
};

/** One `role="slider"` element per value, as the APG slider pattern requires. */
export function SliderThumbs({
  values,
  labels,
  labelledBy,
  bounds,
  scale,
  orientation,
  disabled,
  formatValue,
  thumbsRef,
  onKeyDown,
}: SliderThumbsProps) {
  return values.map((value, index) => (
    <span
      key={index}
      ref={(node) => {
        thumbsRef.current[index] = node;
      }}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={labels[index]}
      aria-labelledby={labels[index] === undefined ? labelledBy : undefined}
      aria-orientation={orientation}
      aria-valuemin={bounds(index).min}
      aria-valuemax={bounds(index).max}
      aria-valuenow={value}
      aria-valuetext={formatValue?.(value)}
      aria-disabled={disabled || undefined}
      data-slot="slider-thumb"
      className="ac-slider__thumb"
      style={atPercent(value, scale)}
      onKeyDown={(event) => onKeyDown(index, event)}
    />
  ));
}

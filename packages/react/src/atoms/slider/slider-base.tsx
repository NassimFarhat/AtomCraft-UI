import { cn, dataAttr, ratioOf } from "@atomscraft/core";
import type { SliderScale } from "@atomscraft/core";
import { useRef } from "react";
import type { CSSProperties } from "react";
import type { ControlSize, Tone } from "../../types";
import { SliderMarks, SliderThumbs } from "./slider-parts";
import type { SliderMark, SliderOrientation } from "./types";
import { neighbourBounds, useSliderDrag } from "./use-slider-drag";

export type SliderBaseProps = {
  values: readonly number[];
  onValuesChange: (values: number[]) => void;
  /** Accessible name of each thumb, in order. */
  thumbLabels: readonly (string | undefined)[];
  /** Id of the visible label, used for thumbs without a name of their own. */
  labelledBy?: string | undefined;
  scale: SliderScale;
  largeStep?: number | undefined;
  disabled: boolean;
  orientation: SliderOrientation;
  size: ControlSize;
  tone: Tone;
  marks?: readonly SliderMark[] | undefined;
  /** Spoken value, e.g. "40 dinars". Defaults to the number itself. */
  formatValue?: ((value: number) => string) | undefined;
  className?: string | undefined;
};

const asPercent = (value: number, scale: SliderScale): string => `${ratioOf(value, scale) * 100}%`;

/** Shared track, range, marks and thumbs of Slider and SliderRange. */
export function SliderBase(props: SliderBaseProps) {
  const { values, scale, disabled, orientation, marks } = props;
  const trackRef = useRef<HTMLSpanElement>(null);
  const drag = useSliderDrag({
    values,
    onValuesChange: props.onValuesChange,
    scale,
    largeStep: props.largeStep,
    disabled,
    orientation,
    trackRef,
  });

  const [from = scale.min] = values;
  const to = values[values.length - 1] ?? from;
  const fill = {
    "--_from": values.length > 1 ? asPercent(from, scale) : "0%",
    "--_to": asPercent(to, scale),
  } as CSSProperties;

  return (
    <span
      data-slot="slider"
      data-orientation={orientation}
      data-size={props.size}
      data-tone={props.tone}
      data-disabled={dataAttr(disabled)}
      data-dragging={dataAttr(drag.dragging !== null)}
      className={cn("ac-slider", props.className)}
    >
      <span
        ref={trackRef}
        className="ac-slider__track"
        data-slot="slider-track"
        {...drag.trackHandlers}
      >
        <span className="ac-slider__range" data-slot="slider-range" style={fill} />
        {marks && <SliderMarks marks={marks} scale={scale} from={from} to={to} />}
        <SliderThumbs
          values={values}
          labels={props.thumbLabels}
          labelledBy={props.labelledBy}
          bounds={(index) => neighbourBounds(values, index, scale)}
          scale={scale}
          orientation={orientation}
          disabled={disabled}
          formatValue={props.formatValue}
          thumbsRef={drag.thumbsRef}
          onKeyDown={drag.handleKeyDown}
        />
      </span>
    </span>
  );
}

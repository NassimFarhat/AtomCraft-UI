import { nextSliderValue } from "@atomcraft/core";
import type { SliderScale } from "@atomcraft/core";
import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent, RefObject } from "react";
import { useAtomCraft } from "../../provider";
import type { SliderOrientation } from "./types";
import { useSliderPointer } from "./use-slider-pointer";

export type SliderDragOptions = {
  values: readonly number[];
  onValuesChange: (values: number[]) => void;
  scale: SliderScale;
  largeStep: number | undefined;
  disabled: boolean;
  orientation: SliderOrientation;
  trackRef: RefObject<HTMLElement | null>;
};

/** Bounds of one thumb: its neighbours, so thumbs never cross. */
export const neighbourBounds = (values: readonly number[], index: number, scale: SliderScale) => ({
  min: values[index - 1] ?? scale.min,
  max: values[index + 1] ?? scale.max,
});

/** Index of the thumb closest to `value`; the lower one wins a tie. */
function nearestThumb(values: readonly number[], value: number): number {
  const distances = values.map((current) => Math.abs(current - value));
  return distances.indexOf(Math.min(...distances));
}

/** Pointer dragging and APG key handling for the thumbs of a slider. */
export function useSliderDrag({
  values,
  onValuesChange,
  scale,
  largeStep,
  disabled,
  orientation,
  trackRef,
}: SliderDragOptions) {
  const { dir } = useAtomCraft();
  const thumbsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const valueFromPointer = useSliderPointer(trackRef, { scale, orientation });

  const commit = (index: number, next: number) => {
    const bounds = neighbourBounds(values, index, scale);
    const clamped = Math.min(Math.max(next, bounds.min), bounds.max);
    if (clamped === values[index]) return;
    onValuesChange(values.map((current, at) => (at === index ? clamped : current)));
  };

  const stopDragging = () => setDragging(null);

  const trackHandlers = {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      const value = valueFromPointer(event);
      if (disabled || value === null) return;
      const index = nearestThumb(values, value);
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(index);
      thumbsRef.current[index]?.focus();
      commit(index, value);
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (dragging === null) return;
      const value = valueFromPointer(event);
      if (value !== null) commit(dragging, value);
    },
    onPointerUp: stopDragging,
    onPointerCancel: stopDragging,
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;
    const current = values[index] ?? scale.min;
    const next = nextSliderValue(current, event.key, {
      ...scale,
      dir,
      ...(largeStep === undefined ? {} : { largeStep }),
    });
    if (next === current) return;
    event.preventDefault();
    commit(index, next);
  };

  return { dragging, thumbsRef, trackHandlers, handleKeyDown };
}

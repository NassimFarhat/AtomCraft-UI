import { valueFromRatio } from "@atomscraft/core";
import type { SliderScale } from "@atomscraft/core";
import { useCallback } from "react";
import type { PointerEvent, RefObject } from "react";
import { useAtomCraft } from "../../provider";
import type { SliderOrientation } from "./types";

type PointerOptions = {
  scale: SliderScale;
  orientation: SliderOrientation;
};

/** Translates a pointer position on the track into a slider value, direction aware. */
export function useSliderPointer(
  trackRef: RefObject<HTMLElement | null>,
  { scale, orientation }: PointerOptions,
): (event: PointerEvent) => number | null {
  const { dir } = useAtomCraft();
  return useCallback(
    (event: PointerEvent) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return null;
      const raw =
        orientation === "vertical"
          ? 1 - (event.clientY - rect.top) / rect.height
          : (event.clientX - rect.left) / rect.width;
      const ratio = dir === "rtl" && orientation === "horizontal" ? 1 - raw : raw;
      return valueFromRatio(Math.min(Math.max(ratio, 0), 1), scale);
    },
    [trackRef, orientation, dir, scale],
  );
}

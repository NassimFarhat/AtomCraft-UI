import type { ReactNode } from "react";

export type SliderOrientation = "horizontal" | "vertical";

export type SliderMark = {
  value: number;
  /** Shown under the tick. Without it the mark is a plain tick. */
  label?: ReactNode;
};

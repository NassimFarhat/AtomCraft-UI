import { fontSize, fontWeight, letterSpacing, lineHeight, radius, shadow } from "./primitives";

/** Semantic scales: what a size is for. Components only use these. */

export const DENSITIES = ["compact", "comfortable", "spacious"] as const;
export type Density = (typeof DENSITIES)[number];
export const DEFAULT_DENSITY: Density = "comfortable";

type DensityTokens = Readonly<Record<string, string>>;

export const densities: Readonly<Record<Density, DensityTokens>> = {
  compact: {
    "size-control-xs": "1.5rem",
    "size-control-sm": "1.75rem",
    "size-control-md": "2rem",
    "size-control-lg": "2.25rem",
    "padding-control-sm": "0.5rem",
    "padding-control-md": "0.625rem",
    "padding-control-lg": "0.875rem",
    "space-inset-sm": "0.5rem",
    "space-inset-md": "0.75rem",
    "space-inset-lg": "1rem",
  },
  comfortable: {
    "size-control-xs": "1.75rem",
    "size-control-sm": "2rem",
    "size-control-md": "2.25rem",
    "size-control-lg": "2.75rem",
    "padding-control-sm": "0.75rem",
    "padding-control-md": "1rem",
    "padding-control-lg": "1.25rem",
    "space-inset-sm": "0.75rem",
    "space-inset-md": "1.25rem",
    "space-inset-lg": "1.5rem",
  },
  spacious: {
    "size-control-xs": "2rem",
    "size-control-sm": "2.25rem",
    "size-control-md": "2.75rem",
    "size-control-lg": "3rem",
    "padding-control-sm": "0.875rem",
    "padding-control-md": "1.25rem",
    "padding-control-lg": "1.5rem",
    "space-inset-sm": "1rem",
    "space-inset-md": "1.5rem",
    "space-inset-lg": "2rem",
  },
};

export const SHAPES = ["rounded", "sharp", "pill"] as const;
export type Shape = (typeof SHAPES)[number];
export const DEFAULT_SHAPE: Shape = "rounded";

export const shapes: Readonly<Record<Shape, Readonly<Record<string, string>>>> = {
  rounded: {
    "radius-control": radius.lg,
    "radius-card": radius.xl,
    "radius-dialog": radius["2xl"],
    "radius-popover": radius.lg,
    "radius-badge": radius.md,
    "radius-item": radius.md,
  },
  sharp: {
    "radius-control": radius.none,
    "radius-card": radius.none,
    "radius-dialog": radius.none,
    "radius-popover": radius.none,
    "radius-badge": radius.none,
    "radius-item": radius.none,
  },
  pill: {
    "radius-control": radius.full,
    "radius-card": radius["3xl"],
    "radius-dialog": radius["3xl"],
    "radius-popover": radius.xl,
    "radius-badge": radius.full,
    "radius-item": radius.full,
  },
};

type TypeStyle = readonly [size: string, line: string, weight: string, tracking: string];

/** Composite type styles. Display and top headings scale fluidly with the viewport. */
export const typeStyles: Readonly<Record<string, TypeStyle>> = {
  "display-lg": [
    `clamp(${fontSize["4xl"]}, 5vw + 1rem, ${fontSize["6xl"]})`,
    lineHeight.tight,
    fontWeight.bold,
    letterSpacing.tighter,
  ],
  "display-md": [
    `clamp(${fontSize["3xl"]}, 4vw + 1rem, ${fontSize["5xl"]})`,
    lineHeight.tight,
    fontWeight.bold,
    letterSpacing.tighter,
  ],
  "display-sm": [
    `clamp(${fontSize["2xl"]}, 3vw + 1rem, ${fontSize["4xl"]})`,
    lineHeight.tight,
    fontWeight.semibold,
    letterSpacing.tight,
  ],
  "heading-1": [
    `clamp(${fontSize["2xl"]}, 2vw + 1rem, ${fontSize["3xl"]})`,
    lineHeight.tight,
    fontWeight.semibold,
    letterSpacing.tight,
  ],
  "heading-2": [fontSize["2xl"], lineHeight.tight, fontWeight.semibold, letterSpacing.tight],
  "heading-3": [fontSize.xl, lineHeight.snug, fontWeight.semibold, letterSpacing.tight],
  "heading-4": [fontSize.lg, lineHeight.snug, fontWeight.semibold, letterSpacing.normal],
  "heading-5": [fontSize.md, lineHeight.snug, fontWeight.semibold, letterSpacing.normal],
  "heading-6": [fontSize.sm, lineHeight.snug, fontWeight.semibold, letterSpacing.normal],
  "body-lg": [fontSize.lg, lineHeight.relaxed, fontWeight.regular, letterSpacing.normal],
  "body-md": [fontSize.md, lineHeight.normal, fontWeight.regular, letterSpacing.normal],
  "body-sm": [fontSize.sm, lineHeight.normal, fontWeight.regular, letterSpacing.normal],
  "label-md": [fontSize.sm, lineHeight.snug, fontWeight.medium, letterSpacing.normal],
  "label-sm": [fontSize.xs, lineHeight.snug, fontWeight.medium, letterSpacing.normal],
  caption: [fontSize.xs, lineHeight.normal, fontWeight.regular, letterSpacing.normal],
  overline: [fontSize.xs, lineHeight.normal, fontWeight.semibold, letterSpacing.wide],
  code: [fontSize.sm, lineHeight.normal, fontWeight.regular, letterSpacing.normal],
};

export const elevation = {
  flat: "none",
  card: shadow.xs,
  raised: shadow.sm,
  dropdown: shadow.lg,
  popover: shadow.lg,
  dialog: shadow["2xl"],
  toast: shadow.xl,
} as const;

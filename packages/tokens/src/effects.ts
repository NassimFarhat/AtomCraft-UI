import { hexToRgb } from "./contrast";
import { palettes, shadows } from "./primitives";
import type { PaletteName } from "./primitives";
import { elevationLevels } from "./scales";
import {
  BRAND_GRADIENT_PARTNERS,
  BRAND_THEMES,
  baseThemes,
  brandIntent,
  chartColors,
} from "./semantic";
import type { BrandTheme, ColorMode } from "./semantic";

/**
 * Effects: shadows, gradients, translucency and rings. Unlike colors they are composite
 * CSS values, and they depend on the color mode (and gradients on the brand), so they are
 * emitted inside the mode and brand rules rather than once on `:root`. A nested dark
 * zone therefore gets dark shadows and its own brand gradients.
 */

export type EffectTokens = Readonly<Record<string, string>>;

/** `#4f46e5` + 0.2 → `rgb(79 70 229 / 0.2)`. */
export const alpha = (hex: string, amount: number): string =>
  `rgb(${hexToRgb(hex).join(" ")} / ${amount})`;

export function modeEffects(mode: ColorMode): EffectTokens {
  const scale = shadows[mode];
  const base = baseThemes[mode];
  const elevation = Object.entries(elevationLevels).map(([name, level]) => [
    `elevation-${name}`,
    level === "none" ? "none" : scale[level],
  ]);
  const chart = chartColors(mode).map((value, index) => [`color-chart-${index + 1}`, value]);
  return Object.fromEntries([
    ...Object.entries(scale).map(([name, value]) => [`shadow-${name}`, value]),
    ...elevation,
    /** A 1px ring drawn with box-shadow: a border that does not change layout. */
    ["shadow-ring", `0 0 0 1px ${base.borderDefault}`],
    ["shadow-ring-strong", `0 0 0 1px ${base.borderStrong}`],
    ["color-bg-glass", alpha(base.bgSurface, mode === "light" ? 0.72 : 0.68)],
    ["color-bg-glass-border", mode === "light" ? alpha("#ffffff", 0.6) : alpha("#ffffff", 0.08)],
    ...chart,
    /** Barely-there vertical light on raised surfaces. */
    [
      "gradient-surface",
      `linear-gradient(180deg, ${base.bgSurfaceRaised} 0%, ${base.bgSurface} 100%)`,
    ],
    /** Top sheen laid over solid fills (buttons, badges) for a lit, tactile edge. */
    [
      "gradient-sheen",
      `linear-gradient(180deg, ${alpha("#ffffff", mode === "light" ? 0.14 : 0.1)} 0%, ${alpha("#ffffff", 0)} 100%)`,
    ],
    /** Fades scrolling content into the canvas at an edge (mask or overlay). */
    [
      "gradient-fade",
      `linear-gradient(180deg, ${alpha(base.bgCanvas, 0)} 0%, ${base.bgCanvas} 100%)`,
    ],
  ]);
}

type Stops = { from: string; to: string };

/**
 * Gradient stops per mode. The `text` stops double as a fill behind on-solid content
 * (logo marks), so both ends must reach 4.5:1 with the brand's on-solid color and with
 * the canvas; `effects.test.ts` checks this for every brand.
 */
export function gradientStops(palette: PaletteName, partner: PaletteName, mode: ColorMode) {
  const a = palettes[palette];
  const b = palettes[partner];
  return mode === "light"
    ? {
        solid: { from: a[600], to: b[500] },
        text: { from: a[700], to: b[700] },
        soft: { from: a[50], to: b[50] },
        border: { from: a[300], to: b[300] },
        glow: a[500],
        glowPartner: b[500],
      }
    : {
        solid: { from: a[500], to: b[400] },
        text: { from: a[300], to: b[300] },
        soft: { from: a[950], to: b[950] },
        border: { from: a[700], to: b[600] },
        glow: a[400],
        glowPartner: b[400],
      };
}

const linear = ({ from, to }: Stops, angle = 135): string =>
  `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`;

export function brandEffects(brand: BrandTheme, mode: ColorMode): EffectTokens {
  const stops = gradientStops(BRAND_THEMES[brand], BRAND_GRADIENT_PARTNERS[brand], mode);
  const ring = brandIntent(brand, mode).solid;
  const strength = mode === "light" ? 1 : 1.4;
  const glow = (hex: string, amount: number) => alpha(hex, Math.min(1, amount * strength));
  return {
    "gradient-brand": linear(stops.solid),
    "gradient-brand-text": linear(stops.text, 90),
    "gradient-brand-soft": linear(stops.soft),
    "gradient-brand-border": linear(stops.border),
    /** Soft light pooling from the top edge: hero sections, empty states, feature cards. */
    "gradient-brand-glow": `radial-gradient(60% 60% at 50% 0%, ${glow(stops.glow, 0.16)} 0%, ${alpha(stops.glow, 0)} 70%)`,
    /** Two-hue ambient mesh for large marketing surfaces. */
    "gradient-brand-mesh": [
      `radial-gradient(40% 50% at 12% 8%, ${glow(stops.glow, 0.16)} 0%, ${alpha(stops.glow, 0)} 70%)`,
      `radial-gradient(45% 55% at 88% 4%, ${glow(stops.glowPartner, 0.14)} 0%, ${alpha(stops.glowPartner, 0)} 70%)`,
      `radial-gradient(55% 60% at 50% 100%, ${glow(stops.glow, 0.08)} 0%, ${alpha(stops.glow, 0)} 70%)`,
    ].join(", "),
    "color-focus-ring-soft": alpha(ring, mode === "light" ? 0.24 : 0.36),
    /** Focus halo for controls that draw focus with box-shadow instead of an outline. */
    "shadow-focus": `0 0 0 3px ${alpha(ring, mode === "light" ? 0.24 : 0.36)}`,
  };
}

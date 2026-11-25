import { palettes, white } from "./primitives";
import type { Palette, PaletteName, Shade } from "./primitives";

export type ColorMode = "light" | "dark";

/** Every intent exposes the same seven roles, so any component can take any tone. */
export const INTENT_ROLES = [
  "solid",
  "solidHover",
  "onSolid",
  "soft",
  "softHover",
  "text",
  "border",
] as const;
export type IntentRole = (typeof INTENT_ROLES)[number];
export type IntentTokens = Readonly<Record<IntentRole, string>>;

export const INTENTS = ["primary", "neutral", "info", "success", "warning", "danger"] as const;
export type Intent = (typeof INTENTS)[number];

/** Surfaces, text and borders: they follow the color mode, not the brand. */
export const BASE_TOKENS = [
  "bgCanvas",
  "bgSurface",
  "bgSurfaceRaised",
  "bgSubtle",
  "bgMuted",
  "bgInverse",
  "textPrimary",
  "textSecondary",
  "textTertiary",
  "textInverse",
  "borderSubtle",
  "borderDefault",
  "borderControl",
] as const;
export type BaseToken = (typeof BASE_TOKENS)[number];
export type BaseTokens = Readonly<Record<BaseToken, string>>;

type ShadeMap = Readonly<Record<Exclude<IntentRole, "onSolid">, Shade>> & {
  readonly onSolid: Shade | "white";
};

const DEFAULT_SHADES: Readonly<Record<ColorMode, ShadeMap>> = {
  light: {
    solid: 600,
    solidHover: 700,
    onSolid: "white",
    soft: 50,
    softHover: 100,
    text: 700,
    border: 200,
  },
  dark: {
    solid: 400,
    solidHover: 300,
    onSolid: 950,
    soft: 950,
    softHover: 900,
    text: 300,
    border: 800,
  },
};

/** Palettes whose 600 shade is too light for white text (WCAG AA) start one step darker. */
const DARKER_SOLID: ShadeMap = { ...DEFAULT_SHADES.light, solid: 700, solidHover: 800 };

const LIGHT_SHADE_OVERRIDES: Partial<Record<PaletteName, ShadeMap>> = {
  emerald: DARKER_SOLID,
  teal: DARKER_SOLID,
  orange: DARKER_SOLID,
  amber: { ...DEFAULT_SHADES.light, solid: 500, solidHover: 600, onSolid: 950, text: 800 },
  neutral: {
    solid: 900,
    solidHover: 800,
    onSolid: "white",
    soft: 100,
    softHover: 200,
    text: 900,
    border: 200,
  },
};

const DARK_SHADE_OVERRIDES: Partial<Record<PaletteName, ShadeMap>> = {
  neutral: {
    solid: 50,
    solidHover: 200,
    onSolid: 900,
    soft: 800,
    softHover: 700,
    text: 100,
    border: 700,
  },
};

function shadesFor(name: PaletteName, mode: ColorMode): ShadeMap {
  const overrides = mode === "light" ? LIGHT_SHADE_OVERRIDES : DARK_SHADE_OVERRIDES;
  return overrides[name] ?? DEFAULT_SHADES[mode];
}

const pick = (palette: Palette, shade: Shade | "white"): string =>
  shade === "white" ? white : palette[shade];

export function buildIntent(name: PaletteName, mode: ColorMode): IntentTokens {
  const palette = palettes[name];
  const shades = shadesFor(name, mode);
  return Object.fromEntries(
    INTENT_ROLES.map((role) => [role, pick(palette, shades[role])]),
  ) as IntentTokens;
}

/** Status intents are fixed across brands so meaning never changes with the theme. */
export const STATUS_PALETTES: Readonly<Record<Exclude<Intent, "primary">, PaletteName>> = {
  neutral: "neutral",
  info: "blue",
  success: "emerald",
  warning: "amber",
  danger: "red",
};

/** Off-palette neutrals tuned to give form controls a 3:1 boundary (WCAG 1.4.11). */
const controlBorder = { light: "#8f8f99", dark: "#7a7a84" } as const;

export const baseThemes: Readonly<Record<ColorMode, BaseTokens>> = {
  light: {
    bgCanvas: white,
    bgSurface: white,
    bgSurfaceRaised: white,
    bgSubtle: palettes.neutral[50],
    bgMuted: palettes.neutral[100],
    bgInverse: palettes.neutral[900],
    textPrimary: palettes.neutral[950],
    textSecondary: palettes.neutral[600],
    textTertiary: palettes.neutral[500],
    textInverse: palettes.neutral[50],
    borderSubtle: palettes.neutral[100],
    borderDefault: palettes.neutral[200],
    borderControl: controlBorder.light,
  },
  dark: {
    bgCanvas: palettes.neutral[950],
    bgSurface: palettes.neutral[900],
    bgSurfaceRaised: palettes.neutral[800],
    bgSubtle: palettes.neutral[900],
    bgMuted: palettes.neutral[800],
    bgInverse: palettes.neutral[50],
    textPrimary: palettes.neutral[50],
    textSecondary: palettes.neutral[400],
    textTertiary: palettes.neutral[400],
    textInverse: palettes.neutral[900],
    borderSubtle: palettes.neutral[900],
    borderDefault: palettes.neutral[800],
    borderControl: controlBorder.dark,
  },
};

/** Applied on top of the base theme with `data-ac-contrast="more"` or `prefers-contrast: more`. */
export const highContrastOverrides: Readonly<Record<ColorMode, Partial<BaseTokens>>> = {
  light: {
    textSecondary: palettes.neutral[800],
    textTertiary: palettes.neutral[700],
    borderDefault: palettes.neutral[500],
    borderControl: palettes.neutral[700],
  },
  dark: {
    textSecondary: palettes.neutral[200],
    textTertiary: palettes.neutral[300],
    borderDefault: palettes.neutral[400],
    borderControl: palettes.neutral[300],
  },
};

/** Brand themes only change the primary intent and the focus ring. */
export const BRAND_THEMES = {
  indigo: "indigo",
  blue: "blue",
  violet: "violet",
  emerald: "emerald",
  teal: "teal",
  rose: "rose",
  orange: "orange",
  mono: "neutral",
} as const satisfies Record<string, PaletteName>;

export type BrandTheme = keyof typeof BRAND_THEMES;
export const DEFAULT_BRAND: BrandTheme = "indigo";
export const BRAND_NAMES = Object.keys(BRAND_THEMES) as BrandTheme[];

export const brandIntent = (brand: BrandTheme, mode: ColorMode): IntentTokens =>
  buildIntent(BRAND_THEMES[brand], mode);

export const statusIntents = (mode: ColorMode): Readonly<Record<string, IntentTokens>> =>
  Object.fromEntries(
    Object.entries(STATUS_PALETTES).map(([intent, palette]) => [
      intent,
      buildIntent(palette, mode),
    ]),
  );

type Pair = readonly [foreground: string, background: string, minimum: number];

/** Every foreground/background pair a component renders, with its WCAG minimum. */
export function readablePairs(
  base: BaseTokens,
  intents: Readonly<Record<string, IntentTokens>>,
  focusRing: string,
): Pair[] {
  const surfaces = [base.bgCanvas, base.bgSurface, base.bgSurfaceRaised];
  const textOnSurfaces = surfaces.flatMap((surface): Pair[] => [
    [base.textPrimary, surface, 4.5],
    [base.textSecondary, surface, 4.5],
    [base.textTertiary, surface, 4.5],
    [base.borderControl, surface, 3],
  ]);
  const intentPairs = Object.values(intents).flatMap((intent): Pair[] => [
    [intent.onSolid, intent.solid, 4.5],
    [intent.onSolid, intent.solidHover, 4.5],
    [intent.text, intent.soft, 4.5],
    [intent.text, intent.softHover, 4.5],
    [intent.text, base.bgCanvas, 4.5],
  ]);
  return [
    ...textOnSurfaces,
    [base.textSecondary, base.bgMuted, 4.5],
    [base.textPrimary, base.bgMuted, 4.5],
    [base.textInverse, base.bgInverse, 4.5],
    [focusRing, base.bgCanvas, 3],
    [focusRing, base.bgSurface, 3],
    ...intentPairs,
  ];
}

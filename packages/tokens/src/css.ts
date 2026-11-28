import { brandEffects, modeEffects } from "./effects";
import {
  backdrop,
  blur,
  borderWidth,
  duration,
  easing,
  fontFamily,
  fontFeatures,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  opacity,
  radius,
  space,
  zIndex,
} from "./primitives";
import {
  DEFAULT_DENSITY,
  DEFAULT_SHAPE,
  densities,
  iconSize,
  layout,
  shapes,
  typeStyles,
} from "./scales";
import {
  BRAND_NAMES,
  DEFAULT_BRAND,
  INTENTS,
  INTENT_ROLES,
  baseThemes,
  brandIntent,
  highContrastOverrides,
  statusIntents,
} from "./semantic";
import type { BaseTokens, BrandTheme, ColorMode, IntentTokens } from "./semantic";

export const CSS_PREFIX = "ac";

type Declarations = ReadonlyArray<readonly [name: string, value: string]>;
type Scale = Readonly<Record<string | number, string>>;

const toKebabCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\./g, "-")
    .toLowerCase();

export const toCssVariable = (name: string): string => `--${CSS_PREFIX}-${toKebabCase(name)}`;

const scale = (group: string, values: Scale): Declarations =>
  Object.entries(values).map(([key, value]) => [`${group}-${key}`, value]);

/** `color-scheme` is a real CSS property; every other name becomes a custom property. */
const cssProperty = (name: string): string =>
  name === "color-scheme" ? name : toCssVariable(name);

function rule(selectors: readonly string[], declarations: Declarations, indent = ""): string {
  const body = declarations
    .map(([name, value]) => `${indent}  ${cssProperty(name)}: ${value};`)
    .join("\n");
  return `${indent}${selectors.join(`,\n${indent}`)} {\n${body}\n${indent}}`;
}

const media = (query: string, rules: readonly string[]): string =>
  `@media ${query} {\n${rules.join("\n\n")}\n}`;

const intentDeclarations = (intent: string, tokens: IntentTokens): Declarations =>
  INTENT_ROLES.map((role) => [`color-${intent}-${role}`, tokens[role]]);

const typeDeclarations: Declarations = Object.entries(typeStyles).flatMap(
  ([name, [size, line, weight, tracking]]) => [
    [`type-${name}-size`, size],
    [`type-${name}-line-height`, line],
    [`type-${name}-weight`, weight],
    [`type-${name}-tracking`, tracking],
  ],
);

const foundationDeclarations: Declarations = [
  ...scale("space", space),
  ...scale("font-family", fontFamily),
  ...scale("font-features", fontFeatures),
  ...scale("font-size", fontSize),
  ...scale("font-weight", fontWeight),
  ...scale("line-height", lineHeight),
  ...scale("letter-spacing", letterSpacing),
  ...scale("radius", radius),
  ...scale("border-width", borderWidth),
  ...scale("blur", blur),
  ...scale("duration", duration),
  ...scale("easing", easing),
  ...scale("opacity", opacity),
  ...scale("z", zIndex),
  ...scale("layout", layout),
  ...scale("size-icon", iconSize),
  ...typeDeclarations,
  ["color-backdrop", backdrop],
  ["focus-ring-width", borderWidth[2]],
  ["focus-ring-offset", borderWidth[2]],
  ["duration-fast", duration[150]],
  ["duration-normal", duration[200]],
  ["duration-moderate", duration[250]],
  ["duration-slow", duration[300]],
];

function modeDeclarations(mode: ColorMode): Declarations {
  const base = Object.entries(baseThemes[mode]).map(([name, value]): readonly [string, string] => [
    `color-${name}`,
    value,
  ]);
  const status = Object.entries(statusIntents(mode)).flatMap(([intent, tokens]) =>
    intentDeclarations(intent, tokens),
  );
  return [["color-scheme", mode], ...base, ...status, ...Object.entries(modeEffects(mode))];
}

function brandDeclarations(brand: BrandTheme, mode: ColorMode): Declarations {
  const tokens = brandIntent(brand, mode);
  return [
    ...intentDeclarations("primary", tokens),
    ["color-focus-ring", tokens.solid],
    ...Object.entries(brandEffects(brand, mode)),
  ];
}

const contrastDeclarations = (mode: ColorMode): Declarations =>
  Object.entries(highContrastOverrides[mode]).map(([name, value]) => [`color-${name}`, value]);

const normalContrastDeclarations = (mode: ColorMode): Declarations =>
  Object.keys(highContrastOverrides[mode]).map((name) => [
    `color-${name}`,
    baseThemes[mode][name as keyof BaseTokens],
  ]);

const attr = (name: string, value: string) => `[data-ac-${name}="${value}"]`;
const DARK = attr("mode", "dark");
const LIGHT = attr("mode", "light");

/**
 * Brand rules are generated for every nesting order of theme and mode, so a dark zone
 * inside a light page (or the reverse) keeps the brand of its closest theme.
 */
function brandRules(brand: BrandTheme): string[] {
  const theme = attr("theme", brand);
  const isDefault = brand === DEFAULT_BRAND;
  const light = [...(isDefault ? [":root", LIGHT] : []), theme, `${theme} ${LIGHT}`];
  const dark = [
    ...(isDefault ? [DARK] : []),
    `${DARK}${theme}`,
    `${DARK} ${theme}`,
    `${theme} ${DARK}`,
  ];
  return [
    rule(light, brandDeclarations(brand, "light")),
    rule(dark, brandDeclarations(brand, "dark")),
  ];
}

function systemPreferenceRules(): string {
  const auto = ":root:not([data-ac-mode])";
  const themed = BRAND_NAMES.filter((brand) => brand !== DEFAULT_BRAND).map((brand) =>
    rule(
      [`${auto}${attr("theme", brand)}`, `${auto} ${attr("theme", brand)}`],
      brandDeclarations(brand, "dark"),
      "  ",
    ),
  );
  return media("(prefers-color-scheme: dark)", [
    rule([auto], [...modeDeclarations("dark"), ...brandDeclarations(DEFAULT_BRAND, "dark")], "  "),
    ...themed,
  ]);
}

function contrastRules(): string[] {
  const more = attr("contrast", "more");
  const normal = attr("contrast", "normal");
  return [
    rule([more], contrastDeclarations("light")),
    rule([`${DARK}${more}`, `${DARK} ${more}`, `${more} ${DARK}`], contrastDeclarations("dark")),
    rule([`${LIGHT}${more}`], contrastDeclarations("light")),
    rule([normal], normalContrastDeclarations("light")),
    rule(
      [`${DARK}${normal}`, `${DARK} ${normal}`, `${normal} ${DARK}`],
      normalContrastDeclarations("dark"),
    ),
    rule([`${LIGHT}${normal}`], normalContrastDeclarations("light")),
    media("(prefers-contrast: more)", [
      rule([":root:not([data-ac-contrast])"], contrastDeclarations("light"), "  "),
      rule([`:root:not([data-ac-contrast])${DARK}`], contrastDeclarations("dark"), "  "),
    ]),
  ];
}

function variantRules<T extends string>(
  name: string,
  variants: Readonly<Record<T, Readonly<Record<string, string>>>>,
  fallback: T,
): string[] {
  return (Object.keys(variants) as T[]).map((variant) =>
    rule(
      variant === fallback ? [":root", attr(name, variant)] : [attr(name, variant)],
      Object.entries(variants[variant]),
    ),
  );
}

/** Maps `data-tone` to generic `--ac-tone-*` variables that every toned component reads. */
const toneRules = (): string[] =>
  INTENTS.map((intent) =>
    rule(
      [`[data-tone="${intent}"]`],
      INTENT_ROLES.map((role) => [
        `tone-${role}`,
        `var(${toCssVariable(`color-${intent}-${role}`)})`,
      ]),
    ),
  );

/** Renders the whole token stylesheet. Deterministic: same tokens, same output. */
export function renderTokensCss(): string {
  const blocks = [
    "/* Generated by @atomscraft/tokens. Do not edit by hand: run `pnpm generate`. */",
    rule([":root"], foundationDeclarations),
    ...variantRules("density", densities, DEFAULT_DENSITY),
    ...variantRules("shape", shapes, DEFAULT_SHAPE),
    rule([":root", LIGHT], modeDeclarations("light")),
    rule([DARK], modeDeclarations("dark")),
    ...BRAND_NAMES.flatMap(brandRules),
    systemPreferenceRules(),
    ...contrastRules(),
    ...toneRules(),
  ];
  return `${blocks.join("\n\n")}\n`;
}

/** The appearance axes a provider controls. They map to the `data-ac-*` attributes. */

export type ColorMode = "light" | "dark" | "system";
export type ResolvedColorMode = "light" | "dark";
export type Density = "compact" | "comfortable" | "spacious";
export type Shape = "rounded" | "sharp" | "pill";
export type Contrast = "normal" | "more";

export const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

/** `system` follows the operating system; the other modes are taken as they are. */
export const resolveColorMode = (mode: ColorMode, prefersDark: boolean): ResolvedColorMode =>
  mode === "system" ? (prefersDark ? "dark" : "light") : mode;

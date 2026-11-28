/**
 * Primitive tokens: the raw inventory of values.
 * Only semantic tokens reference them; components never do.
 */

export type Shade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export type Palette = Readonly<Record<Shade, string>>;

export const white = "#ffffff";
export const black = "#000000";

export const palettes = {
  /** Graphite: a faintly cool neutral, so surfaces read crisp rather than grey. */
  neutral: {
    50: "#fafafb",
    100: "#f4f4f6",
    200: "#e6e6ea",
    300: "#d3d3da",
    400: "#a0a0ab",
    500: "#70707b",
    600: "#51515b",
    700: "#3d3d46",
    800: "#26262d",
    900: "#17171c",
    950: "#0b0b0e",
  },
  indigo: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b",
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },
  violet: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
    950: "#2e1065",
  },
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22",
  },
  teal: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
    950: "#042f2e",
  },
  rose: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
    950: "#4c0519",
  },
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
  },
  orange: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
    950: "#431407",
  },
  sky: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49",
  },
  cyan: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
    950: "#083344",
  },
  fuchsia: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
    950: "#4a044e",
  },
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
  },
} as const satisfies Record<string, Palette>;

export type PaletteName = keyof typeof palettes;

/** 4px grid. The key is the multiple of 4px. */
export const space = {
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
} as const;

export const fontFamily = {
  sans: '"Inter", "Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Arabic", sans-serif',
  /** Headlines: optical display cuts when the application loads them, the text face otherwise. */
  display:
    '"Inter Display", "Geist", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Arabic", sans-serif',
  mono: '"JetBrains Mono", "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
} as const;

/** OpenType features: Inter's open digits and disambiguated glyphs; ignored by other faces. */
export const fontFeatures = {
  text: '"cv02", "cv03", "cv04", "cv11"',
  display: '"cv02", "cv03", "cv04", "cv11", "ss01"',
  tabular: '"tnum", "cv11"',
} as const;

/** Modular scale around a 16px body (ratio ~1.2). */
export const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const lineHeight = {
  none: "1",
  tighter: "1.1",
  tight: "1.2",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.65",
} as const;

export const letterSpacing = {
  tightest: "-0.035em",
  tighter: "-0.025em",
  tight: "-0.012em",
  snug: "-0.006em",
  normal: "0",
  wide: "0.04em",
  wider: "0.08em",
} as const;

export const radius = {
  none: "0",
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
} as const;

export const borderWidth = {
  0: "0",
  1: "1px",
  2: "2px",
  4: "4px",
} as const;

type ShadowScale = Readonly<
  Record<"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "inner" | "highlight", string>
>;

/**
 * Layered shadows: a tight contact shadow plus a soft ambient one. Light mode uses an
 * ink-tinted shadow; dark mode needs deeper shadows and a faint top edge light, because
 * a dark shadow alone disappears on a dark canvas.
 */
export const shadows: Readonly<Record<"light" | "dark", ShadowScale>> = {
  light: {
    xs: "0 1px 2px 0 rgb(17 17 26 / 0.05)",
    sm: "0 1px 2px 0 rgb(17 17 26 / 0.06), 0 1px 3px 0 rgb(17 17 26 / 0.08)",
    md: "0 1px 2px 0 rgb(17 17 26 / 0.05), 0 4px 8px -2px rgb(17 17 26 / 0.08)",
    lg: "0 2px 4px -1px rgb(17 17 26 / 0.05), 0 12px 24px -6px rgb(17 17 26 / 0.12)",
    xl: "0 4px 8px -2px rgb(17 17 26 / 0.06), 0 24px 40px -10px rgb(17 17 26 / 0.16)",
    "2xl": "0 8px 16px -4px rgb(17 17 26 / 0.08), 0 40px 72px -16px rgb(17 17 26 / 0.26)",
    inner: "inset 0 1px 2px 0 rgb(17 17 26 / 0.06)",
    highlight: "inset 0 1px 0 rgb(255 255 255 / 0.16)",
  },
  dark: {
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.32)",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.36), 0 1px 3px 0 rgb(0 0 0 / 0.28)",
    md: "inset 0 1px 0 rgb(255 255 255 / 0.03), 0 1px 2px 0 rgb(0 0 0 / 0.32), 0 4px 8px -2px rgb(0 0 0 / 0.36)",
    lg: "inset 0 1px 0 rgb(255 255 255 / 0.04), 0 2px 4px -1px rgb(0 0 0 / 0.36), 0 12px 24px -6px rgb(0 0 0 / 0.5)",
    xl: "inset 0 1px 0 rgb(255 255 255 / 0.05), 0 4px 8px -2px rgb(0 0 0 / 0.4), 0 24px 40px -10px rgb(0 0 0 / 0.56)",
    "2xl":
      "inset 0 1px 0 rgb(255 255 255 / 0.06), 0 8px 16px -4px rgb(0 0 0 / 0.44), 0 40px 72px -16px rgb(0 0 0 / 0.64)",
    inner: "inset 0 1px 2px 0 rgb(0 0 0 / 0.32)",
    highlight: "inset 0 1px 0 rgb(255 255 255 / 0.12)",
  },
};

/** Light-mode shadows, kept as the mode-independent export earlier releases shipped. */
export const shadow = shadows.light;

/** Dimmed layer behind modal dialogs. */
export const backdrop = "rgb(11 11 14 / 0.56)";

/** Background blur for translucent layers (sticky headers, overlays, glass surfaces). */
export const blur = {
  sm: "4px",
  md: "12px",
  lg: "24px",
} as const;

export const duration = {
  0: "0ms",
  75: "75ms",
  100: "100ms",
  150: "150ms",
  200: "200ms",
  250: "250ms",
  300: "300ms",
  500: "500ms",
} as const;

export const easing = {
  linear: "linear",
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  emphasized: "cubic-bezier(0.3, 0, 0, 1.2)",
  decelerate: "cubic-bezier(0, 0, 0, 1)",
  accelerate: "cubic-bezier(0.3, 0, 1, 1)",
  /** Gentle overshoot for things that pop in: toggles, toasts, menus. */
  spring: "cubic-bezier(0.34, 1.4, 0.64, 1)",
  /** Symmetric ease for state changes that go both ways. */
  smooth: "cubic-bezier(0.45, 0, 0.25, 1)",
} as const;

export const opacity = {
  disabled: "0.5",
  overlay: "0.6",
} as const;

/** Named layers: free numeric z-index values are not allowed in components. */
export const zIndex = {
  base: "0",
  raised: "1",
  sticky: "100",
  overlay: "300",
  modal: "400",
  popover: "500",
  toast: "600",
  tooltip: "700",
} as const;

/** Breakpoints cannot be CSS variables inside media queries; they document the values used. */
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

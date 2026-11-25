import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useControllableState, useMediaQuery } from "../hooks";
import { ar, en, fr } from "./messages";
import type { Messages } from "./messages";
import { DARK_SCHEME_QUERY, resolveColorMode } from "./theme";
import type { ColorMode, Density, ResolvedColorMode, Shape } from "./theme";

export type Direction = "ltr" | "rtl";

type AtomCraftContextValue = {
  messages: Messages;
  dir: Direction;
  locale: string;
  setLocale: (locale: string) => void;
  /** The chosen mode, which may be `system`. */
  mode: ColorMode;
  /** The mode actually applied, after resolving `system`. */
  resolvedMode: ResolvedColorMode;
  setMode: (mode: ColorMode) => void;
  theme: string | undefined;
  setTheme: (theme: string) => void;
  density: Density | undefined;
  setDensity: (density: Density) => void;
  shape: Shape | undefined;
  setShape: (shape: Shape) => void;
  portalContainer: HTMLElement | null;
};

const noop = () => undefined;

const AtomCraftContext = createContext<AtomCraftContextValue>({
  messages: en,
  dir: "ltr",
  locale: "en",
  setLocale: noop,
  mode: "system",
  resolvedMode: "light",
  setMode: noop,
  theme: undefined,
  setTheme: noop,
  density: undefined,
  setDensity: noop,
  shape: undefined,
  setShape: noop,
  portalContainer: null,
});

export type AtomCraftProviderProps = {
  children: ReactNode;
  /** BCP 47 locale, e.g. "fr-TN" or "ar-TN". Controlled when set. */
  locale?: string | undefined;
  defaultLocale?: string;
  onLocaleChange?: ((locale: string) => void) | undefined;
  /** Text direction. Defaults to RTL for Arabic, Hebrew, Persian and Urdu locales. */
  dir?: Direction;
  /** Overrides some or all built-in labels (English, French and Arabic are included). */
  messages?: Partial<Messages>;
  /** `system` follows the operating system setting. Controlled when set. */
  mode?: ColorMode | undefined;
  /** Defaults to `system`. */
  defaultMode?: ColorMode;
  onModeChange?: ((mode: ColorMode) => void) | undefined;
  theme?: string | undefined;
  defaultTheme?: string | undefined;
  onThemeChange?: ((theme: string) => void) | undefined;
  density?: Density | undefined;
  defaultDensity?: Density | undefined;
  shape?: Shape | undefined;
  defaultShape?: Shape | undefined;
};

const RTL_LANGUAGES = new Set(["ar", "he", "fa", "ur"]);
const BUILT_IN_MESSAGES: Readonly<Record<string, Messages>> = { en, fr, ar };

const languageOf = (locale: string): string => locale.split("-")[0]?.toLowerCase() ?? "en";
const directionOf = (locale: string): Direction =>
  RTL_LANGUAGES.has(languageOf(locale)) ? "rtl" : "ltr";

/** Appearance and locale state, each axis controlled or owned by the provider. */
function useAppearance(props: Omit<AtomCraftProviderProps, "children" | "dir" | "messages">) {
  const [locale, setLocale] = useControllableState({
    value: props.locale,
    defaultValue: props.defaultLocale ?? "en",
    onChange: props.onLocaleChange,
  });
  const [mode, setMode] = useControllableState<ColorMode>({
    value: props.mode,
    defaultValue: props.defaultMode ?? "system",
    onChange: props.onModeChange,
  });
  const [theme, setTheme] = useControllableState<string | undefined>({
    value: props.theme,
    defaultValue: props.defaultTheme,
    onChange: props.onThemeChange as ((theme: string | undefined) => void) | undefined,
  });
  const [density, setDensity] = useControllableState<Density | undefined>({
    value: props.density,
    defaultValue: props.defaultDensity,
  });
  const [shape, setShape] = useControllableState<Shape | undefined>({
    value: props.shape,
    defaultValue: props.defaultShape,
  });
  return useMemo(
    () => ({
      locale,
      setLocale,
      mode,
      setMode,
      theme,
      setTheme,
      density,
      setDensity,
      shape,
      setShape,
    }),
    [locale, setLocale, mode, setMode, theme, setTheme, density, setDensity, shape, setShape],
  );
}

/**
 * Scopes locale, direction, labels and theme attributes to its subtree.
 * Portaled layers render inside it, so they inherit the same theme.
 *
 * Providers nest: an inner one can show a dark panel inside a light page.
 */
export function AtomCraftProvider({ children, dir, messages, ...props }: AtomCraftProviderProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const appearance = useAppearance(props);
  const prefersDark = useMediaQuery(DARK_SCHEME_QUERY);
  const resolvedMode = resolveColorMode(appearance.mode, prefersDark);
  const resolvedDir = dir ?? directionOf(appearance.locale);

  const value = useMemo(
    () => ({
      ...appearance,
      messages: { ...(BUILT_IN_MESSAGES[languageOf(appearance.locale)] ?? en), ...messages },
      dir: resolvedDir,
      resolvedMode,
      portalContainer,
    }),
    [appearance, messages, resolvedDir, resolvedMode, portalContainer],
  );

  return (
    <AtomCraftContext.Provider value={value}>
      <div
        className="ac-root"
        dir={resolvedDir}
        lang={appearance.locale}
        data-ac-mode={resolvedMode}
        data-ac-theme={appearance.theme}
        data-ac-density={appearance.density}
        data-ac-shape={appearance.shape}
      >
        {children}
        <div ref={setPortalContainer} data-slot="portal-root" />
      </div>
    </AtomCraftContext.Provider>
  );
}

export const useAtomCraft = (): AtomCraftContextValue => useContext(AtomCraftContext);
export const useMessages = (): Messages => useContext(AtomCraftContext).messages;

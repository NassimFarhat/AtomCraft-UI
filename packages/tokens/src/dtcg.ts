import { palettes } from "./primitives";
import { BRAND_NAMES, baseThemes, brandIntent, statusIntents } from "./semantic";
import type { ColorMode, IntentTokens } from "./semantic";

/** Export in the W3C Design Tokens Community Group format, for Figma and other tools. */

type DtcgToken = { $type: "color"; $value: string };
type DtcgGroup = { [key: string]: DtcgToken | DtcgGroup };

const color = (value: string): DtcgToken => ({ $type: "color", $value: value });

const group = (values: Readonly<Record<string | number, string>>): DtcgGroup =>
  Object.fromEntries(Object.entries(values).map(([key, value]) => [key, color(value)]));

const intentGroup = (tokens: IntentTokens): DtcgGroup => group(tokens);

function modeGroup(mode: ColorMode): DtcgGroup {
  const status = Object.fromEntries(
    Object.entries(statusIntents(mode)).map(([name, tokens]) => [name, intentGroup(tokens)]),
  );
  const brands = Object.fromEntries(
    BRAND_NAMES.map((brand) => [brand, intentGroup(brandIntent(brand, mode))]),
  );
  return { base: group(baseThemes[mode]), status, brand: brands };
}

export function renderDtcgJson(): string {
  const document = {
    primitive: {
      color: Object.fromEntries(
        Object.entries(palettes).map(([name, palette]) => [name, group(palette)]),
      ),
    },
    semantic: { light: modeGroup("light"), dark: modeGroup("dark") },
  };
  return `${JSON.stringify(document, null, 2)}\n`;
}

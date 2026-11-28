import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";
import { brandEffects, gradientStops, modeEffects } from "./effects";
import {
  BRAND_GRADIENT_PARTNERS,
  BRAND_NAMES,
  BRAND_THEMES,
  baseThemes,
  brandIntent,
} from "./semantic";
import type { ColorMode } from "./semantic";

const modes: ColorMode[] = ["light", "dark"];

describe.each(modes)("%s mode effects", (mode) => {
  it.each(BRAND_NAMES)("%s: text-gradient stops are readable fills and readable text", (brand) => {
    const stops = gradientStops(BRAND_THEMES[brand], BRAND_GRADIENT_PARTNERS[brand], mode);
    const onSolid = brandIntent(brand, mode).onSolid;
    const canvas = baseThemes[mode].bgCanvas;
    for (const stop of [stops.text.from, stops.text.to]) {
      expect(contrastRatio(onSolid, stop), `${onSolid} on ${stop}`).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(stop, canvas), `${stop} on ${canvas}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(BRAND_NAMES)("%s: declares every brand effect", (brand) => {
    const effects = brandEffects(brand, mode);
    for (const name of [
      "brand",
      "brand-text",
      "brand-soft",
      "brand-border",
      "brand-glow",
      "brand-mesh",
    ]) {
      expect(effects[`gradient-${name}`]).toBeTruthy();
    }
  });

  it("maps every elevation to a shadow of the same mode", () => {
    const effects = modeEffects(mode);
    expect(effects["elevation-dialog"]).toBe(effects["shadow-2xl"]);
    expect(effects["elevation-flat"]).toBe("none");
  });
});

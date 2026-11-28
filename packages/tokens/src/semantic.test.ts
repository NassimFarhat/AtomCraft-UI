import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";
import {
  BRAND_NAMES,
  baseThemes,
  brandIntent,
  chartColors,
  highContrastOverrides,
  readablePairs,
  statusIntents,
} from "./semantic";
import type { ColorMode } from "./semantic";

const modes: ColorMode[] = ["light", "dark"];
const HEX = /^#[0-9a-f]{6}$/i;

describe.each(modes)("%s mode", (mode) => {
  const base = baseThemes[mode];
  const status = statusIntents(mode);

  it("only uses 6-digit hex colors", () => {
    const values = [...Object.values(base), ...Object.values(status).flatMap(Object.values)];
    values.forEach((value) => expect(value).toMatch(HEX));
  });

  it.each(BRAND_NAMES)("%s brand: every rendered pair meets its WCAG minimum", (brand) => {
    const primary = brandIntent(brand, mode);
    const intents = { ...status, primary };
    for (const [foreground, background, minimum] of readablePairs(base, intents, primary.solid)) {
      const ratio = contrastRatio(foreground, background);
      expect(ratio, `${foreground} on ${background}`).toBeGreaterThanOrEqual(minimum);
    }
  });

  it("chart series clear 3:1 on every surface (WCAG 1.4.11)", () => {
    for (const color of chartColors(mode)) {
      for (const surface of [base.bgCanvas, base.bgSurface, base.bgSurfaceRaised]) {
        expect(contrastRatio(color, surface), `${color} on ${surface}`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("orders surfaces and text so each step is distinguishable", () => {
    expect(base.textSecondary).not.toBe(base.textTertiary);
    expect(contrastRatio(base.textPrimary, base.bgCanvas)).toBeGreaterThan(
      contrastRatio(base.textSecondary, base.bgCanvas),
    );
    expect(contrastRatio(base.textSecondary, base.bgCanvas)).toBeGreaterThan(
      contrastRatio(base.textTertiary, base.bgCanvas),
    );
  });

  it("high contrast raises secondary text to at least 7:1 (AAA)", () => {
    const merged = { ...base, ...highContrastOverrides[mode] };
    expect(contrastRatio(merged.textSecondary, merged.bgCanvas)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(merged.borderControl, merged.bgCanvas)).toBeGreaterThanOrEqual(4.5);
  });
});

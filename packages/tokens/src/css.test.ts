import { describe, expect, it } from "vitest";
import { renderTokensCss, toCssVariable } from "./css";
import { renderDtcgJson } from "./dtcg";
import { DENSITIES, SHAPES } from "./scales";
import { BRAND_NAMES, INTENTS } from "./semantic";

describe("toCssVariable", () => {
  it.each([
    ["color-primaryForeground", "--ac-color-primary-foreground"],
    ["space-0.5", "--ac-space-0-5"],
  ])("%s -> %s", (name, expected) => {
    expect(toCssVariable(name)).toBe(expected);
  });
});

describe("renderTokensCss", () => {
  const css = renderTokensCss();

  it("declares light, dark and system-driven modes", () => {
    expect(css).toContain('[data-ac-mode="dark"] {');
    expect(css).toContain("@media (prefers-color-scheme: dark)");
    expect(css).toContain("color-scheme: dark;");
  });

  it.each(BRAND_NAMES)("declares the %s brand for both modes", (brand) => {
    expect(css).toContain(`[data-ac-theme="${brand}"]`);
    expect(css).toContain(`[data-ac-mode="dark"] [data-ac-theme="${brand}"]`);
  });

  it.each([...DENSITIES.map((d) => `density="${d}"`), ...SHAPES.map((s) => `shape="${s}"`)])(
    "declares data-ac-%s",
    (selector) => {
      expect(css).toContain(`[data-ac-${selector}]`);
    },
  );

  it.each(INTENTS)("maps data-tone=%s to the generic tone variables", (intent) => {
    expect(css).toContain(`[data-tone="${intent}"] {`);
    expect(css).toContain(`--ac-tone-solid: var(--ac-color-${intent}-solid);`);
  });

  it("supports high contrast", () => {
    expect(css).toContain('[data-ac-contrast="more"]');
    expect(css).toContain('[data-ac-contrast="normal"]');
    expect(css).toContain("@media (prefers-contrast: more)");
  });

  it("is deterministic", () => {
    expect(renderTokensCss()).toBe(css);
  });
});

describe("renderDtcgJson", () => {
  it("uses the DTCG $type/$value shape", () => {
    const document = JSON.parse(renderDtcgJson());
    expect(document.primitive.color.indigo["600"]).toEqual({ $type: "color", $value: "#4f46e5" });
    expect(document.semantic.dark.brand.rose.solid.$type).toBe("color");
  });
});

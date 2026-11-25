import axe from "axe-core";
import { expect } from "vitest";

/** Rules that need a real browser layout (jsdom has none) are covered in Storybook instead. */
const BROWSER_ONLY_RULES = { "color-contrast": { enabled: false }, region: { enabled: false } };

export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe.run(container, { rules: BROWSER_ONLY_RULES });
  const summary = results.violations.map((violation) => `${violation.id}: ${violation.help}`);
  expect(summary).toEqual([]);
}

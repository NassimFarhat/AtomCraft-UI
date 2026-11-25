/** WCAG 2.2 relative luminance and contrast ratio helpers. */

const HEX_COLOR = /^#([0-9a-f]{6})$/i;

/** Minimum contrast ratio for normal text at level AA. */
export const WCAG_AA_NORMAL_TEXT = 4.5;

type Rgb = readonly [number, number, number];

export function hexToRgb(hex: string): Rgb {
  const match = HEX_COLOR.exec(hex);
  if (!match?.[1]) {
    throw new Error(`Expected a 6-digit hex color, received "${hex}".`);
  }
  const value = parseInt(match[1], 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function toLinearChannel(channel: number): number {
  const ratio = channel / 255;
  return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const [red, green, blue] = hexToRgb(hex).map(toLinearChannel) as [number, number, number];
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(foreground: string, background: string): number {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

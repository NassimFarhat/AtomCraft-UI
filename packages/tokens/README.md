# @atomscraft/tokens

Typed design tokens for AtomCraft themes, densities, shapes, contrast modes and
DTCG export. Use this package when you need the design values or want to build
your own renderer on top of the AtomCraft visual system.

## Install

```bash
npm install @atomscraft/tokens
```

## What is included?

- Primitive color palettes, spacing, typography, radius, shadows and motion
- Semantic light and dark intent tokens
- Eight brand themes: indigo, blue, violet, emerald, teal, rose, orange and mono
- Compact, comfortable and spacious density scales
- Rounded, sharp and pill shape scales
- Contrast helpers and readable color-pair calculations
- CSS-variable and DTCG JSON renderers

## Example

```ts
import { BRAND_NAMES, densities, renderDtcgJson, renderTokensCss } from "@atomscraft/tokens";

console.log(BRAND_NAMES); // available brand themes
console.log(densities.comfortable); // density values

const css = renderTokensCss();
const dtcg = renderDtcgJson();
```

The package also exposes `@atomscraft/tokens/tokens.json` for tools that read
Design Tokens Community Group (DTCG) JSON directly:

```ts
import tokens from "@atomscraft/tokens/tokens.json";
```

## When should I use it?

Use tokens directly when creating custom components, exporting values to a
design tool, or synchronizing another platform with AtomCraft. Most React users
should install `@atomscraft/react` and `@atomscraft/css`, which already consume
these tokens.

## Related packages

- [`@atomscraft/css`](https://www.npmjs.com/package/@atomscraft/css) - CSS variables and component styles
- [`@atomscraft/react`](https://www.npmjs.com/package/@atomscraft/react) - React components
- [`@atomscraft/core`](https://www.npmjs.com/package/@atomscraft/core) - framework-agnostic behavior

Documentation and examples: [AtomCraft UI on GitHub](https://github.com/NassimFarhat/AtomCraft-UI).

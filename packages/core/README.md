# @atomscraft/core

Framework-agnostic behavior primitives used by AtomCraft components. Use this
package when you need the interaction and data logic without React or CSS.

## Install

```bash
npm install @atomscraft/core
```

## What is included?

- Position calculations for popovers, menus and floating elements
- Keyboard navigation and typeahead helpers for list-like controls
- Date and calendar helpers, including ISO conversion and date ranges
- Filtering and text matching helpers
- Pagination and slider calculations
- Focusable-element discovery
- Small state-store, clipboard, class-name and data-attribute utilities

Everything is typed and has no React or DOM rendering dependency.

## Example

```ts
import { computePosition, getPageItems, snapToStep } from "@atomscraft/core";

const pageItems = getPageItems(3, 20);
const sliderValue = snapToStep(42, { min: 0, max: 100, step: 5 });

const position = computePosition(
  { x: 100, y: 80, width: 40, height: 32 },
  { width: 240, height: 120 },
  { width: 1024, height: 768 },
  { side: "bottom", align: "start", offset: 8 },
);
```

The exact options and return types are available through TypeScript
autocomplete. The source implementation and tests are in the repository.

## When should I use it?

Use `@atomscraft/core` to build a custom renderer, integrate AtomCraft behavior
into another framework, or share interaction logic between platforms. For ready-
made React components, install `@atomscraft/react` and `@atomscraft/css`.

## Related packages

- [`@atomscraft/react`](https://www.npmjs.com/package/@atomscraft/react) - React components
- [`@atomscraft/css`](https://www.npmjs.com/package/@atomscraft/css) - generated styles
- [`@atomscraft/tokens`](https://www.npmjs.com/package/@atomscraft/tokens) - design tokens

Documentation and examples: [AtomCraft UI on GitHub](https://github.com/NassimFarhat/AtomCraft-UI).

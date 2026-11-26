# @atomscraft/css

Generated AtomCraft design-system styles. The package provides the `ac-*`
utility and component classes plus semantic `--ac-*` CSS variables used by the
React components.

## Install

```bash
npm install @atomscraft/css
```

Import the complete stylesheet once at your application entry point, before
rendering AtomCraft components:

```ts
import "@atomscraft/css";
```

The package also exposes the token stylesheet separately:

```ts
import "@atomscraft/css/tokens.css";
```

## What is included?

- Reset and base styles
- Semantic light/dark color variables
- Brand themes, density, shape and contrast variables
- Styles for AtomCraft fields, buttons, overlays, tables, navigation and layout
- Logical properties for RTL support
- `ac-*` classes and `--ac-*` variables with no external UI dependency

## Using it with React

Install the React package alongside the stylesheet:

```bash
npm install @atomscraft/react @atomscraft/css
```

```tsx
import "@atomscraft/css";
import { AtomCraftProvider, Button } from "@atomscraft/react";

export function App() {
  return (
    <AtomCraftProvider mode="light" theme="indigo">
      <Button>Continue</Button>
    </AtomCraftProvider>
  );
}
```

The provider sets the `data-ac-*` attributes consumed by the stylesheet. You
normally do not need to import individual component CSS files.

## Related packages

- [`@atomscraft/react`](https://www.npmjs.com/package/@atomscraft/react) - accessible React components
- [`@atomscraft/tokens`](https://www.npmjs.com/package/@atomscraft/tokens) - source design tokens
- [`@atomscraft/core`](https://www.npmjs.com/package/@atomscraft/core) - framework-agnostic behavior

Documentation and examples: [AtomCraft UI on GitHub](https://github.com/NassimFarhat/AtomCraft-UI).

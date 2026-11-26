# @atomscraft/react

Accessible React components, hooks, icons, layouts and templates for AtomCraft.
The library follows Atomic Design: small atoms compose into molecules,
organisms and application templates.

## Install

```bash
npm install @atomscraft/react @atomscraft/css
```

React and React DOM are peer dependencies and must be installed by the host
application. React 18 or newer is supported.

## Quick start

```tsx
import "@atomscraft/css";
import { AtomCraftProvider, Button, Field, Input, ThemeSwitcher, Toaster } from "@atomscraft/react";

export function App() {
  return (
    <AtomCraftProvider locale="en" mode="system" theme="indigo">
      <Field label="Email" description="Use your work email." required>
        <Input type="email" />
      </Field>
      <Button type="submit">Continue</Button>
      <ThemeSwitcher />
      <Toaster />
    </AtomCraftProvider>
  );
}
```

Import `@atomscraft/css` once, wrap the application with
`AtomCraftProvider`, then compose the components you need. Components receive
data through props and emit events; application state and data fetching stay in
your application.

## What is included?

- **Atoms:** Button, Input, Checkbox, Radio, Select, Slider, Switch, Badge,
  Avatar, Typography, Progress, Spinner and icons
- **Molecules:** Field, Calendar, DatePicker, Combobox, SelectMenu, Tabs,
  DropdownMenu, Dialog helpers, Card, Toast, Tooltip, Pagination and more
- **Organisms:** Dialog, AlertDialog, CommandPalette, DataTable, Form, Header,
  Sidebar, Table, Sheet and theme/locale switchers
- **Layout:** Stack, Grid and Container
- **Templates:** AppShell
- **Hooks and utilities:** controllable state, positioning, roving focus,
  typeahead, portals, slots and visually hidden content

## Themes, direction and density

`AtomCraftProvider` controls the visual and localization axes:

```tsx
<AtomCraftProvider
  locale="ar"
  mode="dark"
  theme="violet"
  density="comfortable"
  shape="rounded"
  contrast="more"
>
  {/* Arabic automatically uses RTL direction. */}
</AtomCraftProvider>
```

Supported themes are `indigo`, `blue`, `violet`, `emerald`, `teal`, `rose`,
`orange` and `mono`. Modes are `light`, `dark` and `system`; densities are
`compact`, `comfortable` and `spacious`; shapes are `rounded`, `sharp` and
`pill`.

## Choosing a picker

- Use `Select` for a native browser select.
- Use `SelectMenu` for a custom picker with icons and descriptions.
- Use `Combobox` or `MultiSelect` when users need to type and filter options.
- Use `Calendar` or `DatePicker` for date selection.

## Accessibility and customization

Components expose typed props, forwarded refs, `className`, `data-slot` and
state `data-*` attributes. Keyboard interactions follow WAI-ARIA patterns, and
the package includes behavior and accessibility tests. Use the provider
messages or component props for labels instead of hardcoding application text.

## Related packages

- [`@atomscraft/css`](https://www.npmjs.com/package/@atomscraft/css) - required generated styles
- [`@atomscraft/tokens`](https://www.npmjs.com/package/@atomscraft/tokens) - design tokens
- [`@atomscraft/core`](https://www.npmjs.com/package/@atomscraft/core) - behavior primitives

Full component examples are available in the
[AtomCraft Storybook](https://github.com/NassimFarhat/AtomCraft-UI) and the
[GitHub repository](https://github.com/NassimFarhat/AtomCraft-UI).

# AtomCraft

A zero-dependency, accessible design system built with Atomic Design, in TypeScript.
Works with React and Next.js today; the behavior core is framework-agnostic.

## Packages

| Package              | Role                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| `@atomscraft/tokens` | Primitive palettes, semantic tokens, 8 brand themes, densities, shapes, DTCG export                             |
| `@atomscraft/css`    | Generated `--ac-*` variables and the `ac-*` component styles                                                    |
| `@atomscraft/core`   | Framework-agnostic behavior: positioning, keyboard navigation, dates, filtering, slider math, pagination, store |
| `@atomscraft/react`  | Atoms, molecules, organisms, layout primitives and templates                                                    |
| `apps/storybook`     | Living documentation: foundations, every component, full example pages                                          |

## Components

| Layer     | Components                                                                                                                                                                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Atoms     | Avatar, Badge, Button, IconButton, Checkbox, Heading, Icon, Input, Kbd, Label, Link, Progress, ProgressCircle, Radio, Select, Separator, Skeleton, Slider, SliderRange, Spinner, Switch, Tag, Text, Textarea, 48 icons                                                         |
| Molecules | Accordion, Alert, AvatarGroup, Breadcrumb, Calendar, Card, CodeBlock, Combobox, CopyButton, DatePicker, DropdownMenu, EmptyState, Field, InputGroup, MultiSelect, NavItem, Pagination, PasswordInput, Popover, RadioGroup, SearchField, SelectMenu, Stat, Tabs, Toast, Tooltip |
| Organisms | AlertDialog, CommandPalette, DataTable, Dialog, ErrorSummary, Form, Header, LocaleSwitcher, Sheet, Sidebar, Table, ThemeSwitcher                                                                                                                                               |
| Layout    | Stack, Grid, Container                                                                                                                                                                                                                                                         |
| Templates | AppShell                                                                                                                                                                                                                                                                       |

Every component: typed props with defaults, `ref`, `className`, `data-slot`, state as `data-*`,
keyboard support following WAI-ARIA patterns, RTL, light/dark, and tests (behavior + axe).

Three components pick the list apart in different ways, so the choice is explicit:
`Select` is the native picker, `SelectMenu` the custom one with icons and descriptions,
and `Combobox` (with `MultiSelect`) the one you can type in to filter.

## Usage

For a React application, install the component package and its stylesheet:

```bash
npm install @atomscraft/react @atomscraft/css
```

Use `@atomscraft/core` when you only need framework-agnostic behavior, and use
`@atomscraft/tokens` when you need the design values or DTCG export directly.

```tsx
import "@atomscraft/css";
import {
  AtomCraftProvider,
  Button,
  Field,
  Input,
  ThemeSwitcher,
  Toaster,
  toast,
} from "@atomscraft/react";

export function App() {
  return (
    <AtomCraftProvider locale="fr-TN" mode="light" theme="indigo" density="comfortable">
      <Field label="Email" description="Adresse professionnelle." required>
        <Input type="email" />
      </Field>
      <Button onClick={() => toast.success("Enregistré")}>Enregistrer</Button>
      <ThemeSwitcher />
      <Toaster />
    </AtomCraftProvider>
  );
}
```

The provider owns the appearance: `mode` (light, dark, `system` by default, which follows the
operating system), `theme`, `density`, `shape` and `locale` are each controllable or left to it,
`contrast` can be set to `more` for the high-contrast token overrides, and `useAtomCraft()` exposes
a setter for each axis, which is what `ThemeSwitcher` and `LocaleSwitcher` use. Density and shape
also accept change callbacks when controlled by an application.

Theming is attribute-based and nestable: `data-ac-mode` (light, dark), `data-ac-theme`
(indigo, blue, violet, emerald, teal, rose, orange, mono), `data-ac-density` (compact,
comfortable, spacious), `data-ac-shape` (rounded, sharp, pill), `data-ac-contrast="more"`.
Arabic locales switch to right-to-left automatically; built-in labels exist in English, French and Arabic.

## Commands

```bash
pnpm install          # install and enable the git hooks
pnpm storybook        # documentation on http://localhost:6006
pnpm test             # unit, keyboard, contrast and accessibility tests
pnpm lint             # ESLint
pnpm typecheck        # TypeScript
pnpm generate         # regenerate tokens.css and tokens.json from the tokens
```

See `docs/CONTRIBUTING.md` for the architecture rules and the component contract.

## Documentation

- [React package guide](packages/react/README.md)
- [CSS package guide](packages/css/README.md)
- [Tokens package guide](packages/tokens/README.md)
- [Core package guide](packages/core/README.md)
- [Development status](docs/DEVELOPMENT-STATUS.md)
- [Release instructions](docs/RELEASING.md)

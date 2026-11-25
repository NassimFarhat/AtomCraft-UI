# Contributing

## Workflow

- `main` is protected: no direct pushes. Work in a branch (`feat/combobox`, `fix/menu-focus`) and open a pull request.
- The other team member reviews every pull request before merge.
- One commit = one logical step, with Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Before pushing: `pnpm lint && pnpm typecheck && pnpm test`.

## Layers and dependency rule

A layer only imports from the layers below it. Never the reverse.

```
tokens  →  css (generated variables + component styles)
core    →  pure TypeScript behavior (no DOM framework): positioning, keyboard
           navigation, dates, text filtering, slider math, pagination, store
react/src/
  provider/   locale, direction, built-in labels (en, fr, ar), appearance state and setters
  hooks/      useControllableState, useDismiss, usePosition, useRovingFocus, useFloatingLayer, useMediaQuery, useTypeahead
  utils/      Slot (asChild), refs, prop merging, Portal, VisuallyHidden, control attributes, withDefaults
  icons/      createIcon + built-in icons
  layout/     Stack, Grid, Container
  atoms/      may use icons, Spinner and utils, never another atom family
  molecules/  compose atoms (and documented molecules)
  organisms/  compose molecules and atoms
  templates/  page skeletons with landmarks (AppShell)
apps/storybook  foundations, stories and example pages (never published)
```

Components receive data and emit events: no fetch, no global store, no business logic.

## Component contract

- `forwardRef`, typed props extending the native element, `className` merged with `cn`.
- Every option has a default in the destructuring. A component with many optional
  behaviours resolves them once instead, with `withDefaults` (see DataTable), so the
  body reads `settings.paginated` rather than `props.paginated ?? false` at each use.
- One vocabulary everywhere: `variant` (solid, soft, outline, ghost, link), `tone` (primary, neutral, info, success, warning, danger), `size` (xs, sm, md, lg).
- Visual state lives in data attributes (`data-variant`, `data-tone`, `data-size`, `data-state`, `data-invalid`), styled in CSS.
- `data-slot="<name>"` on the root and on every named part.
- Ids come from `useId()`; controlled and uncontrolled through `useControllableState`.
- No user-facing text in components: props or the provider messages.
- Data values shown as text are isolated with `<bdi>` so they keep their order in RTL.
- Keyboard behavior follows the WAI-ARIA Authoring Practices pattern of the component.

## Styles and tokens

- Components use semantic tokens (`--ac-color-*`, `--ac-tone-*`, sizes, radii, elevations), never palette values.
- No raw colors in component CSS: a test fails on any hex, `rgb()` or `oklch()` value.
- Only logical properties (`inline-size`, `margin-inline-start`, `inset-inline-end`).
- `tokens.css` and `tokens.json` are generated: edit `packages/tokens/src`, then `pnpm generate`.
- Every text/background pair is checked against WCAG AA for every brand theme and both modes.

## Composite controls

A control made of several elements (Combobox, SelectMenu, DatePicker, DataTable) is split
the same way everywhere:

- a hook holds the state and the keyboard rules (`useListbox`, `useCalendarState`, `useDataTableModel`);
- small components render the parts (`ListboxContent`, `CalendarGrid`, `DataTableToolbar`);
- the exported component only wires the two together.

Shared behaviour lives in one place: `useListbox` drives Combobox, MultiSelect and
SelectMenu, `useTypeahead` serves both the menus and SelectMenu, and `controlAttributes`
writes the `data-*` state of every composite control.

## Definition of done

Types, defaults, story (all variants and states), tests (behavior, keyboard, axe),
light/dark, RTL, density and shape checked in Storybook.

## Clean code rules

- One responsibility per function or component, 60 lines max, complexity 10 max.
- Explicit names, no `any`, no dead code. Comments explain why, never what.

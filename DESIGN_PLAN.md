# AtomCraft UI — Design Analysis & Redesign Strategy

> Analysis only. No source files were changed. Baseline: `main` @ `167998c` (0.2.0 release).
> Future sessions: read this file first, then execute the phases in §5. Update the status table in §6.

## 1. Stack and structure

pnpm monorepo, zero external UI dependencies (rule in `AGENTS.md`: no Radix/shadcn/Base UI).

| Package              | Role                                                                       |
| -------------------- | -------------------------------------------------------------------------- |
| `@atomscraft/tokens` | TS source of truth → generates `css/src/tokens.css` + `tokens.json` (DTCG) |
| `@atomscraft/css`    | Plain CSS, `ac-*` classes, `--ac-*` vars, logical properties only          |
| `@atomscraft/core`   | Framework-agnostic behavior (color, number, time, tree utils…)             |
| `@atomscraft/react`  | Provider, hooks, atoms, molecules, organisms, templates                    |
| `apps/storybook`     | Docs/examples only (foundations, dashboard, sign-in)                       |

Tooling: React, TypeScript, tsup, Vitest, Storybook (Vite), ESLint 10, Prettier, Changesets.
Quality gates: `pnpm format:check`, `lint`, `typecheck`, `generate`, `test`, `build-storybook`.
Note: `docs/DEVELOPMENT-STATUS.md` mentions an `apps/studio` that does **not** exist in the repo — stale doc.

## 2. Component inventory (per `docs/DESIGN-SYSTEM-AUDIT.md`, verified against folders)

- **Atoms (~29):** Button, IconButton, Toggle, Link, Text, Heading, Icon, Label, Input, Textarea, Checkbox, Radio, Switch, Slider, Badge, Tag/Chip, Avatar, Image, Spinner, Skeleton, Progress, Meter, Separator, Kbd, Code, VisuallyHidden, StatusDot, ColorSwatch, Logo.
- **Molecules (~49):** Field, InputGroup, SearchField, Password/Number/Phone/OTP/Quantity inputs, Select/CustomSelect, Combobox, TagInput, Checkbox/Radio groups, SegmentedControl, ToggleGroup, ButtonGroup, SplitButton, Date/Range/Time/DateTime pickers, Calendar, ColorPicker, FileUpload, Rating, Tooltip, Popover, HoverCard, Menu/Dropdown/Context menu, Breadcrumb, Pagination, Stepper, Tabs, Accordion, Collapsible, Alert/Callout/Banner, Toast, Card, ListItem, Stat, EmptyState, AvatarGroup, CodeBlock, CopyButton, Message, PromptInput, PriceDisplay.
- **Organisms (~31+):** Header, Sidebar, NavigationMenu, BottomNavigation, Dialog/Sheet/AlertDialog, CommandPalette, DataTable, TreeView, FilterBar, Form/ErrorSummary, Wizard, Carousel, Timeline, EventCalendar, Chart, Map, RichTextEditor, Chat, NotificationCenter, CommentsThread, FileManager, OnboardingTour, PricingTable, Footer, Kanban, switchers (Theme/Locale).
- **Layout/Templates:** Container, Stack, Grid, Flex, ScrollArea, AspectRatio, ResizablePanel; one template (`app-shell`).

## 3. Current design language

- **Color:** 11-step palettes (Tailwind-like: neutral = zinc, indigo, blue, violet, emerald, teal, rose, red, orange, amber…). Semantic layer (`bg-canvas/surface/raised/subtle/muted/inverse`, `text-*`, `border-*`) × 6 intents (primary, neutral, info, success, warning, danger). Brand themes: indigo (default), blue, violet, emerald, teal, rose, orange, mono. Light/dark via `data-ac-mode`; contrast via `data-ac-contrast`.
- **Typography:** Inter/Geist + JetBrains Mono, Arabic fallback; scale display/heading/body/label with fluid `clamp()` on display sizes and tracking tokens.
- **Spacing/density:** 4px-based `--ac-space-*`; density modes compact/comfortable/spacious change control sizes.
- **Shape:** `rounded` (control 8px, card 12px, dialog 16px) / `sharp` / `pill`.
- **Elevation:** 5 flat Tailwind-style black shadows + one inset highlight. Motion: 3 durations, 4 easings.
- **Conventions:** `data-variant`, `data-tone`, `data-size`, `data-slot`; button variants solid/soft/outline/ghost/link; RTL-safe logical properties; no raw colors in component CSS (verified); provider-driven i18n; controlled/uncontrolled via `useControllableState`.
- **CSS volume:** ~7.2k lines in 25 component files (largest: `organism-catalog.css` 924, `display.css` 809, `app-layout.css` 529).

## 4. Main design weaknesses

1. **Generic, "default Tailwind" identity.** Zinc neutrals + indigo + flat black shadows are indistinguishable from dozens of kits. No signature (surface treatment, accent usage, radius rhythm).
2. **Flat depth model.** Same shadow ladder everywhere; no layered surfaces, ring/border-plus-shadow combos, or dark-mode-specific elevation (dark relies on lighter surfaces only).
3. **Weak hierarchy in data-dense views.** Tables, cards and organisms use the same weight/contrast; few muted-vs-emphasis text steps in dark mode (`textSecondary` and `textTertiary` both = neutral-400).
4. **Color system limits.** HEX-only, hand-picked shade per role; no perceptual (OKLCH) ramps, no `color-mix` hover/active derivation, so themes feel uneven in brightness. Only 1 surface tint per brand; no chart/data-viz palette.
5. **Interaction polish gaps.** Single press effect (`translateY(1px)`), 3 motion durations, no reduced-motion-aware micro-interactions, no consistent hover/focus/selected treatment across list-like organisms. Focus ring is one color per brand with fixed 2px/2px offset.
6. **Inconsistent component voice.** Catalogue grew in batches (`atoms-extra`, `molecules-inputs`, `organism-catalog`…): large catch-all CSS files make variants/sizes inconsistent and hard to restyle.
7. **Few composed templates/blocks.** Only `app-shell`; Storybook has just dashboard + sign-in examples. Premium libraries sell on ready-made blocks (dashboards, auth, pricing, settings, marketing).
8. **Documentation/perception.** Stories are component-by-component; no gallery, theme playground or block browser. Stale status doc (phantom `apps/studio`).
9. **Known code debt:** 3 ESLint complexity warnings (Button, Dialog); 52+ items of earlier local work saved in `stash@{0}` ("pre-sync local work") — review before duplicating work.

## 5. Redesign strategy (inspired by modern premium libraries, not copying)

**Direction:** "Calm precision" — refined neutrals, one confident accent, layered surfaces, restrained motion. Keep API, class names, tokens' names and package boundaries (backwards compatible); change values, add tokens, restyle CSS.

### Phase 1 — Foundations (tokens only, then `pnpm generate`)

- Replace zinc with a slightly cooler/warmer custom neutral ramp; add OKLCH-derived brand ramps (generated in `scales.ts`), keep HEX output for compatibility.
- Add semantic tokens: `surface-1..3`, `border-strong`, `ring` (focus), `overlay`, `accent-subtle/hover/active`, chart palette (8 categorical + sequential), distinct dark `text-secondary`/`text-tertiary`.
- New elevation system: `shadow-1..5` layered (ambient + key), ring-shadow combos, dark-mode variants, glass/blur token for overlays.
- Typography: tighten tracking, add `tabular-nums` / stylistic features token, refine heading weights; consider Geist as primary.
- Radius rhythm: nested-radius rule (inner = outer − padding); motion: add `spring`/`emphasized` easings, 4 durations, reduced-motion map.

### Phase 2 — Core atoms and field controls

Button (add subtle/ gradient-free "premium" solid with inner highlight, size scale xs–xl, loading), Input/Select/Checkbox/Switch/Radio/Slider/Badge/Tag/Avatar. Unified states: hover, active, focus-visible, selected, invalid, disabled. Fix Button complexity warning while there.

### Phase 3 — Molecules

Field/InputGroup, Select/Combobox/Menu/Popover (shared popup surface), Tabs, Toast, Alert/Banner, Card, Stat, Pagination, Pickers. Shared "popup surface" and "list item" mixins to remove duplicated CSS.

### Phase 4 — Organisms and templates

Table/DataTable (row hover, sticky header, density), Sidebar/Header/AppShell, Dialog/Sheet, CommandPalette, Chart colors, EventCalendar, Kanban. Split `organism-catalog.css` and `display.css` per component.

### Phase 5 — Blocks and docs

Add Storybook "Blocks": dashboard, analytics, settings, auth, pricing, onboarding, empty/error pages; theme playground (mode/theme/density/shape/contrast); fix stale `DEVELOPMENT-STATUS.md`; update changesets.

### Guardrails (from `AGENTS.md`)

Edit tokens in `packages/tokens/src`, then `pnpm generate`; semantic `--ac-*` only; logical CSS properties; preserve light/dark, RTL, density, shape, contrast; add stories/tests per change; run the six quality commands; update `docs/DEVELOPMENT-STATUS.md`. No publish/push without explicit approval.

## 6. Status

| Phase                 | Status                |
| --------------------- | --------------------- |
| Analysis              | Done (this file)      |
| 1 Foundations         | **Done** (2026-11-28) |
| 2 Atoms               | **Done** (2026-11-28) |
| 3 Molecules           | **Done** (2026-11-28) |
| 4 Organisms/templates | **Done** (2026-11-28) |
| 5 Blocks/docs         | **Done** (2026-11-28) |

## 7. Phase 1 — completed work (Modern Minimal foundations)

All changes are token-level and additive: every existing `--ac-*` name still exists, and no component CSS was restyled. Components pick up the new values (neutrals, shadows, type tracking) automatically.

**Where things live**

- `packages/tokens/src/primitives.ts`: palettes, space, type, shadows (per mode), blur, motion.
- `packages/tokens/src/semantic.ts`: base surface/text/border roles, brands, gradient partners, chart series.
- `packages/tokens/src/effects.ts` (new): mode effects (shadows, elevation, rings, glass, surface/sheen/fade gradients, chart colors) and brand effects (gradients, focus halo).
- `packages/tokens/src/scales.ts`: type styles, `elevationLevels`, layout and icon sizes.
- `packages/tokens/src/css.ts`: emits effects inside the mode and brand rules, so nested dark/light zones resolve their own shadows and gradients.
- Generated: `packages/css/src/tokens.css`, `packages/tokens/tokens.json` (now includes chart colors).

**Color**

- Neutral ramp is now "graphite", a faintly cool zinc replacement with the same shade keys.
- New palettes: `sky`, `cyan` and `fuchsia`. New brand themes: `cyan` and `fuchsia` (10 brands in total; indigo is still the default).
- Light mode: canvas `#fcfcfd` with white surfaces, so cards separate without heavy borders.
- Dark mode: evenly stepped layers (`#0b0b0e` canvas, `#121216` surface, `#1a1a1f` raised), and `text-secondary` (`#b9b9c3`) is now distinct from `text-tertiary`.
- New base roles: `bg-surface-sunken`, `bg-hover`, `bg-active`, `text-disabled`, `border-strong`.
- `--ac-color-chart-1…8`: a categorical series fixed across brands; each color clears 3:1 on every surface (tested).
- `--ac-color-bg-glass` and `--ac-color-bg-glass-border`, used with `--ac-blur-sm/md/lg`.

**Gradients (per brand × mode)**

- `--ac-gradient-brand` (solid fills)
- `-brand-text` (clip-to-text headlines)
- `-brand-soft` (tinted panels)
- `-brand-border` (gradient outlines)
- `-brand-glow` (top light pool)
- `-brand-mesh` (two-hue ambient background)

Mode-level gradients: `--ac-gradient-surface`, `--ac-gradient-sheen` (lit edge on solid fills) and `--ac-gradient-fade` (scroll edges). Each brand blends into a neighbouring hue, set in `BRAND_GRADIENT_PARTNERS`.

**Depth and borders**

- Layered two-part shadows (`xs…2xl`, `inner`, `highlight`):
  - Light mode uses an ink-tinted shadow.
  - Dark mode uses deeper shadows with a faint top edge light.
  - `elevation-*` keeps its names and resolves per mode.
- `--ac-shadow-ring` and `--ac-shadow-ring-strong` draw 1px borders without changing layout.
- `--ac-shadow-focus` and `--ac-color-focus-ring-soft` provide a brand-tinted focus halo.

**Typography**

- `--ac-font-family-display`.
- `--ac-font-features-text/display/tabular`; `reset.css` now applies the text features to the root.
- Tighter tracking on display and heading sizes, with new `tightest/snug/wider` values.
- Line heights `none` and `tighter`.
- A new `label-lg` style; `overline` uses the wider tracking.

**Spacing, layout and motion**

- Space steps `7`, `14` and `32`.
- `--ac-layout-container-sm…2xl/prose`, plus fluid `--ac-layout-gutter` and `--ac-layout-section`.
- `--ac-size-icon-xs…xl`.
- Easings `spring` and `smooth`, a `250ms` duration step and `--ac-duration-moderate`.

**Docs and tests**

- New Storybook page `Foundations/Effects` (gradients, shadows, glass, chart series).
- `cyan` and `fuchsia` added to the Storybook theme toolbar.
- New tests: chart contrast, ordering of text steps, per-mode effect emission, brand gradient coverage. The contrast suite also covers the new brands.

**Validation (2026-11-28)**

- `pnpm install --frozen-lockfile` was needed because the sync changed dependencies.
- Passing: `format:check`, `lint` (0 errors; 28 existing complexity warnings in React files, none in token files), `typecheck`, `generate`, `test` (tokens 117, core 58, react 174), `build` and `build-storybook`.
- Not done: a visual pass in Storybook. Check `Foundations/Effects` and a few components in light and dark mode before Phase 2.

**Guidance for Phase 2+ (component restyle)**

- Solid buttons and badges: layer `--ac-gradient-sheen` over the fill and use `--ac-shadow-highlight`.
- Hover: use `--ac-color-bg-hover`.
- Popovers and menus: use `--ac-elevation-popover` with `--ac-color-border-subtle`.
- Sticky headers: `--ac-color-bg-glass` with `backdrop-filter: blur(var(--ac-blur-md))`.
- Headings: should adopt `--ac-font-family-display` and `--ac-font-features-display`. That belongs in `typography.css`, which was deliberately not changed in Phase 1.
- Charts: switch `Chart` to the `--ac-color-chart-*` series.
- Keep `--ac-shadow-focus` as an addition to the outline focus ring, never a replacement (WCAG 2.4.11).

## 8. Phase 2 — completed work (Atoms)

All 29 atoms were restyled in CSS only. No React API, class name or `data-*` attribute changed, and all values come from tokens (no raw colors; the token stylesheet test enforces this).

**Files**

- `components/button.css`: Button, IconButton.
- `components/form-controls.css`: Input, Textarea, Select, Label.
- `components/choice-controls.css`: Checkbox, Radio, Switch.
- `components/slider.css`: Slider.
- `components/typography.css`: Text, Heading, Link.
- `components/display.css`, atom sections only: Badge, Avatar, Spinner, Skeleton, Kbd, Separator, Progress, ProgressCircle, Tag, Code, Image, Logo, StatusDot, ColorSwatch, Meter, Toggle.
- Icon sizing is unchanged in `utilities.css`. Inside Button and Toggle, icons use the `--ac-size-icon-*` tokens.

**Shared visual language**

- **Solid fills** (Button, checked Checkbox/Radio/Switch, solid Badge/Tag, Progress/Meter/Slider range, Logo mark) use `--ac-gradient-sheen`, `--ac-shadow-highlight` and a hairline edge in the fill's own hue.
- **Soft Badge and Tag** get a 70% tone hairline so they stay crisp on any surface. Outline variants sit on `bg-surface`.
- **Hover** uses `bg-hover` and `border-strong` for neutral chrome, and is gated by `@media (hover: hover)` so touch devices don't get sticky hover states.
- **Active:** buttons press with `scale(0.985)` and a 0.5px drop. Checkbox and radio press to `0.92`. The switch thumb squashes. The slider thumb grows while dragging.
- **Motion:** checkmarks, radio dots and the switch thumb use the `spring` easing.
- **Focus:** every interactive atom now declares its own `:focus-visible` outline (`--ac-color-focus-ring`, 2px, offset 2px), so it no longer depends on sitting inside `.ac-root`. Text fields add `--ac-shadow-focus`; the slider thumb adds a tone halo.
- **Disabled:**
  - Buttons fade.
  - Text fields switch to `bg-muted` + `text-disabled` + a subtle border, which stays readable.
  - Checked choice controls keep their tone at reduced opacity.
  - Labels next to disabled fields dim via `:has()`.
  - `[data-disabled]` on `Button asChild` is now styled as disabled too.
- **Loading:** the button stays fully opaque with `cursor: progress`. Only its content dims, so "busy" reads differently from "disabled".
- **Error** (`data-invalid`): danger border, a faint danger-tinted fill, a danger focus ring, halo and caret, and a darker border on hover. Checkbox and radio get a danger halo.
- **Read-only fields:** sunken surface, no shadow.

**Typography**

- Headings use `--ac-font-family-display` and `--ac-font-features-display`; h4–h6 now apply their tracking tokens.
- Text uses `text-wrap: pretty`.
- Labels and controls use the label tracking tokens.
- Numbers use tabular figures in Badge, Kbd, number/tel inputs and slider mark labels.
- Labeled separators use the overline style (uppercase, wider tracking), turned off for Arabic.

**Responsiveness and accessibility**

- **Touch targets:** on coarse pointers, invisible hit areas reach at least 24px (WCAG 2.5.8) for the xs Button, Checkbox, Radio, Switch and the Tag remove button, and 44px for the slider thumb.
- **No iOS zoom:** text fields use 16px text on coarse pointers so iOS doesn't zoom in on focus.
- **Forced colors:** `forced-colors: active` fallbacks cover Button, Toggle, Checkbox, Radio, Switch and Slider.
- **Switch contrast:** the unchecked track keeps the 3:1 control color. The thumb is white when off and the tone's contrast-tested `on-solid` color when on, so it stays visible in every brand, including mono and dark mode.
- **Unchanged:** RTL (switch thumb, slider) and the shape tokens. Checkbox corners are capped relative to the box size, so `pill` doesn't turn checkboxes into circles.

**Docs and validation**

- New Storybook page `Examples/Atom states` (`packages/react/src/atoms/states.stories.tsx`): Buttons (5 variants × tones/loading/disabled, sizes, icon buttons, toggle), FormControls, ChoiceControls and DisplayAtoms.
- `.claude/launch.json` starts Storybook for the in-app preview.
- Visual check in Storybook dev: light mode, dark mode, and Arabic RTL with the pill shape. A first pass found the loading button rendering as disabled; the cause was Storybook reading the stale `packages/css/dist`. After `pnpm --filter @atomscraft/css build` it rendered correctly.
- Passing: `format:check`, `lint` (0 errors, 28 existing warnings), `typecheck`, `test` (tokens 117, core 58, react 174) and `build-storybook`.
- Not checked: forced-colors mode and real touch devices were not tested by hand.

**Notes for Phase 3 (Molecules)**

- Composites that reuse atom classes inherit the new look automatically: `field.css`, `form-composites.css` and `interaction-composites.css` (ButtonGroup, InputGroup addons).
- Review their overrides for conflicts with the new `box-shadow`/edge on solid buttons, especially joined ButtonGroup borders.
- Build the shared "popup surface" from `--ac-elevation-popover`, `--ac-color-border-subtle` and `bg-surface-raised`.

## 9. Phase 3 — completed work (Molecules)

All molecules were restyled in CSS only. No React API, class name or `data-*` attribute changed.

**New shared layer: `components/surfaces.css`** (imported right after `form-controls.css`)

1. **Control frame** for InputGroup, Combobox, SelectMenu trigger, DatePicker control, TagInput, PromptInput and OTP digits. These match the atom text fields exactly:
   - surface fill, 3:1 control border and xs shadow
   - border darkens on hover (pointer devices only)
   - focus: ring border plus `--ac-shadow-focus`
   - shared invalid style (danger border, tint and halo)
   - shared disabled style
   - inner inputs are bare, so the frame draws all the chrome
2. **Popup surface** for Popover, Menu, Listbox, HoverCard and the DatePicker popup:
   - raised surface, default border, `--ac-elevation-popover` and `--ac-radius-popover`
   - a pop-in whose origin follows `data-side`
   - thin scrollbars and contained overscroll
3. **List item** for Menu items and Listbox options:
   - one row height, padding and radius (the inner radius follows the popup radius)
   - highlight is a translucent ink wash (`color-mix` of text-primary at 7%, 11% when active), so it stays visible on raised surfaces in dark mode; `bg-hover` was too faint there
   - group labels and shortcuts share one style
   - forced-colors fallbacks

The component files (`overlays.css`, `listbox.css`, `field.css`, `form-composites.css`, `calendar.css`, `interaction-composites.css`) now keep only layout and genuine differences, with the duplicated chrome removed.

**Per-family changes**

- **Field and forms:**
  - Descriptions use tertiary text; errors fade in with a smaller icon.
  - RadioGroup cards lift on hover. The checked card gets a brand ring and tint, and keyboard focus shows on the whole card instead of the radio.
  - Disabled CheckboxGroup labels dim.
  - OTP digits use the display face.
  - PromptInput is a roomier card-radius composer.
- **Navigation:**
  - The active NavItem gets a 3px brand-gradient indicator on its leading edge (flips in RTL) and a lit badge.
  - Breadcrumb uses a softer separator.
  - The current Pagination page is a tinted primary tile.
- **Tabs:**
  - Line: a gradient underline that scales in, including in vertical orientation.
  - Pills: neutral hover.
  - Segmented: recessed track with a raised active tile; SegmentedControl uses the same look.
- **Accordion:**
  - Separated items deepen their shadow when open.
  - Hover fills the trigger, except in the plain variant, which uses a soft underline.
  - Explicit focus and disabled states; relaxed body text.
- **Feedback:**
  - Alert outline variant gets a tone accent bar on the leading edge; the solid variant is lit.
  - EmptyState sits on `--ac-gradient-brand-glow` with a floating icon tile.
  - Toast is frosted glass where `backdrop-filter` is supported (opaque under reduced transparency) and springs in.
  - Banner gets a horizontal tint fade. Its duplicated tone mappings were removed; `data-tone` in `tokens.css` already supplies them.
- **Card and Stat:**
  - Elevated cards use the lit surface gradient.
  - Interactive cards: hover lift, press and focus ring; filled cards highlight with a tint.
  - Card titles use the display face.
  - Stat values use the display face with tabular figures; the icon tile uses `--ac-gradient-brand-soft`; deltas are toned pills.
  - AvatarGroup rings use the surface color and lift on hover.
- **Pickers:**
  - Today is a brand dot rather than a box.
  - The selected day is lit; disabled days are struck through.
  - Popups use the shared surface.
  - The FileUpload dropzone hovers, and glows with the brand while dragging or focused.
  - Rating stars warm up on hover and pop when chosen. Empty stars keep a 3:1 color.
- **Composites:**
  - ButtonGroup buttons fuse with collapsed hairlines; the hovered or focused button rises above its neighbours.
  - Solid buttons inside groups drop their individual shadows; the group casts one.
  - SplitButton uses a hairline divider, and the trigger's own corners are no longer squared off.
  - Stepper: the current step is outlined with a halo, completed steps are filled.
  - ToggleGroup's single-choice "on" state is brand-tinted.
- **Content:**
  - CodeBlock sits on a sunken body with a surface header and thin scrollbar.
  - Outgoing Message bubbles are solid brand with a speech-tail corner (no gradient: body text needs 4.5:1 across the bubble).
  - Selected ListItems are tinted.
  - PriceDisplay uses the display face.

**Tokens**

- The light-mode stops of `--ac-gradient-brand-text` moved from shades 700/600 to 700/700. With 600, the partner stop fell under 4.5:1 for orange, teal and amber.
- New `packages/tokens/src/effects.test.ts` asserts, for every brand and mode, that both text-gradient stops reach 4.5:1 with the brand's on-solid color and with the canvas.
- The Logo mark (Phase 2) now uses this gradient, so a letter inside the mark stays readable.

**Validation (2026-11-28)**

- Passing: `generate`, `format:check`, `lint` (0 errors, 28 existing warnings), `typecheck`, `test` (tokens 161, core 58, react 174), `build` (css) and `build-storybook`.
- Visual check in Storybook dev:
  - Molecule patterns (navigation and feedback, form controls, disclosure and toast).
  - DropdownMenu in dark mode, opened from the keyboard; this is where the faint highlight was found and fixed.
  - Tabs variants, Stepper, DatePicker states and the Message conversation.
- In the hidden browser pane, CSS animations don't advance, so entering content looked faint. After finishing the animations it rendered correctly, so this is a preview artifact, not a CSS bug.
- Not checked by hand: forced-colors mode, RTL across all molecules and real touch devices.

**Notes for Phase 4 (Organisms)**

- `organism-catalog.css`, `table.css` and `app-layout.css` still contain their own SelectMenu, Combobox and NavItem overrides; review them against `surfaces.css` so they don't undo the shared frame or highlight.
- Dialog and Sheet should adopt the popup-surface treatment with `--ac-elevation-dialog`.
- CommandPalette already uses `.ac-listbox`, so it inherits the new rows.

## 10. Phase 4 — completed work (Organisms and templates)

All organisms and the AppShell template were restyled in CSS only. No React API, class name or `data-*` attribute changed.

**Review of the Phase 3 note**

- `organism-catalog.css`, `table.css` and `app-layout.css` only set layout (width) on SelectMenu and Combobox, so nothing undid the shared frame.
- Real duplicates fixed:
  - SkipLink was defined twice (`app-layout.css` and `organism-catalog.css`, with the later copy winning). It is now defined once, in `app-layout.css`.
  - The NavigationMenu submenu re-implemented the popup surface; it now uses `surfaces.css`.
  - RichTextEditor re-implemented the control frame; it is now in the `surfaces.css` frame list, with card radius and a toolbar divider.

**Per-file changes**

- `dialog.css`:
  - The dialog is a lit raised surface with `--ac-elevation-dialog`, a spring entrance and a `--ac-blur-sm` backdrop.
  - Titles use the display face; the body scrollbar is thin.
  - Footer tray: when the footer closes the panel, it bleeds to the edges on a hairline-topped tinted tray whose radius follows `--ac-radius-dialog`. A first pass inherited the radius from the panel (none) and showed square corners; fixed. Panels without padding (command palette, sidebar sheet) keep a plain footer.
  - Under 480px, footer buttons stack full-width with the primary action last.
  - Bottom sheets get a grab handle.
- `command.css`: the palette is clipped to `--ac-radius-popover`, has a larger search row, a search icon that turns brand-colored on focus, a thin scrollbar, and option rows from `surfaces.css`.
- `table.css`:
  - The container has a card shadow; header labels are small and medium-weight.
  - Row dividers are subtle; hover is a 4% ink wash.
  - Selected rows get a primary tint plus a 2px leading bar, flipped in RTL.
  - The sticky header is frosted.
  - Sortable headers: hover, focus ring, and the active sort column in the primary color (via `aria-sort`).
  - The empty state sits on the brand glow; the footer row is tinted.
  - Responsive card rows get a surface and shadow, and selected cards get a brand ring.
- `app-layout.css`:
  - Sidebar: subtle border, smooth width transition, thin scrollbar, ink-wash hover for NavItems, and the active indicator under the icon when collapsed.
  - Header: frosted glass with `--ac-blur-md` (opaque under reduced transparency), the fluid gutter, and a display-face brand.
  - SkipLink: a lit primary chip that springs in on focus.
  - Container widths and gutter now come from the `--ac-layout-*` tokens; the per-breakpoint padding rules were removed. The values match the old ones.
  - ResizablePanel gets a card shadow.
- `event-calendar.css`:
  - The calendar is a surface card; the view switcher is a recessed segmented track; the period title uses the display face.
  - Month cells get a hover wash; today's date is a lit brand pill.
  - Events have a 2px tone-solid leading edge, a softened border, and a hover shadow.
  - The schedule header is frosted; today's column has a brand tint.
  - Agenda dates are sticky; the empty state uses the brand glow.
- `form.css`:
  - Consecutive sections are separated by a hairline.
  - Legends use the display face at heading-5.
  - ErrorSummary matches the soft danger Alert (leading accent bar, fade-in).
- `organism-catalog.css` (rewritten, same selectors):
  - **NavigationMenu:** ink hover, open-state highlight, a gradient underline under the current top-level link, and a rotating chevron.
  - **BottomNavigation:** frosted bar respecting the safe-area inset, the current item on a tinted icon pill, and a ringed badge.
  - **TreeView and NavigationRail:** hover and selected states; the focus ring is drawn on the row rather than the whole subtree; the rail's current item gets a gradient indicator.
  - **Overlays and states:** overlays use a frosted scrim; ErrorState is a soft danger panel with a radial glow; OfflineIndicator dots have halos.
  - **Data display:** DataList, DescriptionList and DataCard use tertiary labels, tabular values, and the display face for figures.
  - **Workflow:** FilterBar, Carousel and Wizard get the card shadow and display titles.
  - **Timeline:** filled tone dots with halos (neutral still maps to the brand, as before).
  - **Kanban:** recessed columns, raised cards with hover, and count pills.
  - **Chart:** hairline axes, and non-hovered bars dim on hover.
  - **Map:** lit markers that scale on hover; tooltips use the shadow token.
  - **NotificationCenter:** unread items get a brand tint and a leading dot.
  - **FileManager:** gradient icon tiles and hover rows.
  - **PricingTable:** the featured plan lifts with a brand ring and glow. The price is now heading-2 in the display face. Two older issues were fixed: features spread out to fill the minimum height, and the period rule also matched the PriceDisplay `span` and turned the price tertiary.
  - **Footer:** the fluid gutter and focus rings on links.

**Validation (2026-11-28)**

- Passing: `format:check`, `lint` (0 errors, 28 existing warnings), `typecheck`, `test` (tokens 161, core 58, react 174), `build` (css) and `build-storybook`.
- Visual check in Storybook dev:
  - Dashboard example in light and dark mode.
  - EventCalendar month view.
  - PricingTable in light and dark mode, before and after the fixes.
  - Dialog in light and dark mode, after the corner fix.
  - Kanban and Timeline.
  - Workspace shell in Arabic (RTL): sidebar on the right, indicator on the leading edge.
- Not checked by hand: forced-colors mode, every organism story individually, and real touch devices.

## 11. Phase 5 — completed work (Blocks and docs)

**Storybook blocks** (`apps/storybook/src/blocks/`, new "Blocks" section sorted before "Examples"). Each block composes public components only, so it can be copied as a starting point.

| Story                   | What it shows                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Blocks/Settings`       | Vertical pill tabs (Profile, Notifications, Danger zone), FormSections, notification switches, and a danger-zone alert and card |
| `Blocks/Analytics`      | Period SegmentedControl, KPI Stats, a Chart card, traffic sources in the `--ac-color-chart-*` series, and a top-pages DataList  |
| `Blocks/Authentication` | Split-screen sign-up with a brand mesh panel and gradient headline; password reset; email verification with OTP                 |
| `Blocks/Pricing page`   | Gradient hero, monthly/yearly switch, PricingTable with a featured plan, and an FAQ accordion                                   |
| `Blocks/Onboarding`     | Three-step setup: Stepper, card RadioGroup and TagInput invites                                                                 |
| `Blocks/Status pages`   | 404 with gradient numerals, server error (ErrorState), empty project (EmptyState), maintenance (Banner)                         |

**Theme playground** (`Foundations/Theme playground`):

- `AllBrands`: all 10 brand themes side by side, each in its own `data-ac-theme` zone (mesh header, field, progress, buttons, switch, tag). The zones follow the Mode, Density, Shape and Contrast toolbar settings.
- `LightAndDark`: a light zone and a dark zone on one page, demonstrating nested modes.

**Library fixes found while building the blocks** (CSS only):

- `disclosure.css`: under 640px, vertical Tabs stack above their panel, and the list becomes one scrollable row (line variant included). Before, the panel was squeezed next to the list on phones.
- `form.css`: the hairline between consecutive FormSections moved to the bottom of the earlier section. A fieldset draws its legend inside the top border, so the Phase 4 top border struck through the next section's title.

**Docs and release**

- `docs/DEVELOPMENT-STATUS.md`: the stale "In progress: AtomCraft Studio" section is replaced with a factual note. `apps/studio` is not in the repository: it isn't in git history or in `stash@{0}`, and `apps/` contains only `storybook`.
- `.changeset/modern-minimal-redesign.md`: a minor bump for `@atomscraft/tokens` and `@atomscraft/css`. The four packages are a fixed group in `.changeset/config.json`, so they version together. The changeset is not consumed or published; releasing needs explicit approval (`AGENTS.md`).

**Validation (2026-11-28)**

- Passing: `format:check`, `lint` (0 errors, 28 existing warnings), `typecheck` (stories included through the root tsconfig), `test` (tokens 161, core 58, react 174), `build` (css) and `build-storybook` (486 index entries, including 11 block stories).
- Visual check in Storybook dev:
  - Theme playground: all brands.
  - Settings on desktop and at mobile width (375px): stacked tabs, 16px fields, fixed divider.
  - Analytics in dark mode.
  - Sign up, and the Pricing page.
  - Onboarding in dark mode, advanced to step 2.
  - 404 in dark mode.
- Not checked: ForgotPassword, VerifyEmail, ServerError, EmptyProject and Maintenance were built but not opened individually; forced colors and real touch devices.

## 12. Redesign complete — remaining work

All five phases are done. Nothing is committed yet.

Open points:

- (a) Decide whether a signature default brand should replace indigo; that is a single change to `DEFAULT_BRAND`.
- (b) `stash@{0}` ("pre-sync local work") still holds earlier local edits; review it before duplicating work.
- (c) ~~`docs/DEVELOPMENT-STATUS.md` mentions a non-existent `apps/studio`~~. Resolved in Phase 5.
- (d) Storybook dev reads `@atomscraft/css` from `dist`: rebuild it (`pnpm --filter @atomscraft/css build`) after CSS edits, or wire Storybook to `src`.
- (e) The filled Rating star uses `warning-solid` (amber 500), only about 2:1 on white. This predates Phase 3; consider a darker star token.
- (f) The Chart still draws a single brand series. Multi-series charts should use `--ac-color-chart-1…8`; that needs a React API change, which is outside a CSS-only phase.
- (g) Manual passes still owed: forced-colors (Windows high contrast) and real touch devices.

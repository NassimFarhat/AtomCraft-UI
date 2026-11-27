# AtomCraft UI development status

## Completed: organization-scoped npm release

The four public package workspaces are published under the `atomscraft` npm
organization:

- `@atomscraft/core@0.1.0`
- `@atomscraft/tokens@0.1.0`
- `@atomscraft/css@0.1.0`
- `@atomscraft/react@0.1.0`

The documentation release is also public as `0.1.1` for all four packages,
with the `latest` tag:

- `@atomscraft/core@0.1.1`
- `@atomscraft/tokens@0.1.1`
- `@atomscraft/css@0.1.1`
- `@atomscraft/react@0.1.1`

The repository now uses the `@atomscraft/*` scope everywhere. The earlier
`@atomcraft/*` personal-scope packages remain published as legacy packages.

## Completed: documentation release

Package READMEs now explain why each package exists, which package to install,
installation commands, working examples, API areas, themes, accessibility,
related packages and links to the repository. The documentation release is
prepared as `0.1.1` for all four packages.

## In progress: AtomCraft Studio

The first public-facing Studio slice is implemented in `apps/studio`. It uses
the published AtomCraft package architecture and currently includes:

- AtomCraft-branded responsive shell with desktop and mobile navigation
- Live component preview using `@atomscraft/react` and `@atomscraft/css`
- Component catalog filters, search and Atomic Design layer navigation
- Theme and density controls powered by `@atomscraft/tokens`
- Installation and usage code panels with copy actions
- Foundations, examples, packages and next-release sections
- A registry-shaped catalog model that can grow into full component pages,
  blocks, templates, theme generation and builder features
- Seven catalog cards with visible preview art and component detail pages with
  four package-backed variants each (Button, Field, Alert, DatePicker, Dialog,
  DataTable and AppShell)
- Working per-variant usage snippets, independent from the installation tabs

The first slice is local and not deployed yet. The Studio catalog is not a full
inventory: the React package currently has 66 Storybook story files, while
Studio documents seven component entries. Its Examples section is still a small
set of static page concepts. Next work should add route-level component pages,
catalog coverage for the remaining exports, generated API documentation,
interactive examples/blocks/templates, functional theme generation and builder
features, and deployment configuration.

## Verification

Completed on 2026-11-26:

- `pnpm install --frozen-lockfile`
- `pnpm format:check`
- `pnpm lint` — zero errors; three existing complexity warnings remain in the
  Button and Dialog components
- `pnpm typecheck`
- `pnpm generate`
- `pnpm test` — 278 tests passed
- `pnpm build`
- `pnpm pack:check`
- `pnpm build-storybook`
- `pnpm -r publish --dry-run --no-git-checks --access public`
- npm organization access check — all four packages have `read-write` access
- npm public status check — all four packages are public with `latest` at
  `0.1.1`
- `pnpm test` after the CI runtime fix — 278 tests passed locally
- `pnpm install --frozen-lockfile` after adding Studio
- `pnpm build` — packages and `apps/studio` built successfully
- `pnpm --filter @atomscraft/studio build`
- `pnpm build-storybook` — Storybook build completed successfully
- Local Studio HTTP check — `http://127.0.0.1:5173/` returned HTTP 200

Latest Studio checks:

- Edge/Playwright browser check: all seven catalog cards rendered; all seven
  detail pages showed four variants with no placeholders; Button code display
  and Dialog open/close worked; no browser errors occurred
- Foundations, Examples and Packages scroll targets remained visible below the
  sticky header; search/filter, theme toggle and mobile menu worked
- `pnpm format:check`, `pnpm typecheck`, `pnpm generate`, and
  `pnpm build-storybook` passed; the latter includes package and Studio builds
- `pnpm test` passed: 278 tests
- `pnpm lint` passed with zero errors and eight complexity/line-count warnings
  (five in Studio, three in existing package files)

Latest Storybook coverage checks:

- Added dedicated entries for Heading, Kbd, Label, Link, Radio, Select,
  Separator, Skeleton, Spinner, Switch and Textarea; these were previously
  shown only inside grouped Atoms stories
- `pnpm build-storybook` passed and the generated index contains all 11 entries
- Storybook browser check opened all 11 new story routes with no runtime errors
- Added a dedicated `Molecules/SelectMenu` story for the fully themed option
  popup; the native `Atoms/Select` story now documents its platform-rendered
  popup and is labeled `NativeControl`
- Edge browser check opened the SelectMenu popup and verified its three styled
  options and no runtime errors
- Added direct Storybook entries for the remaining 16 molecule exports:
  Accordion, AvatarGroup, Breadcrumb, CopyButton, DatePicker, EmptyState,
  InputGroup, Listbox, NavItem, PasswordInput, Popover, RadioGroup, SearchField,
  Stat, Toast and Tooltip; Listbox is documented as an advanced building block
- Added direct entries for ProgressCircle, Header and Sidebar
- Added direct entries for Icon, Text, Field, Pagination, Dialog, AlertDialog
  and Sheet; moved their previous combined galleries under `Examples`
- Moved combined component galleries into the `Examples` section and removed
  duplicate component stories from their old grouped entries
- All exported AtomCraft React atoms, molecules and organisms now have a
  discoverable Storybook entry; the generated index contains 168 story entries
- `pnpm format:check`, `pnpm typecheck`, `pnpm generate`, `pnpm test` and
  `pnpm build-storybook` passed; 278 tests passed
- `pnpm lint` passed with zero errors and three existing warnings in Button
  and Dialog
- Storybook production build emits a Vite chunk-size warning for bundles over
  500 kB, but completes successfully
- The source tree also has empty `code`, `color-swatch`, `image`, `logo`,
  `meter`, `status-dot` and `toggle` folders; they have no component files or
  public exports, so they are not Storybook components yet

## Toast and event calendar expansion

- Added the separate `EventCalendar` organism; the existing `Calendar` and
  `DatePicker` remain date-selection controls
- `EventCalendar` supports month, week, day and agenda views; timed and all-day
  events; overlapping time slots; visible-range, date-selection and event-
  selection callbacks; configurable week start, working hours and slot length;
  locale-aware labels; RTL direction; and month-grid keyboard navigation
- Added `Organisms/EventCalendar` Storybook examples for each view and an empty
  agenda, with representative multi-day and overlapping events
- Expanded Toast with loading/update/promise APIs, completion tones, dismiss
  callbacks, timed progress, accurate hover/focus pause and resume, visible
  stack limits, ordering and six placements
- Added Toast feedback and promise-state Storybook examples, plus React package
  README usage for both features
- Added a Toast Controls-panel selector for changing the mounted Toaster's
  position
- Connected EventCalendar date, view, date-selection, event-selection and
  visible-range callbacks to Storybook Actions so interactions show their data
- Event creation/editing, drag-and-drop, recurring events and resource columns
  remain outside the current scheduler API; applications own event state

Verification on 2026-11-26:

- `pnpm format:check` passed
- `pnpm lint` passed with zero errors and the same three pre-existing warnings
  in Button and Dialog
- `pnpm typecheck` passed
- `pnpm generate` passed
- `pnpm test` passed: 287 tests across Core, Tokens and React
- `pnpm build-storybook` passed; Storybook index contains 168 story entries
- Storybook returned HTTP 200 for the EventCalendar week schedule and Toast
  promise-state iframe routes
- Visual browser review had not been completed at this point; the follow-up
  below records the later inspection.
- The build emits the existing Vite chunk-size warning for chunks above 500 kB

## CI runtime note

The quality workflow uses Node 22 because the locked `jsdom@31.0.1` and
`undici@8.13.1` test dependencies require Node 22+. Node 20 caused Vitest
workers to fail before React tests could start.

## Catalogue completion audit (2026-11-27)

- Completed the supplied Atom, Molecule, Organism and layout catalogue inside
  the existing package boundaries. Public component APIs stay in
  `@atomscraft/react`; no external component library was added.
- The production Storybook index contains 456 entries: 308 executable stories
  and 148 docs entries across 148 titles. All 136 Atoms, Molecules, Organisms
  and Layout titles have component stories.
- A headless Chrome route sweep opened all 136 component titles. Every route
  mounted with no Storybook rendering errors or uncaught browser exceptions.
  The 390px viewport check confirms the calendar page stays within the viewport
  and the week schedule scrolls inside its own grid.
- The Toaster success action visibly displays a positioned success notification.
  Drawer opens its dialog, and SelectMenu opens its styled option list.
- Fixed the Storybook toast store mismatch by using the same source modules for
  the preview provider/Toaster and story toast actions. Fixed EventCalendar
  overlap widths by assigning lanes per overlapping time group. Short and
  overlapping events now use compact labels while retaining full accessible
  details; the mobile toolbar stacks controls without overlap.
- EventCalendar examples and Actions document date navigation, view changes,
  date selection, selected event payloads and visible `{ start, end }` ranges.
  Event creation, recurrence, drag-and-drop and resource columns remain outside
  the current API.
- Catalogue export audit: 156 expected public names present, none missing.
  Semantic CSS audit: 185 used `--ac-*` variables, none undefined.

Final verification:

- `pnpm format:check` - passed.
- `pnpm lint` - passed with zero errors and 28 line-count/complexity warnings.
- `pnpm typecheck` - passed.
- `pnpm generate` - passed; generated token CSS and JSON are synchronized.
- `pnpm test` - passed: 336 tests (Tokens 105, Core 58, React 173).
- `pnpm build-storybook` - passed; Vite reports the existing oversized
  chunk warning above 500 kB and slow React docgen transforms.
- `git diff --check` - passed.
- No package was published and no repository changes were pushed or deployed
  during this audit.

## Visual style audit follow-up (2026-11-27)

- Captured and reviewed representative desktop screenshots for all 136
  component Storybook titles, including the new catalogue additions outside
  Toast and EventCalendar. Also inspected dark-mode Field, SelectMenu,
  EventCalendar, Map and Dialog examples.
- Reopened all 136 component routes at 390px and 320px. Every page mounted with
  no uncaught browser exceptions and no horizontal page overflow.
- Fixed display issues found during review: the Map canvas had no width, the
  Image example referenced a missing illustration, and Meter and Separator
  examples had no width context. Added a public SVG illustration, bounded the
  examples, and made the SkipLink story explain and demonstrate keyboard focus.
- Constrained fixed-width examples for narrow canvases. Calendar and DatePicker
  now fit at 320px, including an open DatePicker popup; Tooltip placements wrap
  to a second row; six-digit OTP inputs fit on one row with compact sizing.
- Checked the added component stylesheets for hard-coded palette colors; none
  were found.
- `pnpm format:check` passed.
- `pnpm lint` passed with zero errors and 28 line-count/complexity warnings.
- `pnpm typecheck` passed.
- `pnpm generate` passed; generated token CSS and JSON are synchronized.
- `pnpm test` passed: 336 tests (Tokens 105, Core 58, React 173).
- `pnpm build-storybook` passed; the generated index contains 456 entries,
  including all 136 component titles. Vite reports the existing chunk-size
  warning above 500 kB and slow React docgen transforms.
- `git diff --check` passed. No package was published and nothing was pushed or
  deployed.

## Individual Storybook route visual follow-up (2026-11-27)

- Opened, captured and visually reviewed every one of the 308 executable
  Storybook story routes, including each variant nested under a component
  title. The complete route sweep reported no failed mounts, page overflow,
  uncaught browser exceptions or console errors.
- Fixed the reported Catalog examples: the centered canvas now keeps a full
  responsive width; Kanban and PricingTable use their available columns;
  RichTextEditor renders real paragraph breaks at a readable width; and
  FilterBar and Kanban use AtomCraft's SelectMenu for themed option popups.
- Added a visible search placeholder and made the Kanban story move cards when
  a destination is selected. Bounded standalone Select, CustomSelect,
  DateTimePicker, TimePicker and NumberInput stories to responsive field widths.
- Re-captured all 11 routes affected by those follow-up edits. They mounted
  without failures, overflow, uncaught exceptions or console errors. A second
  attempt to recapture all 308 routes stopped on a Chrome DevTools navigation
  timeout after 80 routes; the original complete capture and manual review of
  all 16 contact sheets were complete, and the changed routes were recaptured
  separately after the final edits.
- `pnpm format:check` passed.
- `pnpm lint` passed with zero errors and 28 line-count/complexity warnings.
- `pnpm typecheck` passed.
- `pnpm generate` passed; generated token CSS and JSON are synchronized.
- `pnpm test` passed: 337 tests (Core 58, Tokens 105, React 174). jsdom printed
  its canvas `getContext()` not-implemented notice in canvas-related tests.
- `pnpm build-storybook` passed; the index contains 308 stories and 148 docs
  entries across 148 titles. Vite reports the existing >500 kB chunk warning
  and slow React docgen transforms.
- No package was published; nothing was pushed or deployed.

## Next release steps

The documentation release was committed to GitHub as `2d32074`, and the four
`0.1.1` package tags were pushed to the repository. Future changes should use
the Changesets workflow described in `docs/RELEASING.md`.

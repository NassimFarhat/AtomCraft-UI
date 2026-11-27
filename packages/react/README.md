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

- **Atoms:** Button and IconButton, Toggle, Link, Text and Heading, Icon,
  Label, Input and Textarea, Checkbox, Radio, Switch, Slider, Badge, Tag/Chip,
  Avatar, Image, Spinner, Skeleton, ProgressBar/ProgressCircle, Meter,
  Separator/Divider, Kbd, Code, VisuallyHidden, StatusDot, ColorSwatch and Logo
- **Molecules:** Field and InputGroup, SearchField, PasswordInput, NumberInput,
  PhoneInput, OTPInput, custom Select, Combobox/MultiSelect, TagInput,
  CheckboxGroup, RadioGroup, SegmentedControl, ToggleGroup, ButtonGroup,
  SplitButton, date/time/color pickers, Calendar, FileUpload, Rating, Tooltip,
  Popover, HoverCard, Menu/ContextMenu, Breadcrumb, Pagination, Stepper, Tabs,
  Accordion/Collapsible, Alert/Callout, Banner, Toast, Card, ListItem, Stat,
  EmptyState, AvatarGroup, CodeBlock, CopyButton, Message, PromptInput,
  PriceDisplay and QuantityInput
- **Organisms:** Header/AppBar, Sidebar, NavigationMenu, BottomNavigation,
  NavigationRail, Dialog/AlertDialog/ConfirmationDialog, Sheet/Drawer,
  CommandPalette, DataTable/Table and table helpers, TreeView, FilterBar, Form,
  Wizard, Carousel, Timeline, Kanban, Scheduler/Agenda, Chart, Map, Markdown
  RichTextEditor, Chat, NotificationCenter, CommentsThread, FileManager,
  OnboardingTour, PricingTable, Footer, Toaster and theme/locale switchers
- **Layout:** Stack, Flex, Grid, Container, ScrollArea, AspectRatio and
  ResizablePanel
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

## Data-driven composites

The larger components accept arrays or nodes and emit callbacks. The host app
owns fetching, persistence, validation rules, uploads and workflow decisions.
`Chart` renders one bar or line series and includes a screen-reader data table.
`Map` is a lightweight marker canvas that accepts an optional image from the
app; it does not load map tiles or geocoding data. `RichTextEditor` edits
Markdown and returns the Markdown value. `Kanban` exposes an accessible column
selector for moving a card, while the application updates the board data.

Every catalogue component has a dedicated Storybook entry with working
examples. Use the Storybook controls to inspect variants, states and
interactions.

## Event calendar

`Calendar` and `DatePicker` select dates. `EventCalendar` displays scheduled events
in month, week, day and agenda views. It accepts event data and emits date and
event callbacks; your application owns event creation, editing and persistence.

```tsx
import { EventCalendar } from "@atomscraft/react";
import type { CalendarEvent } from "@atomscraft/react";

const events: CalendarEvent[] = [
  {
    id: "design-review",
    title: "Design review",
    start: new Date(2026, 2, 12, 10, 0),
    end: new Date(2026, 2, 12, 11, 30),
    tone: "primary",
  },
  {
    id: "release-day",
    title: "Release day",
    start: new Date(2026, 2, 13),
    end: new Date(2026, 2, 14), // All-day end is exclusive.
    allDay: true,
    tone: "success",
  },
];

<EventCalendar
  events={events}
  defaultDate={new Date(2026, 2, 12)}
  defaultView="week"
  dayStartHour={8}
  dayEndHour={18}
  slotDuration={30}
  onEventSelect={(event) => openEventDetails(event.id)}
/>;
```

`date` and `view` can be controlled with `onDateChange` and `onViewChange`.
`onDateSelect` reports a selected calendar day, and `onRangeChange` reports the
visible interval with an exclusive end. Use `views` to limit the view switcher.
The scheduler currently displays and selects events; drag-and-drop editing,
recurrence rules and resource columns are not implemented.

## Toast notifications

Mount one `Toaster` near the application root. The helper can show typed
feedback, persistent loading states and promise outcomes. Promise toasts update
in place and return the original promise, so handle rejection as usual.

```tsx
import { toast } from "@atomscraft/react";

toast.success("Profile saved", { description: "Your changes are live." });

void toast
  .promise(saveProfile(), {
    loading: "Saving profile...",
    success: "Profile saved",
    error: (error) => `Save failed: ${String(error)}`,
  })
  .catch(reportError);
```

`Toaster` supports six screen positions, a visible stack limit, newest-first
ordering, and pause-on-hover/focus. Toast options include duration, progress,
actions, dismiss controls and an `onDismiss` callback.

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

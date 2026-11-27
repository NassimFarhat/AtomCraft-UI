# AtomCraft design-system catalogue audit

This is the completed catalogue for the existing AtomCraft monorepo. New
components use the established React, core, token and CSS package boundaries;
they do not add an external component library.

## Catalogue coverage

### Atoms — 29

Button, IconButton, Toggle, Link, Text, Heading, Icon, Label, Input, Textarea,
Checkbox, Radio, Switch, Slider, Badge, Tag/Chip, Avatar, Image, Spinner,
Skeleton, ProgressBar/ProgressCircle, Meter, Divider/Separator, Kbd, Code,
VisuallyHidden, StatusDot, ColorSwatch and Logo are implemented and publicly
exported. Chip, ProgressBar and Divider are aliases of the existing Tag,
Progress and Separator implementations.

### Molecules — 49

- Forms and selection: Field, InputGroup, SearchField, PasswordInput,
  NumberInput, PhoneInput, OTPInput/PinInput, Select/CustomSelect,
  Combobox/MultiSelect, TagInput, CheckboxGroup, RadioGroup,
  SegmentedControl, ToggleGroup, ButtonGroup and SplitButton.
- Pickers and feedback: DatePicker, DateRangePicker, TimePicker,
  DateTimePicker, Calendar, ColorPicker/ColorInput, FileUpload, Rating,
  Tooltip, Popover, HoverCard, Menu/DropdownMenu and ContextMenu.
- Navigation and content: Breadcrumb, Pagination/PaginationControls, Stepper,
  Tabs, Accordion, Collapsible/Disclosure, Alert/Callout, Banner, Toast, Card,
  ListItem, Stat/StatCard/KPI, EmptyState, AvatarGroup, CodeBlock, CopyButton,
  Message, PromptInput, PriceDisplay and QuantityInput.

New controls include typed values/events, controlled and uncontrolled state
where it applies, keyboard behavior for interactive patterns, and Storybook
examples. FileUpload reports selected files; upload and storage remain with the
application.

### Organisms — 31

Header/AppBar, Sidebar, NavigationMenu, BottomNavigation, Tabs,
Dialog/AlertDialog/ConfirmationDialog, Sheet/Drawer, Toaster, CommandPalette,
DataTable, Table, TreeView, FilterBar, Form/ErrorSummary, Wizard/MultiStepForm,
Carousel, Timeline/ActivityFeed, Scheduler/Agenda, Chart, Map, RichTextEditor,
Chat, NotificationCenter, CommentsThread, FileManager, OnboardingTour,
PricingTable, Footer, LocaleSwitcher and ThemeSwitcher are covered by public
exports and Storybook examples. Aliases share their source implementation.

The new organisms accept caller data and emit interaction callbacks. They do
not fetch data, persist records, upload files, or own application workflows.
Kanban uses an accessible column selector to request a card move. Wizard leaves
field validation and values with the consuming application.

### Additional essentials — 27

- Layout: Container, Stack, Grid, Flex, ScrollArea, AspectRatio and
  ResizablePanel.
- Navigation: NavItem, NavigationRail, PaginationControls and SkipLink.
- Feedback: ConfirmationDialog, LoadingOverlay, ProgressOverlay, ErrorState
  and OfflineIndicator.
- Data display: DataList, DescriptionList, DataCard, TableToolbar,
  TableColumnVisibility, TableRowActions and TableEmptyState.
- Forms: FormActions, FormSection, FormDescription and ValidationMessage.

Where a requested name describes an existing part, the audit records the
equivalent: Field already wires its description and error messages, Form
already provides FormSection and FormActions, and DataTable already uses the
toolbar and column-visibility helpers. Public wrappers are available for the
standalone patterns requested in this catalogue.

## Foundations and implementation rules

- The existing token package covers semantic color roles, palette themes,
  light/dark modes, contrast, typography, spacing, shape, density, elevation,
  motion, opacity, z-index and documented breakpoints.
- React components use `@atomscraft/core` behavior, semantic `--ac-*` variables,
  `ac-*` classes and the central CSS entry. No token source changes were needed.
- Public components expose typed props, `data-slot`, state attributes,
  forwarded refs when appropriate, logical CSS properties and controlled state
  hooks for interactive values.
- Labels are supplied by props or provider messages. Direction-sensitive data
  values use `<bdi>` in the new display components.
- Storybook remains documentation/examples only; application data and
  persistence stay outside the component library.

## Deliberate scope boundaries

- `Chart` renders one data series as bars or a line and includes an accessible
  data table. It does not depend on a charting library.
- `Map` is a marker canvas with normalized coordinates and an optional
  application-supplied image. It does not fetch map tiles or geocode addresses.
- `RichTextEditor` is a lightweight Markdown editor with selection-aware
  formatting actions; it does not parse or render arbitrary HTML.
- `Kanban` provides keyboard-accessible column moves; native drag-and-drop is
  not included.
- `EventCalendar` covers month, week, day and agenda views with event
  selection/range callbacks. Event creation, recurrence and resource columns
  remain application features.

## Final audit

- [x] Inspected the existing package boundaries, exports, patterns, tokens,
      styles, stories and tests before implementing missing catalogue items.
- [x] Implemented and publicly exported the missing catalogue components and
      documented aliases/equivalents.
- [x] Added individual Storybook pages for the new components and examples for
      aliases and related patterns.
- [x] Added interaction tests for new molecules and organisms.
- [x] Required repository quality commands completed; results are recorded in
      `docs/DEVELOPMENT-STATUS.md`.
- [x] Opened all 136 Atoms, Molecules, Organisms and Layout Storybook component
      routes in headless Chrome; every route mounted without rendering errors
      or uncaught browser exceptions.
- [x] Visually checked the EventCalendar week view, including short and
      overlapping event labels, and confirmed the Toast success button displays
      a positioned notification. Drawer and SelectMenu interactions were also
      checked in their Storybook routes.
- [x] Fixed the Storybook toast store mismatch, calendar overlap lane sizing,
      compact event labels and narrow viewport sizing; added a regression test
      for overlap widths and compact event content.
- [x] Production Storybook index contains 456 entries: 308 stories and 148
      docs entries across 148 titles. All 136 component titles have executable
      stories.
- [x] Captured and reviewed representative desktop Storybook screenshots for
      all 136 component titles, including the additions outside Toast and
      EventCalendar.
- [x] Opened all 136 component routes at 390px and 320px. Every route mounted
      without browser exceptions or horizontal page overflow.
- [x] Reviewed dark-mode examples for Field, SelectMenu, EventCalendar, Map
      and Dialog.
- [x] Fixed the zero-sized Map canvas, the broken Image illustration, and the
      unconstrained Meter and Separator examples. The SkipLink story now
      explains its keyboard behavior and shows the focused link.
- [x] Constrained fixed-width Storybook examples for narrow viewports. Added
      compact Calendar and OTP sizing, wrapped Tooltip placement examples, and
      verified an open DatePicker popup stays in the viewport.
- [x] Checked the new component CSS files for hard-coded palette colors; none
      were found.
- [x] Opened and visually reviewed all 308 individual Storybook story routes,
      not only one representative story per component title. The complete
      sweep reported no failed mounts, browser errors or page overflow.
- [x] Fixed the Catalog canvas sizing, themed FilterBar/Kanban option menus,
      RichTextEditor paragraph rendering, and oversized standalone form-control
      examples; re-captured all 11 affected routes after the final edits.

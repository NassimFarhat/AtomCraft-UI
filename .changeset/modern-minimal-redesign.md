---
"@atomscraft/tokens": minor
"@atomscraft/css": minor
---

Modern Minimal redesign. The design system gets a new visual language. Every existing token and class name still exists, so the changes are additive.

**Tokens**

- **Colors:**
  - A graphite neutral ramp.
  - New `sky`, `cyan` and `fuchsia` palettes, and new `cyan` and `fuchsia` brand themes.
  - New surface, text and border roles: `bg-surface-sunken`, `bg-hover`, `bg-active`, `text-disabled` and `border-strong`.
  - Distinct secondary and tertiary text in dark mode.
- **Effects:** emitted per mode and brand (new `effects.ts`).
  - Layered shadows and elevation with dark-mode variants.
  - Ring and focus shadows.
  - A glass surface with blur tokens.
  - Brand gradients: solid, text, soft, border, glow and mesh.
  - Surface, sheen and fade gradients.
  - An 8-color chart series, contrast-tested.
- **Typography:** a display family, OpenType feature tokens, refined display and heading tracking, and a `label-lg` style.
- **Spacing, layout and motion:** layout container and gutter tokens, icon sizes, and `spring`/`smooth` easings.

**CSS**

- Restyled atoms, molecules, organisms and the AppShell. No React API changes.
- New shared `components/surfaces.css`: the control frame, popup surface and list rows.
- Consistent interactive states: hover on pointer devices only, explicit focus-visible styles, and loading, invalid and disabled states.
- Accessibility: 24px coarse-pointer hit areas, 16px text on touch fields, and forced-colors fallbacks.
- Vertical tabs stack on narrow screens.

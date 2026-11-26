# AtomCraft UI engineering rules

## Repository scope

- This is the existing AtomCraft UI monorepo. Do not clone, initialize, rename,
  or recreate it.
- Preserve the package names `@atomscraft/core`, `@atomscraft/tokens`,
  `@atomscraft/css`, and `@atomscraft/react`.
- Do not add Radix UI, shadcn/ui, Base UI, or another external component
  library. Reuse the existing AtomCraft primitives, hooks, utilities and tokens.
- Never push, deploy, publish, or change release state without explicit user
  authorization.

## Package boundaries

The dependency direction is one-way:

```text
tokens -> css
core   -> framework-agnostic behavior
react  -> provider, hooks, utils, icons, layout, atoms, molecules, organisms, templates
storybook -> documentation and examples only
```

Components receive data and emit events. They do not fetch data, own business
state, or contain application-specific logic.

## Component contract

- Keep public APIs typed and backwards-compatible. Extend native element props
  where appropriate, forward refs, merge classes with `cn`, and put
  `data-slot` on roots and named parts.
- Use `variant`, `tone`, `size`, and `data-*` state attributes consistently.
- Resolve defaults once for composite components with `withDefaults` or a
  dedicated hook. Support both controlled and uncontrolled state through
  `useControllableState`.
- Use `useId()` for generated relationships and follow the WAI-ARIA Authoring
  Practices keyboard pattern for interactive controls.
- Do not hardcode user-facing component text. Read built-in labels from the
  provider messages or accept text through props.
- Wrap displayed data values in `<bdi>` when their direction could change.

## Styles and tokens

- Component CSS uses semantic `--ac-*` variables and `ac-*` classes only.
- Use logical CSS properties; do not add physical left/right layout rules.
- Edit token sources under `packages/tokens/src`, then run `pnpm generate`.
  `packages/css/src/tokens.css` and `packages/tokens/tokens.json` are generated
  artifacts and must stay synchronized.
- Preserve light/dark, RTL, density, shape, contrast and localization behavior.
- Do not put raw palette colors in component CSS.

## Implementation workflow

1. Inspect the existing implementation, tests and public exports before editing.
2. Make the smallest coherent batch that fixes behavior without recreating
   completed work.
3. Add or update behavior, keyboard, accessibility and Storybook coverage with
   the change.
4. Run formatting, lint, typecheck, tests, token generation and Storybook build.
5. Update `docs/DEVELOPMENT-STATUS.md` with completed work, actual command
   results, remaining work and blockers.

## Required quality commands

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm generate
pnpm test
pnpm build-storybook
```

`pnpm install --frozen-lockfile` is the supported dependency installation
command. Keep changes reviewable and use conventional commit vocabulary if a
commit is requested.

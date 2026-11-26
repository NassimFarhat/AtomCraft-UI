# AtomCraft UI development status

## Completed: organization-scoped npm release

The four public package workspaces are published under the `atomscraft` npm
organization:

- `@atomscraft/core@0.1.0`
- `@atomscraft/tokens@0.1.0`
- `@atomscraft/css@0.1.0`
- `@atomscraft/react@0.1.0`

The repository now uses the `@atomscraft/*` scope everywhere. The earlier
`@atomcraft/*` personal-scope packages remain published as legacy packages.

## Completed: documentation release

Package READMEs now explain why each package exists, which package to install,
installation commands, working examples, API areas, themes, accessibility,
related packages and links to the repository. The documentation release is
prepared as `0.1.1` for all four packages.

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
  `0.1.0`

## Next release steps

The documentation changes are versioned as `0.1.1`. Review the generated
changes and commit them to GitHub before publishing the new npm version. Then
run the release workflow described in `docs/RELEASING.md`.

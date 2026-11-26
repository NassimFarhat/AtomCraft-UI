# Releasing AtomCraft packages

The root workspace remains private. The publishable packages are released as a
fixed version group:

- `@atomscraft/core`
- `@atomscraft/tokens`
- `@atomscraft/css`
- `@atomscraft/react`

The earlier `@atomcraft/*` packages are legacy personal-scope packages already
published on npm. They are not renamed or deleted; future releases from this
repository use the `@atomscraft/*` organization scope.

## Before the first release

1. Be an owner/member of the `atomscraft` npm organization.
2. Confirm the scope is owned by the npm account that will publish the packages.
3. Enable npm two-factor authentication.
4. Review the package contents with the commands below.

```bash
pnpm install --frozen-lockfile
pnpm generate
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm pack:check
pnpm build-storybook
```

`pack:check` must show only the package build, README, license and package
metadata. Test files, Storybook files and source-only development files should
not be shipped.

## Initial release (completed)

The initial `0.1.0` packages have been published under the `atomscraft`
organization. The command used was:

```bash
npm login
npm whoami
pnpm -r publish --access public --no-git-checks
```

The package pages display the README bundled in each package. Update the
package README, create a changeset and publish a new version when documentation
or package behavior changes; npm versions cannot be overwritten.

## Preparing future releases

Create a changeset for user-facing changes:

```bash
pnpm changeset
pnpm version-packages
pnpm install
pnpm build
pnpm test
```

## Publishing future versions

Publishing is intentionally manual until npm account ownership and the package
contents have been reviewed:

```bash
pnpm changeset publish
```

Use the pnpm/Changesets command for this workspace: it converts the internal
`workspace:*` dependency from `@atomscraft/react` to the released `@atomscraft/core`
version in the published manifest. Do not run plain `npm publish` from the
repository root or directly from `packages/react`; the root package is private
and npm does not perform that workspace conversion. Later, npm Trusted
Publishing can be configured for each package through the repository's release
workflow.

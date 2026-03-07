# Releasing taw-ui

## Single source of truth

The version in `packages/core/package.json` drives everything:
- npm publish
- Docs site version badge (auto-synced at build time)
- GitHub releases

## Steps

1. Bump the version in `packages/core/package.json`
2. Commit: `git commit -am "chore: release vX.Y.Z"`
3. Tag: `git tag vX.Y.Z`
4. Push: `git push && git push --tags`

CI will automatically:
- Run typecheck + build
- Publish to npm
- Create a GitHub release with auto-generated notes
- Vercel redeploys docs (automatic on main push)
- Docs show updated version automatically

## Pre-release checklist

- [ ] All tests pass: `pnpm typecheck && pnpm build`
- [ ] Playground works: `cd apps/playground && pnpm dev`
- [ ] No `as any` in codebase
- [ ] Schemas match docs

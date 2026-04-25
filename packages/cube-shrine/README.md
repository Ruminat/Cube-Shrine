# @shreklabs/cube-shrine

Utilities for Rubik's Cube notation, cubie-state transforms, 2D canvas rendering, and optional React helpers.

## Install

```bash
npm install @shreklabs/cube-shrine
```

## Entrypoints

- `@shreklabs/cube-shrine/core` — parser, normalizer, validators, cubie model and rotations (Node-safe).
- `@shreklabs/cube-shrine/render` — canvas drawing helpers (`drawCube`, OLL/PLL top-flat helpers).
- `@shreklabs/cube-shrine/react` — React components/hooks (`MiniCube`, `CubePaletteProvider`, input hooks).
- `@shreklabs/cube-shrine` — default bundle with core + render.

## Quick usage

```ts
import { parseNotation, createSolvedCubies, applyRotationStep } from "@shreklabs/cube-shrine/core";
import { drawCube } from "@shreklabs/cube-shrine/render";

const cubies = createSolvedCubies();
parseNotation("R U R' U'").forEach((step) => applyRotationStep(cubies, step));
drawCube(ctx, 200, cubies);
```

## Releasing (short)

- Manual local publish:
  - `npm run release:pack` (build + `npm pack --dry-run`)
  - `npm run release:publish` (checks + build + `npm publish`)
- Recommended: use the manual GitHub Actions workflow `Publish @shreklabs/cube-shrine`.
  - It can bump version automatically (`patch` / `minor` / `major` / `prerelease` or explicit version), run `prepublishOnly`, publish to npm, create git tag, and generate GitHub Release notes.
  - Required secret: `NPM_TOKEN`.

Release notes:

- Published files come from `dist/` only.
- Tags use `v<version>` format.
- GitHub release notes are generated from commits/PRs since the previous release tag.

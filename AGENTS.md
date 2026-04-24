# Cube Shrine — agent / handoff context

Copy this file (or sections) into a new chat when onboarding an agent. Keep it updated when architecture or scripts change.

## Monorepo

- **npm workspaces**: `apps/*`, `packages/*`.
- **Install**: once from repo root: `npm install`.

## `apps/web` (package name: `web`)

- **Next.js 16** App Router, **`output: "export"`** → static site in **`apps/web/out/`**.
- **Stack**: React 19, Radix Themes, SCSS, Tailwind 4 (PostCSS), TypeScript.
- **Local package**: `@shreklabs/cube-shrine` with `transpilePackages` in `next.config.mjs`.
- **Algorithm data**: `apps/web/data/` — `oll.algs.ts`, `pll.algs.ts`, `algorithms.ts`. Types: `apps/web/types/algorithm.ts` (imports `RotationStep` from `@shreklabs/cube-shrine/core`).
- **Path alias**: `@/*` → `apps/web/*`.

### UI surfaces

- **Gallery**: `apps/web/components/algorithm-gallery.tsx` → `AlgorithmGroup` → **`AlgorithmCard`**.
- **Detail modal**: **`AlgorithmModal`** — notation, reverse toggle, copy, **3D `CubeRenderer`**, and (when prefs allow) **OLL/PLL top-flat** previews matching the cards.
- **Top flat toggles**: `apps/web/lib/client-storage/top-flat-view.ts` + `apps/web/lib/top-flat-view-prefs.ts` — per-category switches in `AlgorithmGroup` for OLL and PLL.
- **PLL forward sheet mode**: optional `pllTopFlatApplyMoves: "forward"` on `Algorithm` (`apps/web/types/algorithm.ts`). Used for **test** PLL entries in `pll.algs.ts` (`test-d`, `test-u`, …): applies `parseNotation(displayNotation)` then **`pllSheetAlignYSteps`** (`y2`) so the top-flat diagram matches the package frame. Real PLL cases (Ua, T, …) use the default **inverse** path: `parseReversedNotation(displayNotation)` plus lexicographic-min whole-cube `y` in the library.

## `packages/cube-shrine` (`@shreklabs/cube-shrine`)

- **Role**: Cubie model, notation, rotations, Canvas 2D render, optional React.
- **Build**: Vite → four ESM bundles + `.d.ts`: `core`, `render`, `react`, `index` (see `package.json` **`exports`**).
- **Tests**: Vitest (`npm run test` from root runs this workspace).
- **Storybook 8**: only in this package; stories in `stories/`, config in `.storybook/`.
- **`dist/`**: gitignored; CI `npm run build` builds the library before Next.

### Library entrypoints (`exports`)

| Subpath | Contents |
|---------|----------|
| `@shreklabs/cube-shrine` | Core + render, **no** React. |
| `@shreklabs/cube-shrine/core` | Model, `rotation`, notation (`parseNotation`, `invertNotationSequence`, `parseReversedNotation`), PLL/OLL helpers, **`validateAlgorithm`**, **`normalizeAlgorithm`**, **`validatePLLAlgorithm`**, **`validateOLLAlgorithm`**, **`ATOMIC_MOVE_FACES`**, **`allAtomicMoveNotations()`**, etc. Node-safe. |
| `@shreklabs/cube-shrine/render` | `drawCube`, `getPaletteFromCSS`, OLL/PLL flat canvas helpers (`drawPllTopPatternOnCanvas`, …). |
| `@shreklabs/cube-shrine/react` | `MiniCube`, `CubePaletteProvider`, `useCubeRenderer`, `useAlgorithmInput`, `useAlgorithmTextArea`, other hooks. Peers: `react`, `react-dom`. |

**Note:** `src/entry-*.ts` files intentionally re-export for npm subpaths (exception to “no barrels” for published API).

### Solved cube / colors (`createSolvedCubies` in `src/core/rotation.ts`)

World-axis palette (tests depend on it):

- **+z front**: blue · **−z back**: green · **+x right**: red · **−x left**: orange  
- **+y U**: yellow · **−y D**: white  

`drawCube` shows faces `y+`, `x+`, `z+` (isometric corner). Top-flat diagrams treat **+z as front**.

### Notation

- **`parseNotation`**: tokenizes; expands `(...)` like inner `parseNotation`.
- **`invertNotationSequence`**: reverses tokens and inverts each move; preserves bracket structure.
- **`parseReversedNotation`**: PLL-style prep (reverse order, invert each angle). Used with **`MiniCube`**, site cards, and **`getPllTopViewFromNotation`** default mode.
- **Atomic moves**: `src/core/notation/atomicMoves.ts` — 48 tokens; **no lowercase `b`** in the model.
- **`validateAlgorithm` / `normalizeAlgorithm`**: `src/core/notation/algorithmFormat.ts` — strict validation + canonical spacing / `U2'` → `U2`.

### PLL top-flat view (`getPllTopViewFromNotation`)

- **File**: `src/core/pll/getPllTopViewFromNotation.ts`.
- **Default (inverse)**: `parseReversedNotation` from solved, try four whole-cube `y` quarter-turns, pick **lexicographic-min** color pattern (`extractPllTopColorPatternFromCubies`).
- **`applyMoves: "forward"`**: `parseNotation` from solved, then **`pllSheetAlignYSteps`** (no `y` scan).
- **Arrows**: **`computePllArrowsFromCubies`** maps each U non-center slot to its solved **home** by **`cubieColorBagSignature`**; 2-cycles become double-headed segments. Arrows are drawn only when **`face9`** is all **yellow** (PLL-oriented U). **Inverse** mode also requires **`validatePLLAlgorithm(notation)`** to return `undefined`. **Forward** mode skips that reversed-prep check (sheet strings are not validated as reversed PLL) but still requires an all-yellow U face. There is **no** `getArrows` override anymore (removed `apps/web/data/pll.diagrams.ts`).
- **PLL validation**: `src/core/pll/validatePllAlgorithm.ts` — syntax, `canWholeCubeYAlignToPllWorldFrame`, **`pllYCanonicalizationIsUnique`** (ambiguous `y` tie → error string).
- **OLL validation**: `src/core/oll/validateOllAlgorithm.ts` — syntax, reject PLL-phase states, then require **`hasLowerTwoLayersForSomeWholeCubeY`**. Helpers in `src/core/pll/lastLayerCaseUtils.ts`.

### TypeScript in the library package

- **`tsconfig.json`** maps `@shreklabs/cube-shrine`, `/core`, `/render`, `/react` to **`src/entry-*.ts`** so `tsc` and stories resolve types **without** a prior `dist` build.
- Also maps `@/*` → `../../apps/web/*` for Storybook imports of site algorithm data.

### ESLint (`packages/cube-shrine/eslint.config.mjs`)

- Under **`src/`** but not **`src/react/`**: forbid **`react` / `react-dom`** imports (React only in `src/react`, plus stories / `.storybook`).
- **`@radix-ui/themes`**: allowed only under **`stories/`** and **`.storybook/`** (Storybook-only dep).

### Storybook

- **`.storybook/main.ts`**: Vite `resolve.alias` — `@shreklabs/cube-shrine/react`, `/render`, `/core` **before** bare `@shreklabs/cube-shrine`; **`@/`** → `apps/web` for shared algorithm lists.
- **`.storybook/preview.tsx`**: Radix Theme + global styles + `CubePaletteProvider`.
- **Story groups**: e.g. `The cube/Basic moves`, `The cube/OLL`, `The cube/PLL`, `Examples/VanillaJS`, **`Utilities`** (notation + **PLL/OLL case validation**), **`Components`** (MiniCube, algorithm field hooks).
- **OLL/PLL stories**: pull cases from `apps/web/data` via `stories/siteAlgorithmCases.ts`; **top-flat** shows **`drawPllTopPatternOnCanvas`** with library arrows.

## Root scripts (`package.json`)

| Script | What it runs |
|--------|----------------|
| `npm run dev` | Next dev (`web`). |
| `npm run build` | Build `@shreklabs/cube-shrine` then `web`. |
| `npm run test` | Vitest in `@shreklabs/cube-shrine`. |
| `npm run lint` | ESLint: `web` then `@shreklabs/cube-shrine`. |
| `npm run typecheck` | `tsc --noEmit` in library then `web`. |
| `npm run codecheck` | Per-workspace `typecheck && lint` (library, then web). |
| `npm run storybook` / `build-storybook` | Storybook in `packages/cube-shrine`. |

## Conventions

- **`.cursor/rules/project-conventions.mdc`**: named exports, no internal barrel files, direct concrete imports, functional React + hooks, strict TS, user-facing text in English. Next route files may use a thin default export alias to a named component.

## CI / known gotchas

- **GitHub Actions** builds with `npm run build` and deploys **`apps/web/out`** (see `.github/workflows/deploy-pages.yml`).
- **Library `npm run build`** can fail on some machines with **`ajv/dist/core`** (api-extractor / `vite-plugin-dts`) — environment-specific; fixing may mean aligning `ajv` / `@microsoft/api-extractor` versions.

## Human docs

- **`README.md`**: overview, scripts, Storybook, deployment, data layout.

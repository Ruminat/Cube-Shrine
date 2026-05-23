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
- **TypeScript**: repo root **`tsconfig.json`** — shared compiler defaults (`strict`, indexed-access safety, unused/unreachable checks, `verbatimModuleSyntax`, `moduleResolution: "bundler"`, etc.); `"files": []` so the root is a base only. Extended by **`apps/web/tsconfig.json`** and **`packages/cube-shrine/tsconfig.json`**.

### Routes

- **`/`** — algorithm gallery home (`apps/web/app/page.tsx`).
- **`/timer`** — speed timer (`apps/web/app/timer/` + **`TimerPage`**).

### Timer (`/timer`)

- **UI**: `apps/web/components/TimerPage/TimerPage.tsx` (client) composes pieces in that folder (`TimerScrambleCard`, `TimerSessionAside`, overlays, etc.). **3D `CubeRenderer`** prep rotations are **`[...parseNotation("x2"), ...parseNotation(scramble)]`** — the displayed scramble omits the leading **`x2`**. Scramble line uses **`AlgorithmNotation`** (`centered` prop + `.notationCentered` in SCSS so centering wins over default `.notation`). `TimerScrambleCard` includes **Start** and **Skip scramble** actions (desktop and mobile variants).
- **State / inputs**: `useTimerPageController.ts` composes focused hooks (`useTimerScramble`, `useTimerRunningClock`, `useTimerHoldKeys`, …) so phase and keyboard behavior stay easy to follow.
- **Scramble generator**: `apps/web/lib/generate-scramble.ts` — only `U`/`D`/`L`/`R`/`F`/`B` with `'` / `2` / plain; never the same face twice in a row; never two moves on the same axis back-to-back (e.g. `R` then `L`). `useTimerScramble` persists the **current** scramble in localStorage and rotates it only when solve completes or user clicks **Skip scramble**.
- **Solves storage**: **`useTimerSolveTimes`** in `apps/web/lib/client-storage/timer-solves.ts` stores `SolveEntry[]` in IndexedDB via `idb-keyval` (`cube-shrine-timer` DB, `timer-solves` store). `SolveEntry` shape: `{ time, scramble, penalty? }` where penalty is `"+2"` / `"DNF"` (no sentinel numeric encoding). History capped to **last 2000** solves.
- **Session aside**: `TimerSessionAside` shows newest solves first (display only; original indices are preserved for selection), the whole aside column scrolls (`overflow-y-auto`) instead of an inner solves-only scroll box, and header actions include **Save session data as...** (`DropdownMenu`: Text/JSON) plus **Clear the session**. Save/export is disabled when there are no solves.
- **Session export dialog**: `TimerSessionExportDialog` renders either text export (one solve per line: `MM:SS.cc [+2|DNF] scramble`) or JSON export (same `SolveEntry[]` structure persisted to IndexedDB). Footer actions are **Close** and **Copy & Close**; initial focus is forced to **Copy & Close** via `Dialog.Content` `onOpenAutoFocus`.
- **Solve details modal**: `TimerSolveDetailsDialog` shows **Time** (renamed from Result), solve number/rank helper tooltips, scramble + copy action, title-level `+2`/`DNF` toggles (with tooltips), footer `Delete` (with confirmation) and **Close** (auto-focused).
- **Statistics visuals**: `TimerStatsChart` renders a uPlot line **Graph** and a binned **Histogram** stacked vertically.
- **Overlays**: Green **hold** screen and **running** fullscreen timer use **`createPortal`** into a mount node **inside** Radix **`Theme`** (see `FullscreenPortalTargetContext` + trailing **`ref` div** in `apps/web/components/radix-cube-providers.tsx`, consumed via **`useFullscreenPortalTarget`**) so typography matches the themed app. High z-index, **`pointer-events-auto`**, and capture **`onPointerDown`** so underlying UI is not clickable. A short **`blockStartClickUntilRef`** after stop avoids the mobile **Start** button receiving a tail **click** that restarts the timer.
- **Marketing title typography (shared)**: `apps/web/lib/marketing-hero-title-class.ts` — **`MARKETING_HERO_TITLE_CLASS`** is the exact Tailwind string used on the home hero **`h1`** (“Master the CFOP Method”) and on timer readouts (idle + running).

### Header & navigation

- **File**: `apps/web/components/header.tsx` — logo/title link home; **Algorithms** (`/`) and **Timer** (`/timer`) with active styling; **theme** `IconButton` on **`md+` only**.
- **Mobile (`< md`)**: **`Menu`** opens a **Radix `Dialog`** panel from the **right** (drawer-style) with the same links + **Appearance** (theme toggle on its own line below the label). Burger trigger is wrapped in **`flex md:hidden`** so Radix `IconButton` styles cannot override `md:hidden`. **`useMediaQuery("(min-width: 768px)")`** closes the drawer when crossing the breakpoint.
- **Route transitions**: optional full-screen blur overlay while **`router.push`** runs (same file).

### UI surfaces

- **Gallery**: `apps/web/components/algorithm-gallery.tsx` → `AlgorithmGroup` → **`AlgorithmCard`**.
- **Detail modal**: **`AlgorithmModal`** — notation, reverse toggle, copy, **3D `CubeRenderer`**, **PLL top-flat** (always), and **OLL top-flat** when the OLL toggle is on.
- **Top flat toggles (OLL + PLL)**: `apps/web/lib/client-storage/top-flat-view.ts` + `apps/web/lib/top-flat-view-prefs.ts` — switches in `AlgorithmGroup`, persisted via `@nanostores/persistent`.
- **Collapsed group/subgroup state**: `apps/web/lib/client-storage/hidden-disclosures.ts` + `apps/web/lib/hidden-disclosures-prefs.ts` — persisted disclosure visibility (hidden IDs) via `@nanostores/persistent`.
- **Algorithm notation display**: merged list in `apps/web/data/algorithms.ts` runs `normalizeAlgorithm` on each record; `AlgorithmCard` / `AlgorithmModal` also normalize forward and reversed strings for display, copy, and previews.
- **Buttons**: `header.tsx` theme toggle and algorithm **card/modal** icon actions use **Radix Themes** `IconButton` (not `@/components/ui/button`) for default styling; modal **Close** remains Radix `Button`.
- **PLL on the site**: `parseReversedNotation(displayNotation)` plus **`pllCanonicalYQuarterTurns`** whole-cube `y` steps on **`MiniCube` / `CubeRenderer`**, matching `getPllTopViewFromNotation` (see library section). Algorithm data lives in **`apps/web/data/pll.algs.ts`** (subgroups: edges, corners, adjacent, diagonal, G — no separate “test” group).

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

`drawCube` shows faces `y+`, `x+`, `z+` (isometric corner). Top-flat U nets use the same axes: **top** = −z (back, green), **bottom** = +z (front, blue), **left** = −x (orange), **right** = +x (red).

- **OLL top-flat** (`getCanonicalOllTopPatternFromNotation` in `src/core/oll/getOllTopPatternFromNotation.ts`): inverse prep only — `parseReversedNotation` from solved, then `extractOllTopPatternFromCubies` in a **fixed** world frame (no whole-cube `y` scan; `yQuarterTurns` is always `0`). **`AlgorithmCard` / `AlgorithmModal`** use the same `parseReversedNotation` list for **3D** as for the flat diagram (PLL still appends `pllCanonicalYQuarterTurns` when non-zero).
- **PLL canonical `y` on 3D**: `getPllTopViewFromNotation` returns **`pllCanonicalYQuarterTurns`** (inverse mode). The site appends the same `y` steps after `parseReversedNotation` on **`MiniCube` / `CubeRenderer`** so the isometric cube matches the top-flat diagram.

### Notation

- **`parseNotation`**: tokenizes; expands `(...)` like inner `parseNotation`.
- **`invertNotationSequence`**: reverses tokens and inverts each move; preserves bracket structure.
- **`parseReversedNotation`**: PLL-style prep (reverse order, invert each angle). Used with **`MiniCube`**, site cards, and **`getPllTopViewFromNotation`** default mode.
- **Atomic moves**: `src/core/notation/atomicMoves.ts` — 48 tokens; **no lowercase `b`** in the model.
- **`validateAlgorithm` / `normalizeAlgorithm`**: `src/core/notation/algorithmFormat.ts` — strict validation + canonical spacing / `U2'` → `U2`.

### PLL top-flat view (`getPllTopViewFromNotation`)

- **File**: `src/core/pll/getPllTopViewFromNotation.ts`.
- **Default (inverse)**: `parseReversedNotation` from solved, try four whole-cube `y` quarter-turns, pick the candidate with **fewest arrow segments**, then smallest **`y`** index, then **lexicographic-min** color pattern (`extractPllTopColorPatternFromCubies`). **`pllCanonicalYQuarterTurns`** records the winning `y` count for the 3D preview.
- **`applyMoves: "forward"`** (optional API, not used by site data): `parseNotation` from solved (no `y` scan); Vitest uses this for forward-path coverage.
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

- **`.storybook/main.ts`**: Vite `resolve.alias` — `@shreklabs/cube-shrine/react`, `/render`, `/core` **before** bare `@shreklabs/cube-shrine`; **`@/`** → `apps/web` for shared algorithm lists. **`stories` glob** includes `**/*.mdx` and `**/*.stories.@(ts|tsx)`.
- **`.storybook/preview.tsx`**: Radix Theme + global styles + `CubePaletteProvider`.
- **Story groups**: e.g. `The cube/Basic moves`, `The cube/OLL`, `The cube/PLL`, **`Examples/VanillaJS (no React)`** (`VanillaCanvas.stories.tsx`), **`Utilities`** (notation + **PLL/OLL case validation**), **`Components`** (MiniCube, algorithm field hooks).
- **OLL/PLL stories**: pull cases from `apps/web/data` via `stories/siteAlgorithmCases.ts`; **top-flat** shows **`drawPllTopPatternOnCanvas`** with library arrows.
- **MDX docs** (`stories/*.mdx`):
  - `Docs/Getting started` — `GettingStarted.mdx`; embeds **`PlainCanvas`** from `VanillaCanvas.stories.tsx` via `<Canvas of={VanillaCanvasStories.PlainCanvas} />` from `@storybook/blocks`. **`PlainCanvas` `render` is inlined** in that file so autodocs/MDX show meaningful source (not only a wrapper component).
  - `Docs/Core entrypoint`, `Docs/Render entrypoint`, `Docs/React entrypoint` — short entrypoint guides.
  - **Release** docs live only in **`packages/cube-shrine/README.md`** (no release MDX).

## Root scripts (`package.json`)

| Script | What it runs |
|--------|----------------|
| `npm run dev` | Next dev (`web`). |
| `npm run build` | Build `@shreklabs/cube-shrine` then `web`. |
| `npm run test` | Vitest in `@shreklabs/cube-shrine`. |
| `npm run lint` | ESLint: `web` then `@shreklabs/cube-shrine`. |
| `npm run typecheck` | `tsc --noEmit` in library then `web`. |
| `npm run codecheck` | Per-workspace checks: library `typecheck && lint && test`, then web `typecheck && lint && test`. Both extend root **`tsconfig.json`**. |
| *(git hook)* | After `npm install`, **pre-commit** on `main`/`master` runs root `codecheck` (`scripts/pre-commit.mjs` + `simple-git-hooks`). |
| `npm run storybook` / `build-storybook` | Storybook in `packages/cube-shrine`. |

## NPM publishing (`@shreklabs/cube-shrine`)

- Package lives in `packages/cube-shrine`; **`private: false`**, **`publishConfig.access: "public"`**; tarball **`files`** is **`dist/`** only.
- Release helpers (run from repo root with `-w` or from `packages/cube-shrine`):
  - `npm run release:pack` — build + `npm pack --dry-run`
  - `npm run release:publish` — `prepublishOnly` then `npm publish --access public`
- `prepublishOnly` runs `npm run codecheck && npm run build`.
- **Manual workflow**: `.github/workflows/publish-npm.yml` — `workflow_dispatch`; bumps version (`npm version` in workspace), `prepublishOnly`, `npm publish` with provenance, pushes branch + `v*` tag; **`create_github_release`** input defaults **true** → `gh release create` with **`--generate-notes`** (GitHub Release only, not `CHANGELOG.md` in repo).

## Conventions

- **`.cursor/rules/project-conventions.mdc`**: named exports, no internal barrel files, direct concrete imports, functional React + hooks, strict TS, user-facing text in English. Next route files may use a thin default export alias to a named component.
- **UI primitives** (`apps/web`): prefer built-in **Radix Themes** components first (e.g. `SegmentedControl`, `RadioCards`, `Button`, `IconButton`, `Select`) and only create custom controls when Radix cannot cover the interaction.

## CI / known gotchas

- **GitHub Actions** builds with `npm run build` and deploys **`apps/web/out`** (see `.github/workflows/deploy-pages.yml`).
- **Manual npm release workflow**: `.github/workflows/publish-npm.yml` bumps `@shreklabs/cube-shrine` version, runs `prepublishOnly`, publishes to npm, pushes commit/tag, and can create a GitHub Release. Requires repo secret `NPM_TOKEN`.
- **Library `npm run build`**: JS via Vite; **`.d.ts`** via `tsc -p tsconfig.build-dts.json` (no `vite-plugin-dts` / api-extractor).

## Human docs

- **`README.md`**: overview, scripts, Storybook, deployment, data layout, external **library install/usage**, automated npm publish via Actions.
- **`packages/cube-shrine/README.md`**: library-focused quickstart, entrypoints, and **releasing** (local scripts + GitHub Actions + `NPM_TOKEN`).

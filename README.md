# Cube Shrine

Static [Next.js](https://nextjs.org/) app for browsing CFOP-style algorithms with **isometric cube previews** (Canvas 2D). TypeScript, SCSS modules, and [Radix Themes](https://www.radix-ui.com/themes) for layout and UI.

## Features

- **Algorithm gallery** grouped by category (`OLL`, `PLL`; `F2L` reserved for future data). OLL and PLL use **named subgroups** (shapes, perm types, etc.).
- **Per-card preview**: small cube drawn from parsed notation; **reverse notation** toggle, **copy**, and **open details**.
- **Modal** with description, notation, and a larger cube preview.
- **Theme**: light/dark toggle with `localStorage` and `data-theme` on `:root`.
- **Performance**: list cubes mount only when **near the viewport**; **small** cube canvases use **lower DPR** and **simpler fills**; one root observer drives palette updates (`CubePaletteProvider`).

## Tech stack

- `next@16` (App Router, **`output: "export"`** for static hosting)
- `react@19`
- `@radix-ui/themes`, `@radix-ui/react-icons`
- `typescript`, `sass`

Cube graphics are custom **2D canvas** code under `components/Cube/`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # emits `out/` — serve that folder with any static host (e.g. `npx serve out`)
```

```bash
npm run lint
```

## Styling and theming

Design tokens live in `styles/variables.scss` (cube colors, size, surfaces, motion, etc.). Cube face colors are read at draw time from CSS variables such as `--cube-color-*`. Theme changes are observed once in `components/Cube/CubePaletteContext.tsx` and propagate to all cube redraws.

## Cube rendering

- **Model**: 27 cubies with stickers; preparation moves come from parsed notation (`lib/notation`).
- **`useCubeRenderer`**: creates a canvas, applies preparation rotations, exposes redraw/cleanup.
- **Size-based canvas quality**: below `CUBE_FULL_QUALITY_MIN_SIZE_PX` (`components/Cube/definitions.ts`), drawing uses `CUBE_PREVIEW_DPR_CAP`, compact sticker fills, and `pointer-events: none` on the mount (card thumbnails). Larger cubes use `CUBE_DETAIL_DPR_CAP` and full gradients.
- **Viewport-aware mounting** – Cube canvases render only when near the visible area
- **Adaptive canvas quality** – Thumbnails use lower DPR caps (1.5x) and simpler fills; modals render at full quality (2.0x)
- **Single palette observer** – Theme changes trigger one redraw pass across all visible cubes
- **`pointer-events: none`** – Thumbnail canvases don't intercept mouse events, reducing compositing overhead

## Deployment

GitHub Actions (`.github/workflows/deploy-pages.yml`) builds with `GITHUB_ACTIONS=true` so `next.config.ts` can set `basePath` / `assetPrefix` for **GitHub Pages** project sites. User/org `*.github.io` repos skip the extra base path.

## Data

- `data/oll.algs.ts`, `data/pll.algs.ts` — algorithm records.
- `data/algorithms.ts` — merged list, category order, and subgroup grouping helpers.

Extend types in `types/algorithm.ts` and add sources the same way.

## Conventions

See `.cursor/rules/project-conventions.mdc`.

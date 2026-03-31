# Cube Shrine

Interactive Rubik's Cube algorithm visualizer built with Next.js App Router, TypeScript, SCSS Modules, and Three.js.

## Features

- 3D mini-cube rendering per algorithm card (independent Three.js scene per cube)
- Algorithm gallery with categories (`PLL`, `OLL`, `F2L`)
- Modal with enlarged cube preview and detailed algorithm info
- Live settings panel:
  - face color pickers (CSS variables)
  - cube size control
  - glassmorphism toggle
  - light/dark theme switch with `localStorage` persistence
- CSS-variable driven theming and visual tokens
- Strict TypeScript + functional components + hooks

## Tech Stack

- `next@16` (App Router)
- `react@19`
- `typescript`
- `three`
- `sass` (SCSS + CSS Modules)

## Getting Started

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm run start
```

## Styling and Theming

All visual customization is controlled through CSS variables in `styles/variables.scss`.

Key tokens include:

- cube face colors (`--cube-color-*`)
- cube dimensions (`--cube-size`, `--cube-element-size`, `--cube-gap`)
- UI colors (`--bg-*`, `--text-*`, `--card-*`, `--accent`)
- effects and motion (`--blur-amount`, `--transition-*`)

The app supports:

- automatic color-scheme defaults via `prefers-color-scheme`
- explicit theme override through `data-theme="light|dark"` on `:root`

## Cube Rendering Notes

- Cubes are created as 27 cubies with spacing.
- Face materials are derived from CSS variables.
- `useCSSVariables` tracks root style/theme changes with `MutationObserver`.
- `useCubeRenderer` manages scene lifecycle, controls, preparation rotations, and cleanup.

## Conventions

Project conventions are persisted in `.cursor/rules`.

## Data Source

Algorithms are currently stored in `data/algorithms.ts` as typed static data.

You can expand this list or replace it with a backend/API source later.

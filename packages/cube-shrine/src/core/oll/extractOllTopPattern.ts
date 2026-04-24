import type { Cubie, NormalKey, PaletteKey } from "../cubieModel";

/** Row-major from diagram top (front / +z) to bottom (back / −z); columns left (−x) to right (+x). */
export type OllTopFace9 = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean
];

/**
 * Yellow on sides visible in the flat top view. Keys name diagram edges:
 * - `top` / `bottom`: toward +z / −z (front / back of the physical cube).
 * - `left` / `right`: toward −x / +x.
 */
export type OllCornerIndicators = {
  topLeft: { top: boolean; left: boolean };
  topRight: { top: boolean; right: boolean };
  bottomLeft: { bottom: boolean; left: boolean };
  bottomRight: { bottom: boolean; right: boolean };
};

/** Yellow on U-layer edge cubies (not corners), on the side facing outward in the flat diagram. */
export type OllEdgeMidIndicators = {
  /** Front (+z) on cubie (0, 1, 1) — bar above the middle column. */
  topCenter: boolean;
  /** Back (−z) on cubie (0, 1, −1) — bar below the middle column. */
  bottomCenter: boolean;
  /** Left (−x) on cubie (−1, 1, 0) — bar left of the middle row. */
  leftMiddle: boolean;
  /** Right (+x) on cubie (1, 1, 0) — bar right of the middle row. */
  rightMiddle: boolean;
};

export type OllTopPattern = {
  face: OllTopFace9;
  corners: OllCornerIndicators;
  edgeMids: OllEdgeMidIndicators;
};

const isYellowOn = (stickers: Partial<Record<NormalKey, PaletteKey>>, normal: NormalKey): boolean =>
  stickers[normal] === "yellow";

const findCubie = (cubies: Cubie[], x: number, y: number, z: number): Cubie | undefined =>
  cubies.find((c) => c.x === x && c.y === y && c.z === z);

/**
 * Reads U-face yellow pattern and corner side stickers from the current cubie state.
 * Diagram: front (+z) at the top of the grid, back (−z) at the bottom (standard OLL cheat sheets).
 */
export function extractOllTopPatternFromCubies(cubies: Cubie[]): OllTopPattern {
  const face: OllTopFace9 = [false, false, false, false, false, false, false, false, false];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const z = 1 - row;
      const x = -1 + col;
      const cubie = findCubie(cubies, x, 1, z);
      if (cubie) {
        face[row * 3 + col] = isYellowOn(cubie.stickers, "y+");
      }
    }
  }

  const tl = findCubie(cubies, -1, 1, 1);
  const tr = findCubie(cubies, 1, 1, 1);
  const bl = findCubie(cubies, -1, 1, -1);
  const br = findCubie(cubies, 1, 1, -1);
  const topEdge = findCubie(cubies, 0, 1, 1);
  const bottomEdge = findCubie(cubies, 0, 1, -1);
  const leftEdge = findCubie(cubies, -1, 1, 0);
  const rightEdge = findCubie(cubies, 1, 1, 0);

  return {
    face,
    corners: {
      topLeft: {
        top: tl ? isYellowOn(tl.stickers, "z+") : false,
        left: tl ? isYellowOn(tl.stickers, "x-") : false
      },
      topRight: {
        top: tr ? isYellowOn(tr.stickers, "z+") : false,
        right: tr ? isYellowOn(tr.stickers, "x+") : false
      },
      bottomLeft: {
        bottom: bl ? isYellowOn(bl.stickers, "z-") : false,
        left: bl ? isYellowOn(bl.stickers, "x-") : false
      },
      bottomRight: {
        bottom: br ? isYellowOn(br.stickers, "z-") : false,
        right: br ? isYellowOn(br.stickers, "x+") : false
      }
    },
    edgeMids: {
      topCenter: topEdge ? isYellowOn(topEdge.stickers, "z+") : false,
      bottomCenter: bottomEdge ? isYellowOn(bottomEdge.stickers, "z-") : false,
      leftMiddle: leftEdge ? isYellowOn(leftEdge.stickers, "x-") : false,
      rightMiddle: rightEdge ? isYellowOn(rightEdge.stickers, "x+") : false
    }
  };
}

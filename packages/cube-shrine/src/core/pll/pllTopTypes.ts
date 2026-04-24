import type { PaletteKey } from "../cubieModel";

/** One cell on the 3×3 U-face grid: row 0 = diagram top (front / +z), col 0 = left (−x). */
export type PllGridCell = {
  row: 0 | 1 | 2;
  col: 0 | 1 | 2;
};

/**
 * Arrow between two U-layer piece slots (corners or edges).
 * `doubleHeaded` defaults to true; set false for one-way (head at `to`, e.g. U / A cycle diagrams).
 */
export type PllTopArrow = {
  from: PllGridCell;
  to: PllGridCell;
  doubleHeaded?: boolean;
};

export type PllTopColorPattern = {
  /** y+ sticker on each U-face position, row-major. */
  face9: PaletteKey[];
  /** z+ on (−1,1,1), (0,1,1), (1,1,1). */
  topStrip: [PaletteKey, PaletteKey, PaletteKey];
  /** z− on (−1,1,−1), (0,1,−1), (1,1,−1). */
  bottomStrip: [PaletteKey, PaletteKey, PaletteKey];
  /** x− on (−1,1,1), (−1,1,0), (−1,1,−1) — top → bottom of diagram. */
  leftStrip: [PaletteKey, PaletteKey, PaletteKey];
  /** x+ on (1,1,1), (1,1,0), (1,1,−1). */
  rightStrip: [PaletteKey, PaletteKey, PaletteKey];
};

export type PllTopViewModel = PllTopColorPattern & {
  arrows: PllTopArrow[];
};

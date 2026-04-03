import type { PaletteKey } from "@/components/Cube/definitions";

/** One cell on the 3×3 U-face grid: row 0 = diagram top (front / +z), col 0 = left (−x). */
export type PllGridCell = {
  row: 0 | 1 | 2;
  col: 0 | 1 | 2;
};

/** Straight double-headed arrow between two U-layer piece slots (corners or edges). */
export type PllTopArrow = {
  from: PllGridCell;
  to: PllGridCell;
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

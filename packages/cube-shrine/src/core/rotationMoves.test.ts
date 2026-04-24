import { describe, expect, it } from "vitest";
import type { Cubie, NormalKey, PaletteKey } from "./cubieModel";
import { allAtomicMoveNotations } from "./notation/atomicMoves";
import { invertNotationSequence, parseNotation, parseReversedNotation } from "./notation/parser";
import { applyRotationStep, createSolvedCubies } from "./rotation";

const SOLVED_SERIAL = serializeCubies(createSolvedCubies());

const SOLVED_STICKER_COUNTS: Record<PaletteKey, number> = {
  white: 9,
  yellow: 9,
  red: 9,
  orange: 9,
  green: 9,
  blue: 9
};

/** Stable string of the full cube (positions + sticker colors); used for equality after sequences. */
function serializeCubies(cubies: Cubie[]): string {
  return [...cubies]
    .sort((a, b) => a.x - b.x || a.y - b.y || a.z - b.z)
    .map((c) => {
      const keys = Object.keys(c.stickers).sort() as NormalKey[];
      const parts = keys.map((k) => `${k}:${c.stickers[k]}`);
      return `${c.x},${c.y},${c.z}|${parts.join(",")}`;
    })
    .join(";");
}

function countStickersByColor(cubies: Cubie[]): Record<PaletteKey, number> {
  const tallies: Record<PaletteKey, number> = {
    white: 0,
    yellow: 0,
    red: 0,
    orange: 0,
    green: 0,
    blue: 0
  };
  for (const c of cubies) {
    for (const color of Object.values(c.stickers)) {
      if (color) tallies[color] += 1;
    }
  }
  return tallies;
}

describe("atomic moves from solved (colors + state)", () => {
  it.each(allAtomicMoveNotations())(
    "invertNotationSequence round-trip restores solved state for %s",
    (notation) => {
      const cubies = createSolvedCubies();
      parseNotation(notation).forEach((step) => applyRotationStep(cubies, step));
      parseNotation(invertNotationSequence(notation)).forEach((step) => applyRotationStep(cubies, step));
      expect(serializeCubies(cubies)).toBe(SOLVED_SERIAL);
    }
  );

  it.each(allAtomicMoveNotations())(
    "each face sticker color count stays 9×6 after %s",
    (notation) => {
      const cubies = createSolvedCubies();
      parseNotation(notation).forEach((step) => applyRotationStep(cubies, step));
      expect(countStickersByColor(cubies)).toEqual(SOLVED_STICKER_COUNTS);
    }
  );
});

/** Face turns only: every cubie still on that face keeps the same center color on that axis. */
const FACE_LAYER_INVARIANTS: {
  notations: string[];
  onFace: (c: Cubie) => boolean;
  normal: NormalKey;
  color: PaletteKey;
}[] = [
  { notations: ["U", "U'", "U2"], onFace: (c) => c.y === 1, normal: "y+", color: "yellow" },
  { notations: ["D", "D'", "D2"], onFace: (c) => c.y === -1, normal: "y-", color: "white" },
  { notations: ["R", "R'", "R2"], onFace: (c) => c.x === 1, normal: "x+", color: "red" },
  { notations: ["L", "L'", "L2"], onFace: (c) => c.x === -1, normal: "x-", color: "orange" },
  { notations: ["F", "F'", "F2"], onFace: (c) => c.z === 1, normal: "z+", color: "blue" },
  { notations: ["B", "B'", "B2"], onFace: (c) => c.z === -1, normal: "z-", color: "green" }
];

describe("face-turn layer colors (world-axis stickers)", () => {
  it.each(FACE_LAYER_INVARIANTS.flatMap((row) => row.notations.map((n) => [n, row] as const)))(
    "%s keeps the same center color on every cubie still on that face",
    (notation, row) => {
      const cubies = createSolvedCubies();
      parseNotation(notation).forEach((step) => applyRotationStep(cubies, step));
      for (const c of cubies) {
        if (!row.onFace(c)) continue;
        expect(c.stickers[row.normal]).toBe(row.color);
      }
    }
  );
});

describe("parseReversedNotation on the cube", () => {
  it("undoes parseNotation for a bracketed OLL-style chunk", () => {
    const notation = "(R U R' U')";
    const cubies = createSolvedCubies();
    parseNotation(notation).forEach((step) => applyRotationStep(cubies, step));
    parseReversedNotation(notation).forEach((step) => applyRotationStep(cubies, step));
    expect(serializeCubies(cubies)).toBe(SOLVED_SERIAL);
  });

  it("undoes a longer mixed sequence", () => {
    const notation = "F (R U R' U') F'";
    const cubies = createSolvedCubies();
    parseNotation(notation).forEach((step) => applyRotationStep(cubies, step));
    parseReversedNotation(notation).forEach((step) => applyRotationStep(cubies, step));
    expect(serializeCubies(cubies)).toBe(SOLVED_SERIAL);
  });
});

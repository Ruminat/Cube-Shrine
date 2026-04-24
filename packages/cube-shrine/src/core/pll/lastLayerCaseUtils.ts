import type { Cubie, NormalKey, PaletteKey } from "../cubieModel";
import { applyRotationStep, createSolvedCubies } from "../rotation";
import type { PllGridCell } from "./pllTopTypes";
import { extractPllTopColorPatternFromCubies } from "./extractPllTopPattern";

export const readSticker = (
  stickers: Partial<Record<NormalKey, PaletteKey>>,
  normal: NormalKey
): PaletteKey => stickers[normal] ?? "white";

export const findCubie = (cubies: Cubie[], x: number, y: number, z: number): Cubie | undefined =>
  cubies.find((c) => c.x === x && c.y === y && c.z === z);

/** Full sticker map — distinguishes orientation (OLL) vs identity (PLL). */
export const cubieStickerSignature = (c: Cubie): string =>
  Object.entries(c.stickers)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");

/** Multiset of sticker colors (ignores which face) — identifies physical cubie on a 3×3. */
export const cubieColorBagSignature = (c: Cubie): string =>
  Object.values(c.stickers)
    .filter((v): v is PaletteKey => Boolean(v))
    .sort()
    .join(",");

export const cloneCubies = (cubies: Cubie[]): Cubie[] =>
  cubies.map((c) => ({
    x: c.x,
    y: c.y,
    z: c.z,
    stickers: { ...c.stickers }
  }));

/** U-layer slot on the PLL top-flat grid (row 0 = +z front, col 0 = −x left). Excludes U center. */
export const uLayerDiagramSlots: { x: number; z: number }[] = [
  { x: -1, z: 1 },
  { x: 0, z: 1 },
  { x: 1, z: 1 },
  { x: -1, z: 0 },
  { x: 1, z: 0 },
  { x: -1, z: -1 },
  { x: 0, z: -1 },
  { x: 1, z: -1 }
];

export const xzToPllGridCell = (x: number, z: number): PllGridCell => ({
  row: (1 - z) as PllGridCell["row"],
  col: (x + 1) as PllGridCell["col"]
});

export function lowerTwoLayersMatchSolved(cubies: Cubie[]): boolean {
  const ref = createSolvedCubies();
  const refByPos = new Map(ref.map((c) => [`${c.x},${c.y},${c.z}`, c]));
  for (const c of cubies) {
    if (c.y === 1) continue;
    const r = refByPos.get(`${c.x},${c.y},${c.z}`);
    if (!r || cubieStickerSignature(c) !== cubieStickerSignature(r)) {
      return false;
    }
  }
  return true;
}

export function uCenterMatchesSolved(cubies: Cubie[]): boolean {
  const ref = findCubie(createSolvedCubies(), 0, 1, 0);
  const cur = findCubie(cubies, 0, 1, 0);
  if (!ref || !cur) return false;
  return cubieStickerSignature(cur) === cubieStickerSignature(ref);
}

export function allUYFaceYellow(cubies: Cubie[]): boolean {
  for (let x = -1; x <= 1; x += 1) {
    for (let z = -1; z <= 1; z += 1) {
      const c = findCubie(cubies, x, 1, z);
      if (!c || readSticker(c.stickers, "y+") !== "yellow") {
        return false;
      }
    }
  }
  return true;
}

/** Each U-slot holds the same physical cubie as in the solved cube (twists allowed). */
export function uLayerCubiesMatchSolvedBags(cubies: Cubie[]): boolean {
  const ref = createSolvedCubies();
  for (let x = -1; x <= 1; x += 1) {
    for (let z = -1; z <= 1; z += 1) {
      const c = findCubie(cubies, x, 1, z);
      const r = findCubie(ref, x, 1, z);
      if (!c || !r) return false;
      if (cubieColorBagSignature(c) !== cubieColorBagSignature(r)) {
        return false;
      }
    }
  }
  return true;
}

const serializePllPatternKey = (cubies: Cubie[]): string =>
  JSON.stringify(extractPllTopColorPatternFromCubies(cubies));

/**
 * After `parseReversedNotation` + optional whole-cube `y` turns, the lexicographic-min pattern must be
 * unique among the four `y` choices; otherwise the PLL diagram frame is ambiguous.
 */
export function pllYCanonicalizationIsUnique(cubiesAfterReverse: Cubie[]): boolean {
  const winners: number[] = [];
  let bestKey = "\uffff";
  for (let yTurns = 0; yTurns < 4; yTurns += 1) {
    const cubies = cloneCubies(cubiesAfterReverse);
    for (let i = 0; i < yTurns; i += 1) {
      applyRotationStep(cubies, { face: "y", angle: 90 });
    }
    const key = serializePllPatternKey(cubies);
    if (key < bestKey) {
      bestKey = key;
      winners.length = 0;
      winners.push(yTurns);
    } else if (key === bestKey) {
      winners.push(yTurns);
    }
  }
  return winners.length === 1;
}

/** True iff some whole-cube `y^k` brings the cube to world-frame F2L + U center + all-yellow U. */
export function canWholeCubeYAlignToPllWorldFrame(cubiesAfterReverse: Cubie[]): boolean {
  for (let k = 0; k < 4; k += 1) {
    const test = cloneCubies(cubiesAfterReverse);
    for (let i = 0; i < k; i += 1) {
      applyRotationStep(test, { face: "y", angle: 90 });
    }
    if (lowerTwoLayersMatchSolved(test) && allUYFaceYellow(test)) {
      return true;
    }
  }
  return false;
}

/** True iff some whole-cube `y^k` restores the first two layers to the solved sticker map. */
export function hasLowerTwoLayersForSomeWholeCubeY(cubiesAfterReverse: Cubie[]): boolean {
  for (let k = 0; k < 4; k += 1) {
    const test = cloneCubies(cubiesAfterReverse);
    for (let i = 0; i < k; i += 1) {
      applyRotationStep(test, { face: "y", angle: 90 });
    }
    if (lowerTwoLayersMatchSolved(test)) {
      return true;
    }
  }
  return false;
}

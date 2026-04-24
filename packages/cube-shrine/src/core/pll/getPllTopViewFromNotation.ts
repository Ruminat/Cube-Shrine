import type { Cubie } from "../cubieModel";
import { applyRotationStep, createSolvedCubies } from "../rotation";
import { parseNotation, parseReversedNotation } from "../notation/parser";
import { extractPllTopColorPatternFromCubies } from "./extractPllTopPattern";
import type { PllTopColorPattern, PllTopViewModel } from "./pllTopTypes";
import { cloneCubies } from "./lastLayerCaseUtils";
import { computePllArrowsFromCubies } from "./computePllArrowsFromCubies";
import { validatePLLAlgorithm } from "./validatePllAlgorithm";

const serializePllColorPattern = (pattern: PllTopColorPattern): string =>
  JSON.stringify({
    face9: pattern.face9,
    topStrip: pattern.topStrip,
    bottomStrip: pattern.bottomStrip,
    leftStrip: pattern.leftStrip,
    rightStrip: pattern.rightStrip
  });

/**
 * Prefer fewer arrow segments, then fewer whole-cube `y` quarter-turns, then lexicographic color
 * pattern (so e.g. H perm picks edge swaps over an equivalent higher-`y` frame with diagonal arrows).
 */
const compareCanonicalCandidates = (
  a: { arrowCount: number; yTurns: number; key: string },
  b: { arrowCount: number; yTurns: number; key: string }
): number => {
  if (a.arrowCount !== b.arrowCount) {
    return a.arrowCount - b.arrowCount;
  }
  if (a.yTurns !== b.yTurns) {
    return a.yTurns - b.yTurns;
  }
  if (a.key !== b.key) {
    return a.key < b.key ? -1 : 1;
  }
  return 0;
};

export type GetPllTopViewFromNotationOptions = {
  /** `"forward"` = apply `parseNotation(notation)` from solved (no inverse prep). Default = inverse PLL case. */
  applyMoves?: "forward";
};

/**
 * `MiniCube` should append {@link PllTopViewModel.pllCanonicalYQuarterTurns} after `parseReversedNotation`
 * so the 3D pose matches this top-flat. Inverse mode: pick one of four whole-cube `y` quarter-turns by
 * **fewest arrow segments**, then smallest `y`, then lexicographic color pattern. **`applyMoves: "forward"`**:
 * apply `parseNotation(notation)` from solved (`pllCanonicalYQuarterTurns` is `0`; used in Vitest, not site data).
 *
 * Top-flat **arrows** are derived from cubie home slots when the U face is fully yellow. Inverse mode
 * also requires {@link validatePLLAlgorithm} to pass. `applyMoves: "forward"` skips that check (sheet
 * recipes are not validated against reversed prep) but still draws arrows from the cubie state.
 */
export function getPllTopViewFromNotation(
  _algorithmId: string,
  notation: string,
  options?: GetPllTopViewFromNotationOptions
): PllTopViewModel {
  const steps =
    options?.applyMoves === "forward" ? parseNotation(notation) : parseReversedNotation(notation);

  let best: PllTopColorPattern | null = null;
  let bestCubies: Cubie[] | null = null;

  let pllCanonicalYQuarterTurns = 0;

  if (options?.applyMoves === "forward") {
    const cubies = createSolvedCubies();
    steps.forEach((step) => applyRotationStep(cubies, step));
    best = extractPllTopColorPatternFromCubies(cubies);
    bestCubies = cloneCubies(cubies);
  } else {
    let bestPick: { arrowCount: number; yTurns: number; key: string } | null = null;
    for (let yTurns = 0; yTurns < 4; yTurns += 1) {
      const cubies = createSolvedCubies();
      steps.forEach((step) => applyRotationStep(cubies, step));
      for (let i = 0; i < yTurns; i += 1) {
        applyRotationStep(cubies, { face: "y", angle: 90 });
      }
      const pattern = extractPllTopColorPatternFromCubies(cubies);
      const key = serializePllColorPattern(pattern);
      const arrowCount = computePllArrowsFromCubies(cloneCubies(cubies)).length;
      const cand = { arrowCount, yTurns, key };
      if (!bestPick || compareCanonicalCandidates(cand, bestPick) < 0) {
        bestPick = cand;
        best = pattern;
        bestCubies = cloneCubies(cubies);
        pllCanonicalYQuarterTurns = yTurns;
      }
    }
  }

  if (!best || !bestCubies) {
    throw new Error("getPllTopViewFromNotation: empty result");
  }

  const pllCaseError = options?.applyMoves === "forward" ? undefined : validatePLLAlgorithm(notation);
  const uLayerFullyYellow = best.face9.length === 9 && best.face9.every((c) => c === "yellow");
  const arrows =
    pllCaseError !== undefined || !uLayerFullyYellow ? [] : computePllArrowsFromCubies(bestCubies);

  return { ...best, arrows, pllCanonicalYQuarterTurns };
}

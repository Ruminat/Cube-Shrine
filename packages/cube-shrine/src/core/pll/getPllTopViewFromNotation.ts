import type { Cubie } from "../cubieModel";
import { applyRotationStep, createSolvedCubies } from "../rotation";
import { parseNotation, parseReversedNotation } from "../notation/parser";
import { extractPllTopColorPatternFromCubies } from "./extractPllTopPattern";
import type { PllTopColorPattern, PllTopViewModel } from "./pllTopTypes";
import { pllSheetAlignYSteps } from "./pllSheetAlignYSteps";
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

export type GetPllTopViewFromNotationOptions = {
  /** `"forward"` = apply `notation` from solved (sanity tests). Default = inverse (PLL case). */
  applyMoves?: "forward";
};

/**
 * `MiniCube` uses the same move list. PLL case mode: inverse of `notation`, then pick one of four
 * whole-cube `y` quarter-turns (lexicographic min). Forward test mode: apply `notation` from solved,
 * then `pllSheetAlignYSteps` (`y2`) so side strips match the package frame (front +z blue, back −z
 * green, R red, L orange around the U layer in the top-flat diagram).
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

  if (options?.applyMoves === "forward") {
    const cubies = createSolvedCubies();
    steps.forEach((step) => applyRotationStep(cubies, step));
    pllSheetAlignYSteps.forEach((step) => applyRotationStep(cubies, step));
    best = extractPllTopColorPatternFromCubies(cubies);
    bestCubies = cloneCubies(cubies);
  } else {
    let bestKey = "\uffff";
    for (let yTurns = 0; yTurns < 4; yTurns += 1) {
      const cubies = createSolvedCubies();
      steps.forEach((step) => applyRotationStep(cubies, step));
      for (let i = 0; i < yTurns; i += 1) {
        applyRotationStep(cubies, { face: "y", angle: 90 });
      }
      const pattern = extractPllTopColorPatternFromCubies(cubies);
      const key = serializePllColorPattern(pattern);
      if (key < bestKey) {
        bestKey = key;
        best = pattern;
        bestCubies = cloneCubies(cubies);
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

  return { ...best, arrows };
}

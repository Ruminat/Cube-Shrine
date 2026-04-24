import { applyRotationStep, createSolvedCubies } from "../rotation";
import { parseNotation, parseReversedNotation } from "../notation/parser";
import { extractPllTopColorPatternFromCubies } from "./extractPllTopPattern";
import type { PllTopArrow, PllTopColorPattern, PllTopViewModel } from "./pllTopTypes";
import { pllSheetAlignYSteps } from "./pllSheetAlignYSteps";

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
  /** Static diagram arrows (e.g. tests). Ignored when `getArrows` is set. */
  arrows?: PllTopArrow[];
  /** Resolve arrows from algorithm id (e.g. app-owned PLL metadata). */
  getArrows?: (algorithmId: string) => PllTopArrow[];
};

/**
 * `MiniCube` uses the same move list. PLL case mode: inverse of `notation`, then pick one of four
 * whole-cube `y` quarter-turns (lexicographic min). Forward test mode: apply `notation` from solved,
 * then `pllSheetAlignYSteps` (`y2`) so side strips match the package frame (front +z blue, back −z
 * green, R red, L orange around the U layer in the top-flat diagram).
 */
export function getPllTopViewFromNotation(
  algorithmId: string,
  notation: string,
  options?: GetPllTopViewFromNotationOptions
): PllTopViewModel {
  const steps =
    options?.applyMoves === "forward" ? parseNotation(notation) : parseReversedNotation(notation);

  let best: PllTopColorPattern | null = null;

  if (options?.applyMoves === "forward") {
    const cubies = createSolvedCubies();
    steps.forEach((step) => applyRotationStep(cubies, step));
    pllSheetAlignYSteps.forEach((step) => applyRotationStep(cubies, step));
    best = extractPllTopColorPatternFromCubies(cubies);
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
      }
    }
  }

  if (!best) {
    throw new Error("getPllTopViewFromNotation: empty result");
  }

  const arrows =
    options?.getArrows?.(algorithmId) ?? options?.arrows ?? [];
  return { ...best, arrows };
}

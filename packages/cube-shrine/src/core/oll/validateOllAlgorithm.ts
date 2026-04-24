import { applyRotationStep, createSolvedCubies } from "../rotation";
import { parseReversedNotation } from "../notation/parser";
import { validateAlgorithm } from "../notation/algorithmFormat";
import {
  canWholeCubeYAlignToPllWorldFrame,
  hasLowerTwoLayersForSomeWholeCubeY
} from "../pll/lastLayerCaseUtils";

/**
 * 1) {@link validateAlgorithm}
 * 2) After `parseReversedNotation`, reject **PLL-phase** states: some whole-cube `y^k` yields solved F2L
 *    and a fully yellow U face (same test as {@link validatePLLAlgorithm} without the pattern tie-break).
 * 3) Otherwise require some whole-cube `y^k` that restores the first two layers to the solved sticker map.
 */
export function validateOLLAlgorithm(notation: string): string | undefined {
  const syntax = validateAlgorithm(notation);
  if (syntax) {
    return syntax;
  }
  const cubies = createSolvedCubies();
  parseReversedNotation(notation).forEach((step) => applyRotationStep(cubies, step));

  if (canWholeCubeYAlignToPllWorldFrame(cubies)) {
    return "Not an OLL case: reversed state matches PLL phase (solved F2L with a full yellow U face)";
  }
  if (!hasLowerTwoLayersForSomeWholeCubeY(cubies)) {
    return "Not an OLL case: no whole-cube y alignment yields a solved first two layers";
  }
  return undefined;
}

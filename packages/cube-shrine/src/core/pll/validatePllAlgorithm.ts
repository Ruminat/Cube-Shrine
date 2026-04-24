import { applyRotationStep, createSolvedCubies } from "../rotation";
import { parseReversedNotation } from "../notation/parser";
import { validateAlgorithm } from "../notation/algorithmFormat";
import { canWholeCubeYAlignToPllWorldFrame, pllYCanonicalizationIsUnique } from "./lastLayerCaseUtils";

/**
 * 1) {@link validateAlgorithm}
 * 2) After `parseReversedNotation` (PLL case / card prep), some whole-cube `y` quarter-turn must align the
 *    cube to world-frame **PLL**: F2L + U center solved and every U sticker yellow.
 * 3) The lexicographic-min top-flat color pattern over those four `y` choices must be unique (diagram frame).
 */
export function validatePLLAlgorithm(notation: string): string | undefined {
  const syntax = validateAlgorithm(notation);
  if (syntax) {
    return syntax;
  }
  const cubies = createSolvedCubies();
  parseReversedNotation(notation).forEach((step) => applyRotationStep(cubies, step));

  if (!canWholeCubeYAlignToPllWorldFrame(cubies)) {
    return "Not a PLL case: no whole-cube y alignment yields a solved F2L with a fully yellow U face";
  }
  if (!pllYCanonicalizationIsUnique(cubies)) {
    return "PLL diagram frame is ambiguous: multiple whole-cube y turns tie for the same top-flat pattern";
  }
  return undefined;
}

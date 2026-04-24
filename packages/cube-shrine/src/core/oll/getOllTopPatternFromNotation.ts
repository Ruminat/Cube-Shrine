import { applyRotationStep, createSolvedCubies } from "../rotation";
import { parseReversedNotation } from "../notation/parser";
import { extractOllTopPatternFromCubies, type OllTopPattern } from "./extractOllTopPattern";

export type CanonicalOllTopPatternFromNotation = {
  pattern: OllTopPattern;
  /**
   * Always `0`. OLL top-flat uses a fixed world frame (see `extractOllTopPatternFromCubies`): diagram
   * top = back (−z), bottom = front (+z), left = −x, right = +x — no whole-cube `y` after inverse prep.
   */
  yQuarterTurns: number;
};

/**
 * OLL case on U from solved via {@link parseReversedNotation} (same inverse prep as PLL case diagrams),
 * then reads {@link extractOllTopPatternFromCubies} with **no** whole-cube `y` canonicalization so the
 * flat net matches the isometric `MiniCube` when both use only reversed moves.
 */
export function getCanonicalOllTopPatternFromNotation(notation: string): CanonicalOllTopPatternFromNotation {
  const cubies = createSolvedCubies();
  parseReversedNotation(notation).forEach((step) => applyRotationStep(cubies, step));
  return { pattern: extractOllTopPatternFromCubies(cubies), yQuarterTurns: 0 };
}

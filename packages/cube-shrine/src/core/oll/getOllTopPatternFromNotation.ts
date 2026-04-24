import { applyRotationStep, createSolvedCubies } from "../rotation";
import { parseReversedNotation } from "../notation/parser";
import { extractOllTopPatternFromCubies, type OllTopPattern } from "./extractOllTopPattern";

const serializePattern = (pattern: OllTopPattern): string =>
  JSON.stringify({ face: pattern.face, corners: pattern.corners, edgeMids: pattern.edgeMids });

export type CanonicalOllTopPatternFromNotation = {
  pattern: OllTopPattern;
  /** Whole-cube `y` quarter-turns after `parseReversedNotation` for this canonical top-flat. */
  yQuarterTurns: number;
};

/**
 * Builds the last-layer state from `parseReversedNotation`, then picks one of four whole-cube `y`
 * views (lexicographic min on the serialized pattern). Use {@link CanonicalOllTopPatternFromNotation.yQuarterTurns}
 * on the same move list as the 3D preview so the flat diagram matches `MiniCube`.
 */
export function getCanonicalOllTopPatternFromNotation(notation: string): CanonicalOllTopPatternFromNotation {
  let best: OllTopPattern | null = null;
  let bestY = 0;
  let bestKey = "\uffff";

  for (let yTurns = 0; yTurns < 4; yTurns += 1) {
    const cubies = createSolvedCubies();
    parseReversedNotation(notation).forEach((step) => applyRotationStep(cubies, step));
    for (let i = 0; i < yTurns; i += 1) {
      applyRotationStep(cubies, { face: "y", angle: 90 });
    }
    const pattern = extractOllTopPatternFromCubies(cubies);
    const key = serializePattern(pattern);
    if (key < bestKey) {
      bestKey = key;
      best = pattern;
      bestY = yTurns;
    }
  }

  if (!best) {
    throw new Error("getCanonicalOllTopPatternFromNotation: empty result");
  }
  return { pattern: best, yQuarterTurns: bestY };
}

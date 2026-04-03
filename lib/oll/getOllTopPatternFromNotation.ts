import { applyRotationStep, createSolvedCubies } from "@/components/Cube/rotation";
import { parseReversedNotation } from "@/lib/notation/parser";
import { extractOllTopPatternFromCubies, type OllTopPattern } from "@/lib/oll/extractOllTopPattern";

const serializePattern = (pattern: OllTopPattern): string =>
  JSON.stringify({ face: pattern.face, corners: pattern.corners, edgeMids: pattern.edgeMids });

/**
 * Builds the last-layer state the same way as `MiniCube`, then picks one of four
 * whole-cube `y` views so diagrams stay consistent (OLL cases are only defined up to `y`).
 */
export function getCanonicalOllTopPatternFromNotation(notation: string): OllTopPattern {
  let best: OllTopPattern | null = null;
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
    }
  }

  if (!best) {
    throw new Error("getCanonicalOllTopPatternFromNotation: empty result");
  }
  return best;
}

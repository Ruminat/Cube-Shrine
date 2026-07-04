import { parseNotation, parseReversedNotation, type RotationStep } from "@shreklabs/cube-shrine/core";
import type { Algorithm } from "@/types/algorithm";

interface PllCanonicalYInfo {
  pllCanonicalYQuarterTurns: number;
}

/** Cube prep rotations for gallery cards and detail modal previews. */
export function getAlgorithmPreviewRotations(
  algorithm: Algorithm,
  displayNotation: string,
  pllTopModel: PllCanonicalYInfo | null,
): RotationStep[] {
  if (algorithm.category === "Notation") {
    return parseNotation(displayNotation);
  }

  const rev = parseReversedNotation(displayNotation);
  if (algorithm.category === "PLL" && pllTopModel && pllTopModel.pllCanonicalYQuarterTurns > 0) {
    const yTail = Array.from({ length: pllTopModel.pllCanonicalYQuarterTurns }, () => ({
      face: "y" as const,
      angle: 90 as const,
    }));
    return [...rev, ...yTail];
  }
  return rev;
}

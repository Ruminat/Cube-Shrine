import { applyRotationStep, createSolvedCubies } from "@/components/Cube/rotation";
import { parseReversedNotation } from "@/lib/notation/parser";
import { extractPllTopColorPatternFromCubies } from "@/lib/pll/extractPllTopPattern";
import type { PllTopViewModel } from "@/lib/pll/pllTopTypes";
import { pllTopDiagramArrows } from "@/data/pll.diagrams";

export function getPllTopViewFromNotation(algorithmId: string, notation: string): PllTopViewModel {
  const cubies = createSolvedCubies();
  parseReversedNotation(notation).forEach((step) => applyRotationStep(cubies, step));
  const colors = extractPllTopColorPatternFromCubies(cubies);
  const arrows = pllTopDiagramArrows[algorithmId] ?? [];
  return { ...colors, arrows };
}

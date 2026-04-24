import type { RotationStep } from "../cubeTypes";

/** Whole-cube `y2` to align sheet-style side strips after forward PLL preview moves. */
export const pllSheetAlignYSteps: RotationStep[] = [{ face: "y", angle: 180 }];

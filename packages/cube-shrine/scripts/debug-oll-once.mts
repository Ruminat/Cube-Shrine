import { applyRotationStep, createSolvedCubies } from "../src/core/rotation.ts";
import { parseReversedNotation } from "../src/core/notation/parser.ts";
import {
  cloneCubies,
  lowerTwoLayersMatchSolved,
  uCenterMatchesSolved,
  uLayerCubiesMatchSolvedBags
} from "../src/core/pll/lastLayerCaseUtils.ts";

const SUNE = "(R U R' U) (R U2 R')";
const base = createSolvedCubies();
parseReversedNotation(SUNE).forEach((s) => applyRotationStep(base, s));
for (let k = 0; k < 4; k += 1) {
  const t = cloneCubies(base);
  for (let i = 0; i < k; i += 1) {
    applyRotationStep(t, { face: "y", angle: 90 });
  }
  console.log(k, {
    low: lowerTwoLayersMatchSolved(t),
    uc: uCenterMatchesSolved(t),
    bag: uLayerCubiesMatchSolvedBags(t)
  });
}

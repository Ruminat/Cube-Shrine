import { applyRotationStep, createSolvedCubies } from "../src/core/rotation.ts";
import { parseReversedNotation } from "../src/core/notation/parser.ts";
import { validatePLLAlgorithm } from "../src/core/pll/validatePllAlgorithm.ts";
import { cloneCubies, cubieStickerSignature, findCubie } from "../src/core/pll/lastLayerCaseUtils.ts";
import { extractPllTopColorPatternFromCubies } from "../src/core/pll/extractPllTopPattern.ts";
import { computePllArrowsFromCubies } from "../src/core/pll/computePllArrowsFromCubies.ts";

const T = "(R U R' U') R' F R2 U' R' U' R U R' F'";
const serializePllColorPattern = (p: ReturnType<typeof extractPllTopColorPatternFromCubies>) =>
  JSON.stringify({
    face9: p.face9,
    topStrip: p.topStrip,
    bottomStrip: p.bottomStrip,
    leftStrip: p.leftStrip,
    rightStrip: p.rightStrip
  });

const steps = parseReversedNotation(T);
let bestKey = "\uffff";
let bestCubies = null as ReturnType<typeof cloneCubies> | null;
for (let yTurns = 0; yTurns < 4; yTurns += 1) {
  const cubies = createSolvedCubies();
  steps.forEach((s) => applyRotationStep(cubies, s));
  for (let i = 0; i < yTurns; i += 1) {
    applyRotationStep(cubies, { face: "y", angle: 90 });
  }
  const pattern = extractPllTopColorPatternFromCubies(cubies);
  const key = serializePllColorPattern(pattern);
  if (key < bestKey) {
    bestKey = key;
    bestCubies = cloneCubies(cubies);
  }
}
const homeByStickerSig = new Map<string, { row: number; col: number }>();
const solved = createSolvedCubies();
for (const { x, z } of [
  { x: -1, z: 1 },
  { x: 0, z: 1 },
  { x: 1, z: 1 },
  { x: -1, z: 0 },
  { x: 1, z: 0 },
  { x: -1, z: -1 },
  { x: 0, z: -1 },
  { x: 1, z: -1 }
]) {
  const sc = findCubie(solved, x, 1, z)!;
  homeByStickerSig.set(cubieStickerSignature(sc), {
    row: z + 1,
    col: x + 1
  });
}
const directed: { from: { row: number; col: number }; to: { row: number; col: number } }[] = [];
for (const { x, z } of [
  { x: -1, z: 1 },
  { x: 0, z: 1 },
  { x: 1, z: 1 },
  { x: -1, z: 0 },
  { x: 1, z: 0 },
  { x: -1, z: -1 },
  { x: 0, z: -1 },
  { x: 1, z: -1 }
]) {
  const cur = findCubie(bestCubies!, x, 1, z)!;
  const sig = cubieStickerSignature(cur);
  const home = homeByStickerSig.get(sig);
  const here = { row: z + 1, col: x + 1 };
  if (!home || (home.row === here.row && home.col === here.col)) continue;
  directed.push({ from: here, to: home });
}
const arrows = bestCubies ? computePllArrowsFromCubies(bestCubies) : [];
let mismatch = 0;
for (let x = -1; x <= 1; x += 1) {
  for (let z = -1; z <= 1; z += 1) {
    if (x === 0 && z === 0) continue;
    const a = findCubie(bestCubies!, x, 1, z)!;
    const b = findCubie(solved, x, 1, z)!;
    if (cubieStickerSignature(a) !== cubieStickerSignature(b)) mismatch += 1;
  }
}
console.log({
  val: validatePLLAlgorithm(T),
  directedLen: directed.length,
  directed,
  arrowCount: arrows.length,
  uLayerStickerMismatchesVsSolved: mismatch
});

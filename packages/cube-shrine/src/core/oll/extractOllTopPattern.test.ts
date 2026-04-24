import { describe, expect, it } from "vitest";
import { applyRotationStep, createSolvedCubies } from "../rotation";
import { parseReversedNotation } from "../notation/parser";
import { extractOllTopPatternFromCubies } from "./extractOllTopPattern";
import { getCanonicalOllTopPatternFromNotation } from "./getOllTopPatternFromNotation";

describe("extractOllTopPatternFromCubies", () => {
  it("reads a solid yellow U face from solved cube", () => {
    const cubies = createSolvedCubies();
    const p = extractOllTopPatternFromCubies(cubies);
    expect(p.face.every(Boolean)).toBe(true);
    expect(p.corners.topLeft.left).toBe(false);
  });
});

describe("getCanonicalOllTopPatternFromNotation", () => {
  it("produces distinct patterns for H (21) and Pi (22)", () => {
    const h = getCanonicalOllTopPatternFromNotation(
      "F (R U R' U') (R U R' U') (R U R' U') F'"
    );
    const pi = getCanonicalOllTopPatternFromNotation("R U2 (R2' U' R2 U') (R2' U2 R)");
    expect(JSON.stringify(h.pattern)).not.toBe(JSON.stringify(pi.pattern));
  });

  it("matches snapshot for OLL 21 (H) canonical pattern", () => {
    const { pattern: p } = getCanonicalOllTopPatternFromNotation(
      "F (R U R' U') (R U R' U') (R U R' U') F'"
    );
    expect(p).toMatchInlineSnapshot(`
      {
        "corners": {
          "bottomLeft": {
            "bottom": false,
            "left": true,
          },
          "bottomRight": {
            "bottom": false,
            "right": true,
          },
          "topLeft": {
            "left": true,
            "top": false,
          },
          "topRight": {
            "right": true,
            "top": false,
          },
        },
        "edgeMids": {
          "bottomCenter": false,
          "leftMiddle": false,
          "rightMiddle": false,
          "topCenter": false,
        },
        "face": [
          false,
          true,
          false,
          true,
          true,
          true,
          false,
          true,
          false,
        ],
      }
    `);
  });

  it("includes top/bottom center edge bars for Shoelaces (OLL 33)", () => {
    const notation = "(R U R' U') (R' F R F')";
    const cubies = createSolvedCubies();
    parseReversedNotation(notation).forEach((step) => applyRotationStep(cubies, step));
    const p = extractOllTopPatternFromCubies(cubies);
    expect(p.edgeMids.topCenter).toBe(true);
    expect(p.edgeMids.bottomCenter).toBe(true);
  });
});

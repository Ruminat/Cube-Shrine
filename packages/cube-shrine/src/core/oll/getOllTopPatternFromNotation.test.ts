import { describe, expect, it } from "vitest";
import { applyRotationStep, createSolvedCubies } from "../rotation";
import { parseNotation, parseReversedNotation } from "../notation/parser";
import { extractOllTopPatternFromCubies } from "./extractOllTopPattern";
import { getCanonicalOllTopPatternFromNotation } from "./getOllTopPatternFromNotation";

describe("getCanonicalOllTopPatternFromNotation", () => {
  it("always reports yQuarterTurns 0 (fixed world frame)", () => {
    expect(getCanonicalOllTopPatternFromNotation("R U R' U'").yQuarterTurns).toBe(0);
    expect(getCanonicalOllTopPatternFromNotation("F (R U R' U') F'").yQuarterTurns).toBe(0);
  });

  it("produces distinct patterns for H (21) and Pi (22)", () => {
    const h = getCanonicalOllTopPatternFromNotation("R U R' U R U' R' U R U2 R'");
    const pi = getCanonicalOllTopPatternFromNotation("R U2 (R2' U' R2 U') (R2' U2 R)");
    expect(JSON.stringify(h.pattern)).not.toBe(JSON.stringify(pi.pattern));
  });

  it("matches snapshot for OLL 21 (H)", () => {
    const { pattern: p } = getCanonicalOllTopPatternFromNotation("R U R' U R U' R' U R U2 R'");
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

  it("round-trips inverse prep + forward alg to solved U diagram (Shoelaces / OLL 33)", () => {
    const alg = "(R U R' U') (R' F R F')";
    const c = createSolvedCubies();
    parseReversedNotation(alg).forEach((step) => applyRotationStep(c, step));
    const casePattern = extractOllTopPatternFromCubies(c);
    expect(getCanonicalOllTopPatternFromNotation(alg).pattern).toEqual(casePattern);

    parseNotation(alg).forEach((step) => applyRotationStep(c, step));
    expect(extractOllTopPatternFromCubies(c)).toEqual(extractOllTopPatternFromCubies(createSolvedCubies()));
  });

  it("supports wide moves inside bracket groups (OLL 24 T differs from Shoelaces)", () => {
    const t = getCanonicalOllTopPatternFromNotation("(r U R' U') (r' F R F')");
    const shoelaces = getCanonicalOllTopPatternFromNotation("(R U R' U') (R' F R F')");
    expect(t.pattern.face[4]).toBe(true);
    expect(JSON.stringify(t.pattern)).not.toBe(JSON.stringify(shoelaces.pattern));
  });

  it("dot-style Runway leaves center U yellow but not a solid yellow U face", () => {
    const { pattern } = getCanonicalOllTopPatternFromNotation("(R U2 R') (R' F R F') U2 (R' F R F')");
    expect(pattern.face[4]).toBe(true);
    expect(pattern.face.some((v) => !v)).toBe(true);
  });

  it("Sune inverse prep yields six yellow stickers on the U face in this model", () => {
    const { pattern } = getCanonicalOllTopPatternFromNotation("(R U R' U) (R U2 R')");
    expect(pattern.face.filter(Boolean).length).toBe(6);
  });

  it("accepts whole-cube y inside the stored string (Spotted Chameleon) without extra canonical y", () => {
    const { pattern, yQuarterTurns } = getCanonicalOllTopPatternFromNotation(
      "y (R U R' U') (R U' R') (F' U' F) (R U R')",
    );
    expect(yQuarterTurns).toBe(0);
    expect(pattern.face).toHaveLength(9);
  });
});

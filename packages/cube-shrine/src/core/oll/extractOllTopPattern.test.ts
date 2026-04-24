import { describe, expect, it } from "vitest";
import { applyRotationStep, createSolvedCubies } from "../rotation";
import { parseNotation, parseReversedNotation } from "../notation/parser";
import { extractOllTopPatternFromCubies } from "./extractOllTopPattern";

describe("extractOllTopPatternFromCubies", () => {
  it("reads a solid yellow U face from solved cube", () => {
    const cubies = createSolvedCubies();
    const p = extractOllTopPatternFromCubies(cubies);
    expect(p.face.every(Boolean)).toBe(true);
    expect(p.corners.topLeft.left).toBe(false);
  });

  it("returns all false when the cubie list is empty (no matches)", () => {
    const p = extractOllTopPatternFromCubies([]);
    expect(p.face.every((v) => !v)).toBe(true);
    expect(p.edgeMids.topCenter).toBe(false);
    expect(p.corners.bottomRight.right).toBe(false);
  });

  it("maps diagram row 0 to back (−z) and row 2 to front (+z) on the U slice", () => {
    const cubies = createSolvedCubies();
    const p = extractOllTopPatternFromCubies(cubies);
    expect(p.face[0]).toBe(true);
    expect(p.face[6]).toBe(true);
    expect(p.corners.topLeft.top).toBe(false);
    expect(p.corners.bottomLeft.bottom).toBe(false);
  });

  it("treats a U turn as a permutation: all nine U stickers stay yellow on the U face", () => {
    const cubies = createSolvedCubies();
    applyRotationStep(cubies, { face: "U", angle: 90 });
    const p = extractOllTopPatternFromCubies(cubies);
    expect(p.face.every(Boolean)).toBe(true);
  });

  it("detects back and front edge-mid yellow after Shoelaces inverse prep only", () => {
    const notation = "(R U R' U') (R' F R F')";
    const cubies = createSolvedCubies();
    parseReversedNotation(notation).forEach((step) => applyRotationStep(cubies, step));
    const p = extractOllTopPatternFromCubies(cubies);
    expect(p.edgeMids.topCenter).toBe(true);
    expect(p.edgeMids.bottomCenter).toBe(true);
    expect(p.edgeMids.leftMiddle).toBe(false);
    expect(p.edgeMids.rightMiddle).toBe(false);
  });

  it("after inverse prep + forward alg, matches solved extraction (full round-trip on cubies)", () => {
    const alg = "F (R U R' U') F'";
    const cubies = createSolvedCubies();
    parseReversedNotation(alg).forEach((s) => applyRotationStep(cubies, s));
    parseNotation(alg).forEach((s) => applyRotationStep(cubies, s));
    expect(extractOllTopPatternFromCubies(cubies)).toEqual(extractOllTopPatternFromCubies(createSolvedCubies()));
  });
});

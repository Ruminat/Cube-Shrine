import { describe, expect, it } from "vitest";
import { applyRotationStep, createSolvedCubies } from "../rotation";
import { extractPllTopColorPatternFromCubies } from "./extractPllTopPattern";
import { getPllTopViewFromNotation } from "./getPllTopViewFromNotation";
import { parseNotation } from "../notation/parser";

describe("extractPllTopColorPatternFromCubies", () => {
  it("reads all yellow on U face from solved cube", () => {
    const p = extractPllTopColorPatternFromCubies(createSolvedCubies());
    expect(p.face9.every((c) => c === "yellow")).toBe(true);
  });
});

describe("getPllTopViewFromNotation canonical y", () => {
  it("orients solved PLL frame after sheet `y2` (front blue, back green, R red, L orange)", () => {
    const m = getPllTopViewFromNotation("test-d", "D", { applyMoves: "forward" });
    expect(m.topStrip).toEqual(["green", "green", "green"]);
    expect(m.rightStrip).toEqual(["orange", "orange", "orange"]);
    expect(m.bottomStrip).toEqual(["blue", "blue", "blue"]);
    expect(m.leftStrip).toEqual(["red", "red", "red"]);
    expect(m.face9.every((c) => c === "yellow")).toBe(true);
  });

  it("forward U vs D differ before whole-cube y canonicalization", () => {
    const uCubies = createSolvedCubies();
    parseNotation("U").forEach((s) => applyRotationStep(uCubies, s));
    const dCubies = createSolvedCubies();
    parseNotation("D").forEach((s) => applyRotationStep(dCubies, s));
    expect(extractPllTopColorPatternFromCubies(uCubies)).not.toEqual(
      extractPllTopColorPatternFromCubies(dCubies)
    );
  });

  it("does not collapse different U-layer test moves to the same canonical pattern", () => {
    const fwd = { applyMoves: "forward" as const };
    const d = getPllTopViewFromNotation("test-d", "D", fwd);
    const u = getPllTopViewFromNotation("test-u", "U", fwd);
    const u2 = getPllTopViewFromNotation("test-u2", "U2", fwd);
    const up = getPllTopViewFromNotation("test-uprime", "U'", fwd);
    const pack = (m: typeof d) =>
      JSON.stringify({
        face9: m.face9,
        topStrip: m.topStrip,
        rightStrip: m.rightStrip,
        bottomStrip: m.bottomStrip,
        leftStrip: m.leftStrip
      });
    expect(pack(u)).not.toBe(pack(d));
    expect(pack(u2)).not.toBe(pack(d));
    expect(pack(up)).not.toBe(pack(d));
    expect(new Set([pack(d), pack(u), pack(u2), pack(up)]).size).toBe(4);
  });
});

const assertArrowCellsOnGrid = (notation: string, id: string) => {
  const m = getPllTopViewFromNotation(id, notation);
  for (const a of m.arrows) {
    for (const c of [a.from, a.to]) {
      expect(c.row).toBeGreaterThanOrEqual(0);
      expect(c.row).toBeLessThanOrEqual(2);
      expect(c.col).toBeGreaterThanOrEqual(0);
      expect(c.col).toBeLessThanOrEqual(2);
    }
  }
  return m;
};

describe("getPllTopViewFromNotation computed arrows", () => {
  it("derives several arrows for V perm from cubie homes", () => {
    const m = assertArrowCellsOnGrid(
      "(R' U R' U') y (R' F' R2 U') (R' U R' F) R F",
      "v-perm"
    );
    expect(m.arrows.length).toBeGreaterThanOrEqual(2);
  });

  it("derives several arrows for Ja perm from cubie homes", () => {
    const m = assertArrowCellsOnGrid("y' (L' U' L F) (L' U' L U) L F' L2' U L U", "ja-perm");
    expect(m.arrows.length).toBeGreaterThanOrEqual(2);
  });

  it("derives exactly two arrows for F perm from cubie homes", () => {
    const m = assertArrowCellsOnGrid(
      "(R' U' F') (R U R' U') (R' F R2 U') (R' U' R U) (R' U R)",
      "f-perm"
    );
    expect(m.arrows).toHaveLength(2);
  });

  it("omits arrows for invalid PLL prep (single face turn)", () => {
    const m = getPllTopViewFromNotation("x", "F");
    expect(m.arrows).toHaveLength(0);
  });

  it("derives arrows in forward sheet mode when U is permuted (Test U)", () => {
    const m = getPllTopViewFromNotation("test-u", "U", { applyMoves: "forward" });
    expect(m.arrows.length).toBeGreaterThan(0);
  });
});

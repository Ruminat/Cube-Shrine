import { describe, expect, it } from "vitest";
import { applyRotationStep, createSolvedCubies } from "../rotation";
import { extractPllTopColorPatternFromCubies } from "./extractPllTopPattern";
import { getPllTopViewFromNotation } from "./getPllTopViewFromNotation";
import { parseNotation } from "../notation/parser";
import type { PllTopArrow } from "./pllTopTypes";

/** Matches `data/pll.diagrams.ts` for package-local tests (no app dependency). */
const TEST_PLL_DIAGRAM_ARROWS: Record<string, PllTopArrow[]> = {
  "v-perm": [
    { from: { row: 0, col: 0 }, to: { row: 2, col: 2 } },
    { from: { row: 0, col: 1 }, to: { row: 1, col: 2 } }
  ],
  "ja-perm": [
    { from: { row: 0, col: 0 }, to: { row: 1, col: 0 } },
    { from: { row: 0, col: 0 }, to: { row: 0, col: 1 } }
  ],
  "f-perm": [
    { from: { row: 0, col: 1 }, to: { row: 2, col: 1 } },
    { from: { row: 0, col: 2 }, to: { row: 2, col: 2 } }
  ]
};

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

describe("getPllTopViewFromNotation", () => {
  it("includes diagram arrows for V perm", () => {
    const m = getPllTopViewFromNotation(
      "v-perm",
      "(R' U R' U') y (R' F' R2 U') (R' U R' F) R F",
      { getArrows: (id) => TEST_PLL_DIAGRAM_ARROWS[id] ?? [] }
    );
    expect(m.arrows).toHaveLength(2);
    expect(m.arrows[0]).toEqual({
      from: { row: 0, col: 0 },
      to: { row: 2, col: 2 }
    });
  });

  it("uses sheet-style Ja perm (two arrows from top-left corner)", () => {
    const m = getPllTopViewFromNotation("ja-perm", "y' (L' U' L F) (L' U' L U) L F' L2' U L U", {
      getArrows: (id) => TEST_PLL_DIAGRAM_ARROWS[id] ?? []
    });
    expect(m.arrows).toEqual([
      { from: { row: 0, col: 0 }, to: { row: 1, col: 0 } },
      { from: { row: 0, col: 0 }, to: { row: 0, col: 1 } }
    ]);
  });

  it("uses sheet-style F perm (parallel vertical UF–DB and UR–DR)", () => {
    const m = getPllTopViewFromNotation(
      "f-perm",
      "(R' U' F') (R U R' U') (R' F R2 U') (R' U' R U) (R' U R)",
      { getArrows: (id) => TEST_PLL_DIAGRAM_ARROWS[id] ?? [] }
    );
    expect(m.arrows).toEqual([
      { from: { row: 0, col: 1 }, to: { row: 2, col: 1 } },
      { from: { row: 0, col: 2 }, to: { row: 2, col: 2 } }
    ]);
  });
});

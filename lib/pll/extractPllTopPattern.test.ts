import { describe, expect, it } from "vitest";
import { createSolvedCubies } from "@/components/Cube/rotation";
import { extractPllTopColorPatternFromCubies } from "@/lib/pll/extractPllTopPattern";
import { getPllTopViewFromNotation } from "@/lib/pll/getPllTopViewFromNotation";

describe("extractPllTopColorPatternFromCubies", () => {
  it("reads all yellow on U face from solved cube", () => {
    const p = extractPllTopColorPatternFromCubies(createSolvedCubies());
    expect(p.face9.every((c) => c === "yellow")).toBe(true);
  });
});

describe("getPllTopViewFromNotation", () => {
  it("includes diagram arrows for V perm", () => {
    const m = getPllTopViewFromNotation(
      "v-perm",
      "(R' U R' U') y (R' F' R2 U') (R' U R' F) R F"
    );
    expect(m.arrows).toHaveLength(2);
    expect(m.arrows[0]).toEqual({
      from: { row: 0, col: 0 },
      to: { row: 2, col: 2 }
    });
  });

  it("uses sheet-style Ja perm (two arrows from top-left corner)", () => {
    const m = getPllTopViewFromNotation("ja-perm", "y' (L' U' L F) (L' U' L U) L F' L2' U L U");
    expect(m.arrows).toEqual([
      { from: { row: 0, col: 0 }, to: { row: 1, col: 0 } },
      { from: { row: 0, col: 0 }, to: { row: 0, col: 1 } }
    ]);
  });

  it("uses sheet-style F perm (parallel vertical UF–DB and UR–DR)", () => {
    const m = getPllTopViewFromNotation(
      "f-perm",
      "(R' U' F') (R U R' U') (R' F R2 U') (R' U' R U) (R' U R)"
    );
    expect(m.arrows).toEqual([
      { from: { row: 0, col: 1 }, to: { row: 2, col: 1 } },
      { from: { row: 0, col: 2 }, to: { row: 2, col: 2 } }
    ]);
  });
});

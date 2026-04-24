import { describe, expect, it } from "vitest";
import { validatePLLAlgorithm } from "./validatePllAlgorithm";
import { getPllTopViewFromNotation } from "./getPllTopViewFromNotation";

const T_PERM = "R U R' U' R' F R2 U' R' U' R U R' F'";

describe("validatePLLAlgorithm", () => {
  it("rejects invalid notation before cube checks", () => {
    expect(validatePLLAlgorithm("W W")).toMatch(/Invalid move/);
  });

  it("rejects non-PLL states", () => {
    expect(validatePLLAlgorithm("R U")).toMatch(/PLL/);
    expect(validatePLLAlgorithm("F")).toMatch(/PLL/);
  });

  it("accepts standard PLL case notation (T perm)", () => {
    expect(validatePLLAlgorithm(T_PERM)).toBeUndefined();
  });

  it("accepts H perm", () => {
    expect(validatePLLAlgorithm("M2 U M2 U2 M2 U M2")).toBeUndefined();
  });
});

describe("getPllTopViewFromNotation computed arrows", () => {
  it("draws arrows for T perm from cubie geometry", () => {
    const m = getPllTopViewFromNotation("t-perm", T_PERM);
    expect(m.arrows.length).toBeGreaterThan(0);
    expect(m.face9.every((c) => c === "yellow")).toBe(true);
  });
});

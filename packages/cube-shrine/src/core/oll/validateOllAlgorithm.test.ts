import { describe, expect, it } from "vitest";
import { validateOLLAlgorithm } from "./validateOllAlgorithm";

const SUNE = "(R U R' U) (R U2 R')";
const T_PERM = "(R U R' U') R' F R2 U' R' U' R U R' F'";
const H_PERM = "(M2' U M2') U2 (M2' U M2')";
const ANTI_SUNE = "(R U2 R') (U' R U' R')";
const PI = "R U2 (R2' U' R2 U') (R2' U2 R)";

describe("validateOLLAlgorithm", () => {
  it("rejects invalid notation before cube checks", () => {
    expect(validateOLLAlgorithm("Q")).toMatch(/Invalid/);
  });

  it.each([
    ["T perm", T_PERM],
    ["bare U", "U"],
    ["empty algorithm", ""],
    ["H perm (PLL)", H_PERM],
  ])("rejects PLL-phase prep (%s)", (_label, notation) => {
    expect(validateOLLAlgorithm(notation)).toMatch(/PLL phase/);
  });

  it.each([
    ["Sune", SUNE],
    ["Anti Sune", ANTI_SUNE],
    ["Pi", PI],
  ])("accepts %s (reversed prep is not PLL-phase)", (_label, notation) => {
    expect(validateOLLAlgorithm(notation)).toBeUndefined();
  });

  it("rejects when no whole-cube y restores F2L (single F)", () => {
    expect(validateOLLAlgorithm("F")).toMatch(/first two layers/);
  });
});

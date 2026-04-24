import { describe, expect, it } from "vitest";
import { normalizeAlgorithm, validateAlgorithm } from "./algorithmFormat";

describe("validateAlgorithm", () => {
  it("accepts empty or whitespace-only input", () => {
    expect(validateAlgorithm("")).toBeUndefined();
    expect(validateAlgorithm("   ")).toBeUndefined();
  });

  it("accepts simple sequences and wide / slice / cube moves", () => {
    expect(validateAlgorithm("R U R' U'")).toBeUndefined();
    expect(validateAlgorithm("r u f' M2 S")).toBeUndefined();
    expect(validateAlgorithm("x y' z2")).toBeUndefined();
  });

  it("accepts parenthesis groups and nesting", () => {
    expect(validateAlgorithm("(R U R' U')")).toBeUndefined();
    expect(validateAlgorithm("F (R U R' U') F'")).toBeUndefined();
    expect(validateAlgorithm("(R (U F) U')")).toBeUndefined();
  });

  it("rejects invalid faces and malformed tokens", () => {
    expect(validateAlgorithm("W")).toMatch(/Invalid move/);
    expect(validateAlgorithm("R3")).toMatch(/Invalid move/);
    expect(validateAlgorithm("R''")).toMatch(/Invalid move/);
    expect(validateAlgorithm("2R")).toMatch(/Invalid move/);
  });

  it("rejects parenthesis issues", () => {
    expect(validateAlgorithm("R )")).toMatch(/Unexpected/);
    expect(validateAlgorithm("(R U")).toMatch(/Unclosed/);
    expect(validateAlgorithm("()")).toMatch(/Empty parenthesis/);
    expect(validateAlgorithm("(  )")).toMatch(/Empty parenthesis/);
  });
});

describe("normalizeAlgorithm", () => {
  it("returns undefined when invalid", () => {
    expect(normalizeAlgorithm("R W")).toBeUndefined();
    expect(normalizeAlgorithm("(R U")).toBeUndefined();
  });

  it("returns empty string for empty valid input", () => {
    expect(normalizeAlgorithm("")).toBe("");
    expect(normalizeAlgorithm("  ")).toBe("");
  });

  it("trims ends and collapses spaces between moves", () => {
    expect(normalizeAlgorithm("  R   U  ")).toBe("R U");
    expect(normalizeAlgorithm("F  (  R U  )  F'")).toBe("F (R U) F'");
  });

  it("drops redundant prime on double turns", () => {
    expect(normalizeAlgorithm("U2'")).toBe("U2");
    expect(normalizeAlgorithm("R2' M2' r2'")).toBe("R2 M2 r2");
    expect(normalizeAlgorithm("R2 U2' F2'")).toBe("R2 U2 F2");
  });

  it("preserves quarter-turn primes", () => {
    expect(normalizeAlgorithm("R U'")).toBe("R U'");
    expect(normalizeAlgorithm("M'")).toBe("M'");
  });

  it("matches parseNotation semantics for normalized output", () => {
    const raw = "  ( R U2' R' )  ";
    const n = normalizeAlgorithm(raw);
    expect(n).toBe("(R U2 R')");
    expect(n).toBeDefined();
  });
});

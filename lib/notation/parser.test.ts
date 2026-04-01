import { describe, expect, it } from "vitest";
import { invertNotationSequence, parseNotation } from "./parser";

describe("invertNotationSequence", () => {
  it("inverts a single quarter turn", () => {
    expect(invertNotationSequence("R")).toBe("R'");
    expect(invertNotationSequence("R'")).toBe("R");
    expect(invertNotationSequence("U")).toBe("U'");
    expect(invertNotationSequence("U'")).toBe("U");
  });

  it("leaves double turns unchanged", () => {
    expect(invertNotationSequence("R2")).toBe("R2");
    expect(invertNotationSequence("U2")).toBe("U2");
  });

  it("reverses order and inverts each move for a simple sequence", () => {
    expect(invertNotationSequence("R U")).toBe("U' R'");
    expect(invertNotationSequence("F R U")).toBe("U' R' F'");
  });

  it("is an involution for sequences without brackets (up to formatting)", () => {
    const forward = "R U R' U'";
    expect(invertNotationSequence(invertNotationSequence(forward))).toBe(forward);
  });

  it("preserves outer parentheses on a single group", () => {
    const reversed = invertNotationSequence("(R U R' U')");
    expect(reversed.startsWith("(")).toBe(true);
    expect(reversed.endsWith(")")).toBe(true);
    expect(reversed).toBe("(U R U' R')");
  });

  it("preserves multiple bracket groups and reverses their order", () => {
    const forward = "(R U R' U) (R U2 R')";
    const reversed = invertNotationSequence(forward);
    expect(reversed).toBe("(R U2 R') (U' R U' R')");
    expect(reversed.match(/\(/g)?.length).toBe(2);
    expect(reversed.match(/\)/g)?.length).toBe(2);
  });

  it("handles mixed top-level moves and groups", () => {
    expect(invertNotationSequence("F (R U R' U') F'")).toBe("F (U R U' R') F'");
  });

  it("supports nested parentheses", () => {
    const reversed = invertNotationSequence("(R (U F) U')");
    expect(reversed).toBe("(U (F' U') R')");
  });
});

describe("parseNotation (bracket-aware)", () => {
  it("expands parenthesized chunks into the same move list as an ungrouped sequence", () => {
    const grouped = parseNotation("(R U R' U) (R U2 R')");
    const flat = parseNotation("R U R' U R U2 R'");
    expect(grouped).toEqual(flat);
  });
});

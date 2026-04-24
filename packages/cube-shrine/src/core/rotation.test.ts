import { describe, expect, it } from "vitest";
import type { Cubie, NormalKey, PaletteKey } from "./cubieModel";
import { createSolvedCubies } from "./rotation";

/** Solved palette: +z front blue, −z back green, +x right red, −x left orange, +y U yellow, −y D white. */
const EXPECTED_FACE: Record<NormalKey, PaletteKey> = {
  "z+": "blue",
  "z-": "green",
  "x+": "red",
  "x-": "orange",
  "y+": "yellow",
  "y-": "white"
};

const findCubie = (cubies: Cubie[], x: number, y: number, z: number): Cubie | undefined =>
  cubies.find((c) => c.x === x && c.y === y && c.z === z);

describe("createSolvedCubies", () => {
  it("creates exactly 27 cubies", () => {
    expect(createSolvedCubies()).toHaveLength(27);
  });

  it("leaves the core cubie with no visible stickers", () => {
    const core = findCubie(createSolvedCubies(), 0, 0, 0);
    expect(core).toBeDefined();
    expect(core?.stickers).toEqual({});
  });

  it("assigns the canonical palette on each outward normal (regression for face colors)", () => {
    const cubies = createSolvedCubies();
    for (const c of cubies) {
      const normals: NormalKey[] = [];
      if (c.x === 1) normals.push("x+");
      if (c.x === -1) normals.push("x-");
      if (c.y === 1) normals.push("y+");
      if (c.y === -1) normals.push("y-");
      if (c.z === 1) normals.push("z+");
      if (c.z === -1) normals.push("z-");

      expect(Object.keys(c.stickers).sort()).toEqual([...normals].sort());
      for (const n of normals) {
        expect(c.stickers[n]).toBe(EXPECTED_FACE[n]);
      }
    }
  });

  it("matches face-center stickers (one sticker per center cubie)", () => {
    const cubies = createSolvedCubies();
    expect(findCubie(cubies, 0, 0, 1)?.stickers).toEqual({ "z+": "blue" });
    expect(findCubie(cubies, 0, 0, -1)?.stickers).toEqual({ "z-": "green" });
    expect(findCubie(cubies, 1, 0, 0)?.stickers).toEqual({ "x+": "red" });
    expect(findCubie(cubies, -1, 0, 0)?.stickers).toEqual({ "x-": "orange" });
    expect(findCubie(cubies, 0, 1, 0)?.stickers).toEqual({ "y+": "yellow" });
    expect(findCubie(cubies, 0, -1, 0)?.stickers).toEqual({ "y-": "white" });
  });

  it("matches URF corner stickers (front blue, up yellow, right red)", () => {
    const urf = findCubie(createSolvedCubies(), 1, 1, 1);
    expect(urf?.stickers).toEqual({
      "x+": "red",
      "y+": "yellow",
      "z+": "blue"
    });
  });

  it("matches DLB corner stickers (down white, left orange, back green)", () => {
    const dlb = findCubie(createSolvedCubies(), -1, -1, -1);
    expect(dlb?.stickers).toEqual({
      "x-": "orange",
      "y-": "white",
      "z-": "green"
    });
  });
});

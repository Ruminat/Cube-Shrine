import type { Cubie, NormalKey, PaletteKey } from "@/components/Cube/definitions";
import type { PllTopColorPattern } from "@/lib/pll/pllTopTypes";

const readSticker = (
  stickers: Partial<Record<NormalKey, PaletteKey>>,
  normal: NormalKey
): PaletteKey => stickers[normal] ?? "white";

const findCubie = (cubies: Cubie[], x: number, y: number, z: number): Cubie | undefined =>
  cubies.find((c) => c.x === x && c.y === y && c.z === z);

/**
 * Reads U-face and four side strips (same layout as the OLL flat view).
 * Diagram top = front (+z); no whole-cube canonicalization — matches `MiniCube` frame.
 */
export function extractPllTopColorPatternFromCubies(cubies: Cubie[]): PllTopColorPattern {
  const face9: PaletteKey[] = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const z = 1 - row;
      const x = -1 + col;
      const cubie = findCubie(cubies, x, 1, z);
      face9.push(cubie ? readSticker(cubie.stickers, "y+") : "white");
    }
  }

  const topStrip: [PaletteKey, PaletteKey, PaletteKey] = [
    readSticker(findCubie(cubies, -1, 1, 1)?.stickers ?? {}, "z+"),
    readSticker(findCubie(cubies, 0, 1, 1)?.stickers ?? {}, "z+"),
    readSticker(findCubie(cubies, 1, 1, 1)?.stickers ?? {}, "z+")
  ];

  const bottomStrip: [PaletteKey, PaletteKey, PaletteKey] = [
    readSticker(findCubie(cubies, -1, 1, -1)?.stickers ?? {}, "z-"),
    readSticker(findCubie(cubies, 0, 1, -1)?.stickers ?? {}, "z-"),
    readSticker(findCubie(cubies, 1, 1, -1)?.stickers ?? {}, "z-")
  ];

  const leftStrip: [PaletteKey, PaletteKey, PaletteKey] = [
    readSticker(findCubie(cubies, -1, 1, 1)?.stickers ?? {}, "x-"),
    readSticker(findCubie(cubies, -1, 1, 0)?.stickers ?? {}, "x-"),
    readSticker(findCubie(cubies, -1, 1, -1)?.stickers ?? {}, "x-")
  ];

  const rightStrip: [PaletteKey, PaletteKey, PaletteKey] = [
    readSticker(findCubie(cubies, 1, 1, 1)?.stickers ?? {}, "x+"),
    readSticker(findCubie(cubies, 1, 1, 0)?.stickers ?? {}, "x+"),
    readSticker(findCubie(cubies, 1, 1, -1)?.stickers ?? {}, "x+")
  ];

  return { face9, topStrip, bottomStrip, leftStrip, rightStrip };
}

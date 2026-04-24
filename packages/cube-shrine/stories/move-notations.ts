import type { CubeFace } from "@shreklabs/cube-shrine/core";

/** Every face / slice / whole-cube turn the engine supports (no wide `b` in this model). */
export const CUBE_FACE_ORDER: CubeFace[] = [
  "U",
  "D",
  "L",
  "R",
  "F",
  "B",
  "M",
  "S",
  "u",
  "d",
  "l",
  "r",
  "f",
  "x",
  "y",
  "z"
];

const TURN_SUFFIXES = ["", "'", "2"] as const;

/** All standard atomic tokens: `U`, `U'`, `U2`, … for every supported face (48 total). */
export function allSingleMoveNotations(): string[] {
  return CUBE_FACE_ORDER.flatMap((face) =>
    TURN_SUFFIXES.map((suffix) => (suffix === "" ? face : `${face}${suffix}`))
  );
}

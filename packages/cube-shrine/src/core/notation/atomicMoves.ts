import type { CubeFace } from "../cubeTypes";

/** Every face / slice / whole-cube turn the engine supports (no wide `b` in this model). */
export const ATOMIC_MOVE_FACES: CubeFace[] = [
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
export function allAtomicMoveNotations(): string[] {
  return ATOMIC_MOVE_FACES.flatMap((face) =>
    TURN_SUFFIXES.map((suffix) => (suffix === "" ? face : `${face}${suffix}`))
  );
}

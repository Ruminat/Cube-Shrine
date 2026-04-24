import { allAtomicMoveNotations, ATOMIC_MOVE_FACES, type CubeFace } from "@shreklabs/cube-shrine/core";

/** Storybook alias — prefer `ATOMIC_MOVE_FACES` from `@shreklabs/cube-shrine/core`. */
export const CUBE_FACE_ORDER: CubeFace[] = ATOMIC_MOVE_FACES;

/** Storybook alias — prefer `allAtomicMoveNotations` from `@shreklabs/cube-shrine/core`. */
export const allSingleMoveNotations = allAtomicMoveNotations;

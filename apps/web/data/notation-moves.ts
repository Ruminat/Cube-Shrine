import {
  ATOMIC_MOVE_FACES,
  parseNotation,
  type CubeFace,
} from "@shreklabs/cube-shrine/core";
import type { Algorithm } from "@/types/algorithm";

export const notationCategoryOrder = [
  "face-turns",
  "slice-moves",
  "wide-moves",
  "whole-cube",
] as const;

export type NotationCategoryId = (typeof notationCategoryOrder)[number];

export const notationCategoryLabels: Record<NotationCategoryId, string> = {
  "face-turns": "Face turns",
  "slice-moves": "Slice moves",
  "wide-moves": "Wide moves",
  "whole-cube": "Whole-cube rotations",
};

export const notationCategoryDescriptions: Record<NotationCategoryId, string> = {
  "face-turns": "Outer layer turns on U, D, L, R, F, and B.",
  "slice-moves": "Middle slices between opposite faces (M between L/R, S between F/B).",
  "wide-moves": "Wide turns that move an outer face plus the adjacent slice.",
  "whole-cube": "Rotate the entire puzzle around a fixed axis (x, y, or z).",
};

const FACE_CATEGORY: Record<CubeFace, NotationCategoryId> = {
  U: "face-turns",
  D: "face-turns",
  L: "face-turns",
  R: "face-turns",
  F: "face-turns",
  B: "face-turns",
  M: "slice-moves",
  S: "slice-moves",
  u: "wide-moves",
  d: "wide-moves",
  l: "wide-moves",
  r: "wide-moves",
  f: "wide-moves",
  x: "whole-cube",
  y: "whole-cube",
  z: "whole-cube",
};

const FACE_DESCRIPTIONS: Record<CubeFace, string> = {
  U: "Turn the up face 90° clockwise, viewed from above.",
  D: "Turn the down face 90° clockwise, viewed from below.",
  L: "Turn the left face 90° clockwise, viewed from the left.",
  R: "Turn the right face 90° clockwise, viewed from the right.",
  F: "Turn the front face 90° clockwise, viewed from the front.",
  B: "Turn the back face 90° clockwise, viewed from behind.",
  M: "Turn the middle slice between L and R; follows the L face direction.",
  S: "Turn the standing slice between F and B; follows the F face direction.",
  u: "Wide up turn: U plus the slice below it, clockwise from above.",
  d: "Wide down turn: D plus the slice above it, clockwise from below.",
  l: "Wide left turn: L plus the slice beside it, clockwise from the left.",
  r: "Wide right turn: R plus the slice beside it, clockwise from the right.",
  f: "Wide front turn: F plus the slice behind it, clockwise from the front.",
  x: "Rotate the whole cube around the x axis (same direction as R).",
  y: "Rotate the whole cube around the y axis (same direction as U).",
  z: "Rotate the whole cube around the z axis (same direction as F).",
};

const TURN_SUFFIXES = ["", "'", "2"] as const;

const SUFFIX_TITLE_INDEX = { "": 0, "'": 1, "2": 2 } as const;

/** Readable titles per face, indexed like TURN_SUFFIXES: [clockwise, counterclockwise, double]. */
const MOVE_TITLES: Record<CubeFace, [cw: string, ccw: string, double: string]> = {
  U: ["Up clockwise", "Up counterclockwise", "Up 180°"],
  D: ["Down clockwise", "Down counterclockwise", "Down 180°"],
  L: ["Left clockwise", "Left counterclockwise", "Left 180°"],
  R: ["Right clockwise", "Right counterclockwise", "Right 180°"],
  F: ["Front clockwise", "Front counterclockwise", "Front 180°"],
  B: ["Back clockwise", "Back counterclockwise", "Back 180°"],
  M: ["Middle slice down", "Middle slice up", "Middle slice 180°"],
  S: ["Standing slice clockwise", "Standing slice counterclockwise", "Standing slice 180°"],
  u: ["Wide up clockwise", "Wide up counterclockwise", "Wide up 180°"],
  d: ["Wide down clockwise", "Wide down counterclockwise", "Wide down 180°"],
  l: ["Wide left clockwise", "Wide left counterclockwise", "Wide left 180°"],
  r: ["Wide right clockwise", "Wide right counterclockwise", "Wide right 180°"],
  f: ["Wide front clockwise", "Wide front counterclockwise", "Wide front 180°"],
  x: ["Rotate cube up", "Rotate cube down", "Rotate cube up 180°"],
  y: ["Rotate cube left", "Rotate cube right", "Rotate cube left 180°"],
  z: ["Roll cube clockwise", "Roll cube counterclockwise", "Roll cube 180°"],
};

function moveId(face: CubeFace, suffix: (typeof TURN_SUFFIXES)[number]): string {
  return `notation-${suffix === "" ? face : `${face}${suffix}`}`;
}

function moveNotation(face: CubeFace, suffix: (typeof TURN_SUFFIXES)[number]): string {
  return suffix === "" ? face : `${face}${suffix}`;
}

function buildMove(face: CubeFace, suffix: (typeof TURN_SUFFIXES)[number]): Algorithm {
  const notation = moveNotation(face, suffix);
  return {
    id: moveId(face, suffix),
    name: MOVE_TITLES[face][SUFFIX_TITLE_INDEX[suffix]],
    notation,
    description: FACE_DESCRIPTIONS[face],
    category: "Notation",
    preparationRotations: parseNotation(notation),
  };
}

export interface NotationFaceGroup {
  id: string;
  title: string;
  face: CubeFace;
  moves: Algorithm[];
}

export interface NotationCategoryGroup {
  id: NotationCategoryId;
  title: string;
  description: string;
  faceGroups: NotationFaceGroup[];
}

function buildFaceGroup(face: CubeFace): NotationFaceGroup {
  return {
    id: `notation-face-${face}`,
    title: face,
    face,
    moves: TURN_SUFFIXES.map((suffix) => buildMove(face, suffix)),
  };
}

export const notationCategoryGroups: NotationCategoryGroup[] = notationCategoryOrder.map((categoryId) => {
  const faces = ATOMIC_MOVE_FACES.filter((face) => FACE_CATEGORY[face] === categoryId);
  return {
    id: categoryId,
    title: notationCategoryLabels[categoryId],
    description: notationCategoryDescriptions[categoryId],
    faceGroups: faces.map(buildFaceGroup),
  };
});

/** Flat list of every atomic move (48 total), in library face order. */
export const notationMoves: Algorithm[] = notationCategoryGroups.flatMap((category) =>
  category.faceGroups.flatMap((group) => group.moves),
);

export type CubeFace =
  | "U"
  | "D"
  | "L"
  | "R"
  | "F"
  | "B"
  | "M"
  | "S"
  | "u"
  | "d"
  | "l"
  | "r"
  | "f"
  /** Whole-cube rotation (same direction as R / U / F respectively). */
  | "x"
  | "y"
  | "z";

export interface RotationStep {
  face: CubeFace;
  angle: 90 | -90 | 180 | -180;
}

export interface CubeColors {
  white: string;
  yellow: string;
  red: string;
  orange: string;
  green: string;
  blue: string;
}

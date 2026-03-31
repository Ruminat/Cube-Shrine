export type CubeFace = "U" | "D" | "L" | "R" | "F" | "B" | "M" | "S";

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

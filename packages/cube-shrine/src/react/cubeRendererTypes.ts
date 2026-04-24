import type { RefObject } from "react";
import type { RotationStep } from "../core/cubeTypes";
import type { Cubie } from "../core/cubieModel";

export interface CubeRendererRefs {
  mountRef: RefObject<HTMLDivElement | null>;
  cubiesRef: RefObject<Cubie[]>;
  redrawRef: RefObject<(() => void) | null>;
}

export interface UseCubeRendererOptions {
  size: number;
  preparationRotations: RotationStep[];
}

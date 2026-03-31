import type { RefObject } from "react";
import type { RotationStep } from "@/types/cube";

export type NormalKey = "x+" | "x-" | "y+" | "y-" | "z+" | "z-";
export type PaletteKey = "white" | "yellow" | "red" | "orange" | "green" | "blue";
export type Axis = "x" | "y" | "z";

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Cubie {
  x: number;
  y: number;
  z: number;
  stickers: Partial<Record<NormalKey, PaletteKey>>;
}

export interface CubeRendererRefs {
  mountRef: RefObject<HTMLDivElement | null>;
  cubiesRef: RefObject<Cubie[]>;
  redrawRef: RefObject<(() => void) | null>;
}

export interface UseCubeRendererOptions {
  size: number;
  preparationRotations: RotationStep[];
  interactive?: boolean;
}

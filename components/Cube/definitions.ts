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

/** Sizes below this use a lower DPR cap, compact fills, and no pointer hit-target (list thumbnails). */
export const CUBE_FULL_QUALITY_MIN_SIZE_PX = 120;

/** Device DPR is clamped to this for small on-card previews (below `CUBE_FULL_QUALITY_MIN_SIZE_PX`). */
export const CUBE_PREVIEW_DPR_CAP = 2;

/** Device DPR is clamped to this for larger cubes (e.g. modal). */
export const CUBE_DETAIL_DPR_CAP = 2;

export interface UseCubeRendererOptions {
  size: number;
  preparationRotations: RotationStep[];
}

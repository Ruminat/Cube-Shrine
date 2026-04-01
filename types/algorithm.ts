import type { RotationStep } from "./cube";

export type AlgorithmCategory = "PLL" | "OLL" | "F2L";

export interface Algorithm {
  id: string;
  name: string;
  notation: string;
  description: string;
  category: AlgorithmCategory;
  /** When set, used to nest under category subsections (e.g. PLL families). */
  subgroupId?: string;
  preparationRotations: RotationStep[];
}

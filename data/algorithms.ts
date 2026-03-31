import type { Algorithm } from "@/types/algorithm";

export const algorithms: Algorithm[] = [
  {
    id: "jb-perm",
    name: "Jb Perm",
    notation: "R U R' F' R U R' U' R' F R2 U' R'",
    description: "Swaps three corners and three edges. One of the foundational PLL algorithms for fast last-layer solving.",
    category: "PLL",
    preparationRotations: [
      { face: "U", angle: 90 },
      { face: "R", angle: -90 }
    ]
  },
  {
    id: "t-perm",
    name: "T Perm",
    notation: "R U R' U' R' F R2 U' R' U' R U R' F'",
    description: "Classic PLL case for swapping one corner pair and one edge pair on the last layer.",
    category: "PLL",
    preparationRotations: [{ face: "U", angle: -90 }]
  },
  {
    id: "sune",
    name: "Sune",
    notation: "R U R' U R U2 R'",
    description: "Popular OLL pattern used to orient upper-layer corners.",
    category: "OLL",
    preparationRotations: [{ face: "F", angle: 90 }]
  },
  {
    id: "antisune",
    name: "Anti-Sune",
    notation: "R U2 R' U' R U' R'",
    description: "Mirror version of Sune for alternate oriented-corner layouts.",
    category: "OLL",
    preparationRotations: [{ face: "B", angle: -90 }]
  },
  {
    id: "f2l-pair-insert",
    name: "F2L Pair Insert",
    notation: "U R U' R'",
    description: "Base F2L case: insert a paired corner-edge block into the right slot.",
    category: "F2L",
    preparationRotations: [{ face: "R", angle: 90 }]
  },
  {
    id: "f2l-split-pair",
    name: "F2L Split Pair",
    notation: "R U2 R' U' R U R'",
    description: "Splits the pair and prepares a clean insertion into the target slot.",
    category: "F2L",
    preparationRotations: [{ face: "L", angle: -90 }]
  },
  {
    id: "u-perm",
    name: "Ua Perm",
    notation: "R U' R U R U R U' R' U' R2",
    description: "PLL case that cycles three upper-layer edges clockwise.",
    category: "PLL",
    preparationRotations: [{ face: "U", angle: 180 }]
  }
];

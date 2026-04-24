import type { Algorithm } from "@/types/algorithm";

export const pllSubgroupOrder = [
  "pll-test",
  "pll-edges",
  "pll-corners",
  "pll-adjacent",
  "pll-diagonal",
  "pll-g"
] as const;

export type PllSubgroupId = (typeof pllSubgroupOrder)[number];

export const pllSubgroupLabels: Record<PllSubgroupId, string> = {
  "pll-test": "Test moves (sanity checks)",
  "pll-edges": "U/Z/H-perms (Edges Only)",
  "pll-corners": "A/E-perms (Corners Only)",
  "pll-adjacent": "R/J/T/F (Swap Adjacent Corners)",
  "pll-diagonal": "V/Y/N (Swap Diagonal Corners)",
  "pll-g": "G-perms (Double Cycles)"
};

/** Standard PLL cases and common algorithm memorization forms. */
export const pllAlgorithms: Algorithm[] = [
  {
    id: "test-d",
    name: "Test D (U layer unchanged)",
    notation: "D",
    description: "D-layer quarter turn only; PLL top view should match a solved last layer.",
    category: "PLL",
    subgroupId: "pll-test",
    pllTopFlatApplyMoves: "forward",
    preparationRotations: []
  },
  {
    id: "test-u",
    name: "Test U",
    notation: "U",
    description: "Single U quarter turn for PLL top view and notation pipeline checks.",
    category: "PLL",
    subgroupId: "pll-test",
    pllTopFlatApplyMoves: "forward",
    preparationRotations: []
  },
  {
    id: "test-u2",
    name: "Test U2",
    notation: "U2",
    description: "U double turn for PLL top view checks.",
    category: "PLL",
    subgroupId: "pll-test",
    pllTopFlatApplyMoves: "forward",
    preparationRotations: []
  },
  {
    id: "test-uprime",
    name: "Test U'",
    notation: "U'",
    description: "Inverse U quarter turn for PLL top view checks.",
    category: "PLL",
    subgroupId: "pll-test",
    pllTopFlatApplyMoves: "forward",
    preparationRotations: []
  },
  {
    id: "ua-perm",
    name: "Ua Perm",
    notation: "M2' U M U2 M' U M2'",
    description: "PLL edge 3-cycle (A variant on the U layer).",
    category: "PLL",
    subgroupId: "pll-edges",
    preparationRotations: []
  },
  {
    id: "ub-perm",
    name: "Ub Perm",
    notation: "M2' U' M U2' M' U' M2'",
    description: "PLL edge 3-cycle (B variant on the U layer).",
    category: "PLL",
    subgroupId: "pll-edges",
    preparationRotations: []
  },
  {
    id: "z-perm",
    name: "Z Perm",
    notation: "(M2' U' M2' U') M' (U2 M2' U2) M'",
    description: "PLL Z permutation: swaps two adjacent edges and mirrors the other pair.",
    category: "PLL",
    subgroupId: "pll-edges",
    preparationRotations: []
  },
  {
    id: "h-perm",
    name: "H Perm",
    notation: "(M2' U M2') U2 (M2' U M2')",
    description: "PLL H permutation: swaps opposite edge pairs on the last layer.",
    category: "PLL",
    subgroupId: "pll-edges",
    preparationRotations: []
  },
  {
    id: "aa-perm",
    name: "Aa Perm",
    notation: "x (R' U R') D2 (R U' R') D2 R2 x'",
    description: "PLL corner 3-cycle (A variant).",
    category: "PLL",
    subgroupId: "pll-corners",
    preparationRotations: []
  },
  {
    id: "ab-perm",
    name: "Ab Perm",
    notation: "x R2' D2 (R U R') D2 (R U' R) x'",
    description: "PLL corner 3-cycle (B variant).",
    category: "PLL",
    subgroupId: "pll-corners",
    preparationRotations: []
  },
  {
    id: "e-perm",
    name: "E Perm",
    notation: "x' (R U' R' D) (R U R' D') (R U R' D) (R U' R' D') x",
    description: "PLL E permutation: swaps two opposite corner pairs.",
    category: "PLL",
    subgroupId: "pll-corners",
    preparationRotations: []
  },
  {
    id: "ra-perm",
    name: "Ra Perm",
    notation: "y' (L U2 L' U2) L F' (L' U' L U) L F L2' U",
    description: "PLL Ra permutation (diagonal corner swap with edge cycle).",
    category: "PLL",
    subgroupId: "pll-adjacent",
    preparationRotations: []
  },
  {
    id: "rb-perm",
    name: "Rb Perm",
    notation: "(R' U2 R U2') R' F (R U R' U') R' F' R2 U'",
    description: "PLL Rb permutation (mirror of Ra).",
    category: "PLL",
    subgroupId: "pll-adjacent",
    preparationRotations: []
  },
  {
    id: "ja-perm",
    name: "Ja Perm",
    notation: "y' (L' U' L F) (L' U' L U) L F' L2' U L U",
    description: "PLL Ja permutation (adjacent corner–edge swap, J-family).",
    category: "PLL",
    subgroupId: "pll-adjacent",
    preparationRotations: []
  },
  {
    id: "jb-perm",
    name: "Jb Perm",
    notation: "(R U R' F') (R U R' U') R' F R2 U' R' U'",
    description: "PLL Jb permutation (mirror of Ja).",
    category: "PLL",
    subgroupId: "pll-adjacent",
    preparationRotations: []
  },
  {
    id: "t-perm",
    name: "T Perm",
    notation: "(R U R' U') R' F R2 U' R' U' R U R' F'",
    description: "PLL T permutation: swaps one adjacent edge pair and one corner pair.",
    category: "PLL",
    subgroupId: "pll-adjacent",
    preparationRotations: []
  },
  {
    id: "f-perm",
    name: "F Perm",
    notation: "(R' U' F') (R U R' U') (R' F R2 U') (R' U' R U) (R' U R)",
    description: "PLL F permutation (four-cycle of corners and edges).",
    category: "PLL",
    subgroupId: "pll-adjacent",
    preparationRotations: []
  },
  {
    id: "v-perm",
    name: "V Perm",
    notation: "(R' U R' U') y (R' F' R2 U') (R' U R' F) R F",
    description: "PLL V permutation (diagonal corner swap pattern).",
    category: "PLL",
    subgroupId: "pll-diagonal",
    preparationRotations: []
  },
  {
    id: "y-perm",
    name: "Y Perm",
    notation: "F (R U' R' U') (R U R' F') (R U R' U') (R' F R F')",
    description: "PLL Y permutation: cycles three corners while swapping edges.",
    category: "PLL",
    subgroupId: "pll-diagonal",
    preparationRotations: []
  },
  {
    id: "na-perm",
    name: "Na Perm",
    notation: "(R U R' U) (R U R' F') (R U R' U') (R' F R2 U') R' U2 (R U' R')",
    description: "PLL Na permutation (N-perm family, A orientation).",
    category: "PLL",
    subgroupId: "pll-diagonal",
    preparationRotations: []
  },
  {
    id: "nb-perm",
    name: "Nb Perm",
    notation: "(R' U R U') (R' F' U' F) (R U R' F) R' F' (R U' R)",
    description: "PLL Nb permutation (N-perm family, B orientation).",
    category: "PLL",
    subgroupId: "pll-diagonal",
    preparationRotations: []
  },
  {
    id: "ga-perm",
    name: "Ga Perm",
    notation: "R2 U (R' U R' U') (R U' R2) D U' (R' U R D') U",
    description: "PLL G-permutation (A variant): three-corner cycle with edge setup.",
    category: "PLL",
    subgroupId: "pll-g",
    preparationRotations: []
  },
  {
    id: "gb-perm",
    name: "Gb Perm",
    notation: "(F' U' F) (R2 u R' U) (R U' R u') R2'",
    description: "PLL G-permutation (B variant).",
    category: "PLL",
    subgroupId: "pll-g",
    preparationRotations: []
  },
  {
    id: "gc-perm",
    name: "Gc Perm",
    notation: "R2 U' (R U' R U) (R' U R2 D') (U R U' R') D U'",
    description: "PLL G-permutation (C variant).",
    category: "PLL",
    subgroupId: "pll-g",
    preparationRotations: []
  },
  {
    id: "gd-perm",
    name: "Gd Perm",
    notation: "(R U R') y' (R2 u' R U') (R' U R' u) R2",
    description: "PLL G-permutation (D variant).",
    category: "PLL",
    subgroupId: "pll-g",
    preparationRotations: []
  }
];

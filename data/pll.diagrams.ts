import type { PllTopArrow } from "@/lib/pll/pllTopTypes";

/**
 * Double-headed arrows between U-layer slots (row/col on the 3×3 top diagram).
 * Matches common PLL sheet topology; colors come from live cube simulation.
 */
export const pllTopDiagramArrows: Record<string, PllTopArrow[]> = {
  "ua-perm": [
    { from: { row: 1, col: 0 }, to: { row: 0, col: 1 } },
    { from: { row: 0, col: 1 }, to: { row: 1, col: 2 } },
    { from: { row: 1, col: 2 }, to: { row: 1, col: 0 } }
  ],
  "ub-perm": [
    { from: { row: 1, col: 0 }, to: { row: 1, col: 2 } },
    { from: { row: 1, col: 2 }, to: { row: 0, col: 1 } },
    { from: { row: 0, col: 1 }, to: { row: 1, col: 0 } }
  ],
  "z-perm": [
    { from: { row: 0, col: 1 }, to: { row: 1, col: 2 } },
    { from: { row: 2, col: 1 }, to: { row: 1, col: 0 } }
  ],
  "h-perm": [
    { from: { row: 0, col: 1 }, to: { row: 2, col: 1 } },
    { from: { row: 1, col: 0 }, to: { row: 1, col: 2 } }
  ],
  "aa-perm": [
    { from: { row: 0, col: 0 }, to: { row: 0, col: 2 } },
    { from: { row: 0, col: 2 }, to: { row: 2, col: 0 } },
    { from: { row: 2, col: 0 }, to: { row: 0, col: 0 } }
  ],
  "ab-perm": [
    { from: { row: 0, col: 0 }, to: { row: 2, col: 0 } },
    { from: { row: 2, col: 0 }, to: { row: 0, col: 2 } },
    { from: { row: 0, col: 2 }, to: { row: 0, col: 0 } }
  ],
  "e-perm": [
    { from: { row: 0, col: 0 }, to: { row: 2, col: 2 } },
    { from: { row: 0, col: 2 }, to: { row: 2, col: 0 } }
  ],
  "ra-perm": [
    { from: { row: 0, col: 0 }, to: { row: 0, col: 1 } },
    { from: { row: 1, col: 2 }, to: { row: 2, col: 2 } }
  ],
  "rb-perm": [
    { from: { row: 0, col: 0 }, to: { row: 0, col: 2 } },
    { from: { row: 1, col: 0 }, to: { row: 2, col: 1 } }
  ],
  /** V at top-left: UL corner ↔ UL edge and UL corner ↔ UF edge. */
  "ja-perm": [
    { from: { row: 0, col: 0 }, to: { row: 1, col: 0 } },
    { from: { row: 0, col: 0 }, to: { row: 0, col: 1 } }
  ],
  /** V at top-right: UR corner ↔ UR edge and UR corner ↔ UF edge. */
  "jb-perm": [
    { from: { row: 0, col: 2 }, to: { row: 1, col: 2 } },
    { from: { row: 0, col: 2 }, to: { row: 0, col: 1 } }
  ],
  "t-perm": [
    { from: { row: 1, col: 0 }, to: { row: 1, col: 2 } },
    { from: { row: 0, col: 2 }, to: { row: 2, col: 2 } }
  ],
  /** Two parallel vertical double-arrows: UF–UB and UR–DR edges. */
  "f-perm": [
    { from: { row: 0, col: 1 }, to: { row: 2, col: 1 } },
    { from: { row: 0, col: 2 }, to: { row: 2, col: 2 } }
  ],
  "v-perm": [
    { from: { row: 0, col: 0 }, to: { row: 2, col: 2 } },
    { from: { row: 0, col: 1 }, to: { row: 1, col: 2 } }
  ],
  "y-perm": [
    { from: { row: 0, col: 0 }, to: { row: 2, col: 2 } },
    { from: { row: 0, col: 1 }, to: { row: 1, col: 0 } }
  ],
  "na-perm": [
    { from: { row: 0, col: 0 }, to: { row: 2, col: 2 } },
    { from: { row: 0, col: 1 }, to: { row: 1, col: 0 } }
  ],
  "nb-perm": [
    { from: { row: 0, col: 2 }, to: { row: 2, col: 0 } },
    { from: { row: 0, col: 1 }, to: { row: 1, col: 2 } }
  ],
  "ga-perm": [
    { from: { row: 0, col: 0 }, to: { row: 0, col: 2 } },
    { from: { row: 0, col: 2 }, to: { row: 2, col: 2 } },
    { from: { row: 2, col: 2 }, to: { row: 0, col: 0 } },
    { from: { row: 0, col: 1 }, to: { row: 1, col: 2 } }
  ],
  "gb-perm": [
    { from: { row: 0, col: 2 }, to: { row: 2, col: 2 } },
    { from: { row: 2, col: 2 }, to: { row: 2, col: 0 } },
    { from: { row: 2, col: 0 }, to: { row: 0, col: 2 } },
    { from: { row: 0, col: 1 }, to: { row: 1, col: 0 } }
  ],
  "gc-perm": [
    { from: { row: 2, col: 2 }, to: { row: 2, col: 0 } },
    { from: { row: 2, col: 0 }, to: { row: 0, col: 0 } },
    { from: { row: 0, col: 0 }, to: { row: 2, col: 2 } },
    { from: { row: 2, col: 1 }, to: { row: 1, col: 0 } }
  ],
  "gd-perm": [
    { from: { row: 2, col: 0 }, to: { row: 0, col: 0 } },
    { from: { row: 0, col: 0 }, to: { row: 0, col: 2 } },
    { from: { row: 0, col: 2 }, to: { row: 2, col: 0 } },
    { from: { row: 2, col: 1 }, to: { row: 1, col: 2 } }
  ]
};

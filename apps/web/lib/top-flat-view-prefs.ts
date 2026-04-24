import { persistentBoolean } from "@nanostores/persistent";

/**
 * OLL list + cards: “Top flat view” (canvas top-down pattern). Synced across tabs via `localStorage`.
 * In React UI, prefer `useOllTopFlatViewEnabled` from `@/lib/client-storage/top-flat-view` (hydration-safe).
 */
export const ollTopFlatViewEnabled$ = persistentBoolean("cube-shrine:oll-top-flat-view", true);

/**
 * PLL list + cards: top-down U-layer diagram with permutation arrows. Separate from OLL so each category
 * can be toggled independently.
 */
export const pllTopFlatViewEnabled$ = persistentBoolean("cube-shrine:pll-top-flat-view", true);

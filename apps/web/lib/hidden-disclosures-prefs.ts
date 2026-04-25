import { persistentAtom } from "@nanostores/persistent";

/**
 * Hidden category disclosure IDs (e.g. "OLL", "PLL"), synced via localStorage.
 */
export const hiddenAlgorithmGroups$ = persistentAtom<string[]>("cube-shrine:hidden-groups", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

/**
 * Hidden subgroup disclosure IDs (e.g. "edges", "corners"), synced via localStorage.
 */
export const hiddenAlgorithmSubgroups$ = persistentAtom<string[]>("cube-shrine:hidden-subgroups", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

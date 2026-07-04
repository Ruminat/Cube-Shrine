"use client";

import { ollTopFlatViewEnabled$, pllTopFlatViewEnabled$ } from "@/lib/top-flat-view-prefs";
import { useHydratedPersistentBoolean } from "@/lib/client-storage/use-hydrated-persistent-boolean";

const TOP_FLAT_DEFAULT = false;

/** OLL “Top flat view” preference, safe for SSR + first client paint (then follows `localStorage`). */
export function useOllTopFlatViewEnabled(): boolean {
  return useHydratedPersistentBoolean(ollTopFlatViewEnabled$, TOP_FLAT_DEFAULT);
}

/** PLL “Top flat view” preference, safe for SSR + first client paint (then follows `localStorage`). */
export function usePllTopFlatViewEnabled(): boolean {
  return useHydratedPersistentBoolean(pllTopFlatViewEnabled$, TOP_FLAT_DEFAULT);
}

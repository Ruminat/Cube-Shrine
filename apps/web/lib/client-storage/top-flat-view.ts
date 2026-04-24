"use client";

import { ollTopFlatViewEnabled$ } from "@/lib/top-flat-view-prefs";
import { useHydratedPersistentBoolean } from "@/lib/client-storage/use-hydrated-persistent-boolean";

const TOP_FLAT_DEFAULT = true;

/** OLL “Top flat view” preference, safe for SSR + first client paint (then follows `localStorage`). */
export function useOllTopFlatViewEnabled(): boolean {
  return useHydratedPersistentBoolean(ollTopFlatViewEnabled$, TOP_FLAT_DEFAULT);
}

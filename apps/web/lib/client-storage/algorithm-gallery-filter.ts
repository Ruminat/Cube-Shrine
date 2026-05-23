"use client";

import { useCallback } from "react";
import {
  algorithmGalleryFilter$,
  algorithmGalleryFilterDefault,
  type AlgorithmGalleryCategoryFilter,
  type AlgorithmGalleryFilter,
} from "@/lib/algorithm-gallery-filter-prefs";
import { useHydratedPersistentValue } from "@/lib/client-storage/use-hydrated-persistent-value";

/** Algorithms page filter state, safe for SSR + first client paint (then follows `localStorage`). */
export function useAlgorithmGalleryFilter(): {
  filter: AlgorithmGalleryFilter;
  setCategory: (category: AlgorithmGalleryCategoryFilter) => void;
  setSubgroupId: (subgroupId: string | null) => void;
  setSearchQuery: (searchQuery: string) => void;
} {
  const filter = useHydratedPersistentValue(algorithmGalleryFilter$, algorithmGalleryFilterDefault);

  const patchFilter = useCallback((patch: Partial<AlgorithmGalleryFilter>) => {
    algorithmGalleryFilter$.set({ ...algorithmGalleryFilter$.get(), ...patch });
  }, []);

  const setCategory = useCallback(
    (category: AlgorithmGalleryCategoryFilter) => {
      patchFilter({ category, subgroupId: null });
    },
    [patchFilter]
  );

  const setSubgroupId = useCallback(
    (subgroupId: string | null) => {
      patchFilter({ subgroupId });
    },
    [patchFilter]
  );

  const setSearchQuery = useCallback(
    (searchQuery: string) => {
      patchFilter({ searchQuery });
    },
    [patchFilter]
  );

  return { filter, setCategory, setSubgroupId, setSearchQuery };
}

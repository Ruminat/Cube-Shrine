"use client";

import { hiddenAlgorithmGroups$, hiddenAlgorithmSubgroups$ } from "@/lib/hidden-disclosures-prefs";
import { useHydratedPersistentStringArray } from "@/lib/client-storage/use-hydrated-persistent-string-array";

const HIDDEN_DISCLOSURES_DEFAULT: string[] = [];

export function useHiddenAlgorithmGroups(): Set<string> {
  return new Set(useHydratedPersistentStringArray(hiddenAlgorithmGroups$, HIDDEN_DISCLOSURES_DEFAULT));
}

export function useHiddenAlgorithmSubgroups(): Set<string> {
  return new Set(useHydratedPersistentStringArray(hiddenAlgorithmSubgroups$, HIDDEN_DISCLOSURES_DEFAULT));
}

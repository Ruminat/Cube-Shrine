"use client";

import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import type { WritableAtom } from "nanostores";

/**
 * Subscribes to a persistent number-array atom but returns `fallback` until mount
 * so SSR and first client render stay in sync.
 */
export function useHydratedPersistentNumberArray(
  atom: WritableAtom<number[]>,
  fallback: number[]
): number[] {
  const stored = useStore(atom);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated ? stored : fallback;
}

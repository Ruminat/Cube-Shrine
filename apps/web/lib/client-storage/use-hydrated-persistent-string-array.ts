"use client";

import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import type { WritableAtom } from "nanostores";

/**
 * Subscribes to a persistent string-array atom but returns `fallback` until mount
 * so SSR and first client render stay in sync.
 */
export function useHydratedPersistentStringArray(
  atom: WritableAtom<string[]>,
  fallback: string[]
): string[] {
  const stored = useStore(atom);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated ? stored : fallback;
}

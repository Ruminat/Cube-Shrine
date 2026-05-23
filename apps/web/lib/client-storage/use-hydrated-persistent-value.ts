"use client";

import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import type { WritableAtom } from "nanostores";

/**
 * Subscribes to a persistent atom but returns `fallback` until mount
 * so SSR and first client render stay in sync.
 */
export function useHydratedPersistentValue<T>(atom: WritableAtom<T>, fallback: T): T {
  const stored = useStore(atom);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated ? stored : fallback;
}

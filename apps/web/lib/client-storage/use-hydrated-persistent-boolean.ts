"use client";

import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import type { WritableAtom } from "nanostores";

/**
 * Subscribes to a nanostores `persistentBoolean` (or any boolean atom) but returns `fallback`
 * until the client has mounted, so SSR and the first client render match and avoid hydration mismatches.
 */
export function useHydratedPersistentBoolean(
  atom: WritableAtom<boolean>,
  ssrFallback: boolean
): boolean {
  const stored = useStore(atom);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated ? stored : ssrFallback;
}

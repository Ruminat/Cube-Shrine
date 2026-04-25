"use client";

import type { RefObject } from "react";
import { useEffect } from "react";

/** After a running stop tied to Space, allow starting a new hold once Space is fully released. */
export function useTimerSpaceBlockReset(blockSpaceStartRef: RefObject<boolean>) {
  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") blockSpaceStartRef.current = false;
    };
    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, [blockSpaceStartRef]);
}

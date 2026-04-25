"use client";

import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import type { SolveEntry } from "@/components/TimerPage/definitions";
import { effectiveSeconds } from "@/components/TimerPage/utils";

/** Keeps the big idle readout in sync with stored solve entries. */
export function useTimerLatestSolveBannerMs(
  solveEntries: SolveEntry[],
  setLatestSolveMs: Dispatch<SetStateAction<number>>
) {
  useEffect(() => {
    const lastSolve = solveEntries.at(-1);
    if (!lastSolve) {
      setLatestSolveMs(0);
      return;
    }
    if (lastSolve.penalty === "DNF") {
      setLatestSolveMs(0);
      return;
    }
    setLatestSolveMs(effectiveSeconds(lastSolve) * 1000);
  }, [setLatestSolveMs, solveEntries]);
}

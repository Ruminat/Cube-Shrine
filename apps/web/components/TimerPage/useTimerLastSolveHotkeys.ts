"use client";

import { useEffect } from "react";
import type { SolveEntry } from "@/components/TimerPage/definitions";
import type { TimerPhase } from "@/components/TimerPage/definitions";
import { withPenalty } from "@/components/TimerPage/utils";

/** Idle (no modal): `2` toggles +2 on the last solve; `d` toggles DNF. */
export function useTimerLastSolveHotkeys(
  phase: TimerPhase,
  solveEntries: SolveEntry[],
  selectedSolveIndex: number | null,
  replaceSolve: (index: number, nextEntry: SolveEntry) => void
) {
  useEffect(() => {
    if (phase !== "idle" || !solveEntries.length || selectedSolveIndex !== null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const lastIndex = solveEntries.length - 1;
      const lastSolve = solveEntries[lastIndex];
      if (!lastSolve) return;
      if (event.key === "2") {
        event.preventDefault();
        if (lastSolve.penalty === "DNF") return;
        replaceSolve(lastIndex, withPenalty(lastSolve, lastSolve.penalty === "+2" ? undefined : "+2"));
      }
      if (event.key.toLowerCase() === "d") {
        event.preventDefault();
        replaceSolve(lastIndex, withPenalty(lastSolve, lastSolve.penalty === "DNF" ? undefined : "DNF"));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, replaceSolve, selectedSolveIndex, solveEntries]);
}

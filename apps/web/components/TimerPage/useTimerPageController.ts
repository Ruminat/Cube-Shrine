"use client";

import { parseNotation } from "@shreklabs/cube-shrine/core";
import { useCallback, useRef, useState } from "react";
import {
  MAX_STORED_SOLVES,
  PRE_SCRAMBLE_NOTATION,
  type SolveEntry,
  type TimerPhase,
} from "@/components/TimerPage/definitions";
import { buildTimerSessionStats } from "@/components/TimerPage/stats";
import { useTimerHoldKeys } from "@/components/TimerPage/useTimerHoldKeys";
import { useTimerIdleSpaceToHold } from "@/components/TimerPage/useTimerIdleSpaceToHold";
import { useTimerLastSolveHotkeys } from "@/components/TimerPage/useTimerLastSolveHotkeys";
import { useTimerLatestSolveBannerMs } from "@/components/TimerPage/useTimerLatestSolveBannerMs";
import { useTimerRunningClock } from "@/components/TimerPage/useTimerRunningClock";
import { useTimerRunningStopCapture } from "@/components/TimerPage/useTimerRunningStopCapture";
import { useTimerScramble } from "@/components/TimerPage/useTimerScramble";
import { useTimerSpaceBarGuard } from "@/components/TimerPage/useTimerSpaceBarGuard";
import { useTimerSpaceBlockReset } from "@/components/TimerPage/useTimerSpaceBlockReset";
import {
  effectiveSeconds,
  formatSolveTime,
  roundSolveSeconds,
  withPenalty,
} from "@/components/TimerPage/utils";
import { useTimerSolveTimes } from "@/lib/client-storage/timer-solves";

/**
 * Timer page state + input wiring. Each concern lives in a `useTimer*` hook beside this file;
 * this module only composes them and exposes the derived view-model for `TimerPage`.
 */
export function useTimerPageController() {
  const [solveEntries, setSolveEntries, solvesHydrated] = useTimerSolveTimes();
  const { scramble, onScrambleSolved, skipScramble } = useTimerScramble();
  const [phase, setPhase] = useState<TimerPhase>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [latestSolveMs, setLatestSolveMs] = useState(0);
  const [selectedSolveIndex, setSelectedSolveIndex] = useState<number | null>(null);

  const startPerfRef = useRef<number | null>(null);
  const blockSpaceStartRef = useRef(false);
  const blockStartClickUntilRef = useRef(0);

  useTimerLatestSolveBannerMs(solveEntries, setLatestSolveMs);

  const replaceSolve = useCallback(
    (index: number, nextEntry: SolveEntry) => {
      const next = [...solveEntries];
      next[index] = nextEntry;
      void setSolveEntries(next.slice(-MAX_STORED_SOLVES));
    },
    [setSolveEntries, solveEntries]
  );

  const removeSolve = useCallback(
    (index: number) => {
      void setSolveEntries(solveEntries.filter((_, i) => i !== index));
      setSelectedSolveIndex(null);
    },
    [setSolveEntries, solveEntries]
  );

  const clearSession = useCallback(() => {
    void setSolveEntries([]);
    setLatestSolveMs(0);
  }, [setSolveEntries]);

  const beginRun = useCallback(() => {
    startPerfRef.current = performance.now();
    setElapsedMs(0);
    setPhase("running");
  }, []);

  const endRun = useCallback(() => {
    if (startPerfRef.current === null || scramble === null) return;
    const end = performance.now();
    const ms = end - startPerfRef.current;
    startPerfRef.current = null;
    setLatestSolveMs(ms);
    const nextEntry: SolveEntry = {
      time: roundSolveSeconds(ms / 1000),
      scramble,
    };
    void setSolveEntries([...solveEntries, nextEntry].slice(-MAX_STORED_SOLVES));
    onScrambleSolved();
    setPhase("idle");
    blockStartClickUntilRef.current = Date.now() + 450;
  }, [onScrambleSolved, scramble, setSolveEntries, solveEntries]);

  useTimerSpaceBarGuard();
  useTimerRunningClock(phase, startPerfRef, setElapsedMs);
  useTimerRunningStopCapture(phase, endRun, blockSpaceStartRef);
  useTimerSpaceBlockReset(blockSpaceStartRef);
  useTimerIdleSpaceToHold(phase, blockSpaceStartRef, setPhase);
  useTimerHoldKeys(phase, beginRun, setPhase);
  useTimerLastSolveHotkeys(phase, solveEntries, selectedSolveIndex, replaceSolve);

  const sessionStats = buildTimerSessionStats(solveEntries);
  const latestEntryForBanner = solveEntries.at(-1);
  const latestIsDnf = latestEntryForBanner?.penalty === "DNF";
  const latestIsPlusTwo = latestEntryForBanner?.penalty === "+2";
  const latestDisplay = latestIsDnf ? "DNF" : formatSolveTime(latestSolveMs);
  const selectedSolveEntry = selectedSolveIndex === null ? null : solveEntries[selectedSolveIndex] ?? null;
  const selectedEffective = selectedSolveEntry === null ? null : effectiveSeconds(selectedSolveEntry);
  const selectedRank =
    selectedEffective === null || !Number.isFinite(selectedEffective)
      ? null
      : sessionStats.effective.filter((value) => Number.isFinite(value) && value <= selectedEffective).length;

  const preparationRotations =
    scramble !== null ? [...parseNotation(PRE_SCRAMBLE_NOTATION), ...parseNotation(scramble)] : [];

  const setSelectedPenalty = useCallback(
    (index: number, penalty?: "+2" | "DNF") => {
      const entry = solveEntries[index];
      if (!entry) return;
      replaceSolve(index, withPenalty(entry, penalty));
    },
    [replaceSolve, solveEntries]
  );

  return {
    solveEntries,
    scramble,
    phase,
    elapsedMs,
    hydrated: solvesHydrated,
    selectedSolveIndex,
    setSelectedSolveIndex,
    blockStartClickUntilRef,
    beginRun,
    skipScramble,
    replaceSolve,
    removeSolve,
    clearSession,
    sessionStats,
    latestIsDnf,
    latestIsPlusTwo,
    latestDisplay,
    selectedSolveEntry,
    setSelectedPenalty,
    selectedRank,
    preparationRotations,
  };
}

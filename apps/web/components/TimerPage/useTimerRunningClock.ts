"use client";

import type { RefObject } from "react";
import { useEffect } from "react";
import type { TimerPhase } from "@/components/TimerPage/definitions";

/** RAF loop for the fullscreen running timer. */
export function useTimerRunningClock(
  phase: TimerPhase,
  startPerfRef: RefObject<number | null>,
  setElapsedMs: (ms: number) => void
) {
  useEffect(() => {
    if (phase !== "running") return;
    let rafId = 0;
    const loop = () => {
      if (startPerfRef.current === null) return;
      setElapsedMs(performance.now() - startPerfRef.current);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [phase, setElapsedMs, startPerfRef]);
}

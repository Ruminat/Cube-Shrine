"use client";

import type { RefObject } from "react";
import { useEffect } from "react";
import type { TimerPhase } from "@/components/TimerPage/definitions";

/**
 * While running: any pointer or key stops the timer. Space is flagged so we do not
 * immediately re-enter hold on the same key release.
 */
export function useTimerRunningStopCapture(
  phase: TimerPhase,
  endRun: () => void,
  blockSpaceStartRef: RefObject<boolean>
) {
  useEffect(() => {
    if (phase !== "running") return;
    const stop = () => endRun();
    const onPointerDown = () => stop();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.code === "Space") blockSpaceStartRef.current = true;
      stop();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      blockSpaceStartRef.current = true;
      stop();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keyup", onKeyUp, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("keyup", onKeyUp, true);
    };
  }, [blockSpaceStartRef, endRun, phase]);
}

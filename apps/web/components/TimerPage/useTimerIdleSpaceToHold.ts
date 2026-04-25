"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";
import { useEffect } from "react";
import type { TimerPhase } from "@/components/TimerPage/definitions";

/** Idle: Space down enters the green “hold” screen (unless blocked after a stop). */
export function useTimerIdleSpaceToHold(
  phase: TimerPhase,
  blockSpaceStartRef: RefObject<boolean>,
  setPhase: Dispatch<SetStateAction<TimerPhase>>
) {
  useEffect(() => {
    if (phase !== "idle") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat || blockSpaceStartRef.current) return;
      event.preventDefault();
      setPhase("holdReady");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [blockSpaceStartRef, phase, setPhase]);
}

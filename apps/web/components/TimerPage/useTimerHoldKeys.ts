"use client";

import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import type { TimerPhase } from "@/components/TimerPage/definitions";

/** Hold: Space up starts the run; Escape cancels back to idle. */
export function useTimerHoldKeys(
  phase: TimerPhase,
  beginRun: () => void,
  setPhase: Dispatch<SetStateAction<TimerPhase>>
) {
  useEffect(() => {
    if (phase !== "holdReady") return;
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      beginRun();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        event.preventDefault();
        setPhase("idle");
      }
    };
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [beginRun, phase, setPhase]);
}

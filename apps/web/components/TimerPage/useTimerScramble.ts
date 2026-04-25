"use client";

import { useCallback, useEffect, useState } from "react";
import { generateScramble } from "@/lib/generate-scramble";

const TIMER_CURRENT_SCRAMBLE_KEY = "cube-shrine:timer-current-scramble";

function persistScramble(next: string) {
  localStorage.setItem(TIMER_CURRENT_SCRAMBLE_KEY, next);
}

function nextScramble(): string {
  return generateScramble(22);
}

/** Current scramble persisted in localStorage and rotated only on solve/skip. */
export function useTimerScramble() {
  const [scramble, setScramble] = useState<string | null>(null);

  const setAndPersist = useCallback((next: string) => {
    setScramble(next);
    persistScramble(next);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(TIMER_CURRENT_SCRAMBLE_KEY);
    if (stored && stored.trim().length > 0) {
      setScramble(stored);
      return;
    }
    setAndPersist(nextScramble());
  }, [setAndPersist]);

  const onScrambleSolved = useCallback(() => {
    setAndPersist(nextScramble());
  }, [setAndPersist]);

  const skipScramble = useCallback(() => {
    setAndPersist(nextScramble());
  }, [setAndPersist]);

  return { scramble, onScrambleSolved, skipScramble };
}

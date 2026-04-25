"use client";

import { get, set, del, createStore } from "idb-keyval";
import { useCallback, useEffect, useState } from "react";
import type { SolveEntry } from "@/components/TimerPage/definitions";

const TIMER_SOLVES_DEFAULT: SolveEntry[] = [];
const TIMER_SOLVES_DB = createStore("cube-shrine-timer", "timer-solves");
const TIMER_SOLVES_KEY = "entries";

function normalizeEntries(value: unknown): SolveEntry[] {
  if (!Array.isArray(value)) return TIMER_SOLVES_DEFAULT;
  const normalized: SolveEntry[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue;
    const candidate = entry as Partial<SolveEntry>;
    if (typeof candidate.time !== "number" || !Number.isFinite(candidate.time) || candidate.time < 0) continue;
    if (typeof candidate.scramble !== "string" || candidate.scramble.trim().length === 0) continue;
    if (candidate.penalty !== undefined && candidate.penalty !== "+2" && candidate.penalty !== "DNF") continue;
    if (candidate.penalty === undefined) {
      normalized.push({ time: candidate.time, scramble: candidate.scramble });
    } else {
      normalized.push({ time: candidate.time, scramble: candidate.scramble, penalty: candidate.penalty });
    }
  }
  return normalized;
}

export function useTimerSolveTimes(): [SolveEntry[], (next: SolveEntry[]) => Promise<void>, boolean] {
  const [solves, setSolvesState] = useState<SolveEntry[]>(TIMER_SOLVES_DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const read = async () => {
      try {
        const stored = await get<unknown>(TIMER_SOLVES_KEY, TIMER_SOLVES_DB);
        if (cancelled) return;
        setSolvesState(normalizeEntries(stored));
      } finally {
        if (!cancelled) setHydrated(true);
      }
    };
    void read();
    return () => {
      cancelled = true;
    };
  }, []);

  const setSolves = useCallback(async (next: SolveEntry[]) => {
    const normalized = normalizeEntries(next);
    setSolvesState(normalized);
    if (normalized.length === 0) {
      await del(TIMER_SOLVES_KEY, TIMER_SOLVES_DB);
      return;
    }
    await set(TIMER_SOLVES_KEY, normalized, TIMER_SOLVES_DB);
  }, []);

  return [solves, setSolves, hydrated];
}

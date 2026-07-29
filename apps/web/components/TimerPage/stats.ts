import type { SolveEntry } from "@/components/TimerPage/definitions";
import { effectiveSeconds } from "@/components/TimerPage/utils";

export type StatLabel = { value: number; sigma: number };

export type WindowStatPair = {
  current: StatLabel;
  best: StatLabel;
};

function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (!values.length) return 0;
  if (values.some((v) => !Number.isFinite(v))) return Number.POSITIVE_INFINITY;
  const avg = mean(values);
  const variance = values.reduce((acc, v) => acc + (v - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function trimmedWindow(values: number[]): number[] {
  if (values.length < 3) return values;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted.slice(1, sorted.length - 1);
}

export function statLabel(values: number[]): StatLabel {
  if (!values.length) return { value: 0, sigma: 0 };
  if (values.some((v) => !Number.isFinite(v))) {
    return { value: Number.POSITIVE_INFINITY, sigma: Number.POSITIVE_INFINITY };
  }
  return { value: mean(values), sigma: stdDev(values) };
}

/**
 * Current and best value for a rolling window of `size` solves.
 *
 * Before the window is full the stat is computed over however many solves exist rather
 * than being withheld, so a 3-solve session still reports a meaningful "average of 5".
 * Trimming still applies (`trimmedWindow` is a no-op below 3 samples), so the statistic
 * keeps its identity and only the sample count shrinks.
 */
export function computeWindowStats(
  effective: number[],
  size: number,
  trimmed: boolean
): WindowStatPair {
  if (effective.length === 0) {
    return { current: { value: 0, sigma: 0 }, best: { value: 0, sigma: 0 } };
  }

  const windowSize = Math.min(size, effective.length);
  const series = (window: number[]) => (trimmed ? trimmedWindow(window) : window);
  const current = statLabel(series(effective.slice(-windowSize)));

  // Seeded from the first window rather than +Infinity so an all-DNF session reports the
  // DNF label (with its sigma) instead of a synthetic zero.
  let best: StatLabel | null = null;
  for (let i = 0; i <= effective.length - windowSize; i += 1) {
    const stat = statLabel(series(effective.slice(i, i + windowSize)));
    if (best === null || stat.value < best.value) {
      best = stat;
    }
  }

  return { current, best: best ?? current };
}

export type TimerSessionStats = {
  effective: number[];
  completed: SolveEntry[];
  completedEffective: number[];
  bestEffective: number | null;
  worstHasDnf: boolean;
  worstEffective: number | null;
  canColorExtremes: boolean;
  mo3: WindowStatPair;
  ao5: WindowStatPair;
  ao12: WindowStatPair;
  ao50: WindowStatPair;
  ao100: WindowStatPair;
  sessionAverage: StatLabel;
  sessionMean: StatLabel;
};

export function buildTimerSessionStats(solveEntries: SolveEntry[]): TimerSessionStats {
  const effective = solveEntries.map(effectiveSeconds);
  const completed = solveEntries.filter((entry) => entry.penalty !== "DNF");
  const completedEffective = completed.map(effectiveSeconds);
  const finiteEffective = effective.filter(Number.isFinite);
  const bestEffective = finiteEffective.length ? Math.min(...finiteEffective) : null;
  const worstHasDnf = effective.some((value) => !Number.isFinite(value));
  const worstEffective = worstHasDnf ? Number.POSITIVE_INFINITY : effective.length ? Math.max(...effective) : null;
  const canColorExtremes =
    new Set(finiteEffective.map((v) => v.toFixed(2))).size >= 2 || (worstHasDnf && effective.length > 1);

  return {
    effective,
    completed,
    completedEffective,
    bestEffective,
    worstHasDnf,
    worstEffective,
    canColorExtremes,
    mo3: computeWindowStats(effective, 3, false),
    ao5: computeWindowStats(effective, 5, true),
    ao12: computeWindowStats(effective, 12, true),
    ao50: computeWindowStats(effective, 50, true),
    ao100: computeWindowStats(effective, 100, true),
    sessionAverage: statLabel(completedEffective),
    sessionMean: statLabel(effective),
  };
}

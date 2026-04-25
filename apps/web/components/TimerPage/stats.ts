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

export function computeWindowStats(
  effective: number[],
  size: number,
  trimmed: boolean
): WindowStatPair {
  if (effective.length < size) {
    return { current: { value: 0, sigma: 0 }, best: { value: 0, sigma: 0 } };
  }
  const currentWindow = effective.slice(-size);
  const currentSeries = trimmed ? trimmedWindow(currentWindow) : currentWindow;
  const current = statLabel(currentSeries);
  let best = { value: Number.POSITIVE_INFINITY, sigma: 0 };
  for (let i = 0; i <= effective.length - size; i += 1) {
    const window = effective.slice(i, i + size);
    const series = trimmed ? trimmedWindow(window) : window;
    const stat = statLabel(series);
    if (stat.value < best.value) {
      best = stat;
    }
  }
  if (!Number.isFinite(best.value) && best.value !== Number.POSITIVE_INFINITY) {
    return { current, best: { value: 0, sigma: 0 } };
  }
  return {
    current,
    best: Number.isFinite(best.value) || best.value === Number.POSITIVE_INFINITY ? best : { value: 0, sigma: 0 },
  };
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

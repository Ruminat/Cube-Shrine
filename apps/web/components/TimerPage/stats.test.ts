import { describe, expect, it } from "vitest";
import { buildTimerSessionStats, computeWindowStats } from "@/components/TimerPage/stats";
import type { SolveEntry } from "@/components/TimerPage/definitions";

function makeSolve(time: number, penalty?: "+2" | "DNF"): SolveEntry {
  if (penalty === undefined) return { time, scramble: "R U R' U'" };
  return { time, scramble: "R U R' U'", penalty };
}

describe("buildTimerSessionStats", () => {
  it("returns safe defaults for an empty solve list", () => {
    const stats = buildTimerSessionStats([]);

    expect(stats.effective).toEqual([]);
    expect(stats.completed).toEqual([]);
    expect(stats.completedEffective).toEqual([]);
    expect(stats.bestEffective).toBeNull();
    expect(stats.worstHasDnf).toBe(false);
    expect(stats.worstEffective).toBeNull();
    expect(stats.canColorExtremes).toBe(false);
    expect(stats.sessionAverage).toEqual({ value: 0, sigma: 0 });
    expect(stats.sessionMean).toEqual({ value: 0, sigma: 0 });
    expect(stats.mo3.current).toEqual({ value: 0, sigma: 0 });
    expect(stats.mo3.best).toEqual({ value: 0, sigma: 0 });
  });

  it("handles mixed normal solves, +2 and DNF correctly", () => {
    const stats = buildTimerSessionStats([
      makeSolve(10, "+2"),
      makeSolve(11),
      makeSolve(9, "DNF"),
    ]);

    expect(stats.effective).toEqual([12, 11, Number.POSITIVE_INFINITY]);
    expect(stats.completedEffective).toEqual([12, 11]);
    expect(stats.bestEffective).toBe(11);
    expect(stats.worstHasDnf).toBe(true);
    expect(stats.worstEffective).toBe(Number.POSITIVE_INFINITY);
    expect(stats.sessionAverage.value).toBe(11.5);
    expect(stats.sessionMean.value).toBe(Number.POSITIVE_INFINITY);
    expect(stats.mo3.current.value).toBe(Number.POSITIVE_INFINITY);
  });

  it("works when all solves are penalties only (+2 or DNF)", () => {
    const stats = buildTimerSessionStats([
      makeSolve(8, "+2"),
      makeSolve(7, "+2"),
      makeSolve(5, "DNF"),
    ]);

    expect(stats.completed.length).toBe(2);
    expect(stats.completedEffective).toEqual([10, 9]);
    expect(stats.bestEffective).toBe(9);
    expect(stats.sessionAverage.value).toBe(9.5);
    expect(stats.sessionMean.value).toBe(Number.POSITIVE_INFINITY);
  });

  it("handles all-DNF solves without crashing", () => {
    const stats = buildTimerSessionStats([
      makeSolve(8, "DNF"),
      makeSolve(7, "DNF"),
    ]);

    expect(stats.completed).toEqual([]);
    expect(stats.completedEffective).toEqual([]);
    expect(stats.bestEffective).toBeNull();
    expect(stats.worstHasDnf).toBe(true);
    expect(stats.worstEffective).toBe(Number.POSITIVE_INFINITY);
    expect(stats.sessionAverage).toEqual({ value: 0, sigma: 0 });
    expect(stats.sessionMean.value).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("computeWindowStats", () => {
  it("returns zero labels when there are not enough solves", () => {
    const stats = computeWindowStats([10, 11], 3, false);
    expect(stats.current).toEqual({ value: 0, sigma: 0 });
    expect(stats.best).toEqual({ value: 0, sigma: 0 });
  });

  it("returns DNF average for windows that include DNF", () => {
    const stats = computeWindowStats([10, Number.POSITIVE_INFINITY, 12], 3, false);
    expect(stats.current.value).toBe(Number.POSITIVE_INFINITY);
    expect(stats.best.value).toBe(Number.POSITIVE_INFINITY);
  });
});

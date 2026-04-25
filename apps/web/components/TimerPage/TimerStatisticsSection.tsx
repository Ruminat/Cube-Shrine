"use client";

import type { TimerSessionStats } from "@/components/TimerPage/stats";
import type { SolveEntry } from "@/components/TimerPage/definitions";
import {
  StatExtremeHighlight,
  StatGroup,
  StatReadoutRow,
} from "@/components/TimerPage/render";
import { TimerStatsChart } from "@/components/TimerPage/TimerStatsChart";
import { formatSigma, formatStatsValue } from "@/components/TimerPage/utils";

export type TimerStatisticsSectionProps = {
  solveEntries: SolveEntry[];
  solveEntriesLength: number;
  completedCount: number;
  stats: TimerSessionStats;
};

export function TimerStatisticsSection({
  solveEntries,
  solveEntriesLength,
  completedCount,
  stats,
}: TimerStatisticsSectionProps) {
  const { mo3, ao5, ao12, ao50, ao100, sessionAverage, sessionMean, bestEffective, worstEffective } = stats;

  const bestLabel = bestEffective === null ? "0.00" : formatStatsValue(bestEffective);
  const worstLabel = worstEffective === null ? "0.00" : formatStatsValue(worstEffective);

  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Statistics</h2>

      <div className="mt-3 grid gap-6 md:grid-cols-2">
        <TimerStatsChart solveEntries={solveEntries} />

        <div className="min-w-0 flex flex-col gap-4">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 dark:border-primary/30 dark:bg-primary/10">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Best / worst
            </p>
            <div className="flex flex-wrap gap-3">
              <StatExtremeHighlight label="Best" value={bestLabel} />
              <StatExtremeHighlight label="Worst" value={worstLabel} />
            </div>
          </div>

          <StatGroup title="Session">
            <StatReadoutRow
              label="Completed solves"
              value={`${completedCount} / ${solveEntriesLength}`}
            />
            <StatReadoutRow
              label="Average (no DNF)"
              value={formatStatsValue(sessionAverage.value)}
              sigma={formatSigma(sessionAverage.sigma)}
            />
            <StatReadoutRow
              label="Mean (all solves)"
              value={formatStatsValue(sessionMean.value)}
              sigma={formatSigma(sessionMean.sigma)}
            />
          </StatGroup>

          <StatGroup title="Mean of 3">
            <StatReadoutRow label="Current" value={formatStatsValue(mo3.current.value)} sigma={formatSigma(mo3.current.sigma)} />
            <StatReadoutRow label="Best" value={formatStatsValue(mo3.best.value)} sigma={formatSigma(mo3.best.sigma)} />
          </StatGroup>

          <StatGroup title="Average of 5">
            <StatReadoutRow label="Current" value={formatStatsValue(ao5.current.value)} sigma={formatSigma(ao5.current.sigma)} />
            <StatReadoutRow label="Best" value={formatStatsValue(ao5.best.value)} sigma={formatSigma(ao5.best.sigma)} />
          </StatGroup>

          <StatGroup title="Average of 12">
            <StatReadoutRow label="Current" value={formatStatsValue(ao12.current.value)} sigma={formatSigma(ao12.current.sigma)} />
            <StatReadoutRow label="Best" value={formatStatsValue(ao12.best.value)} sigma={formatSigma(ao12.best.sigma)} />
          </StatGroup>

          <StatGroup title="Average of 50">
            <StatReadoutRow label="Current" value={formatStatsValue(ao50.current.value)} sigma={formatSigma(ao50.current.sigma)} />
            <StatReadoutRow label="Best" value={formatStatsValue(ao50.best.value)} sigma={formatSigma(ao50.best.sigma)} />
          </StatGroup>

          <StatGroup title="Average of 100">
            <StatReadoutRow label="Current" value={formatStatsValue(ao100.current.value)} sigma={formatSigma(ao100.current.sigma)} />
            <StatReadoutRow label="Best" value={formatStatsValue(ao100.best.value)} sigma={formatSigma(ao100.best.sigma)} />
          </StatGroup>
        </div>
      </div>
    </section>
  );
}

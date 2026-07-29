"use client";

import { Box as BoxIcon, ChartColumnBig, Star, Timer } from "lucide-react";
import type { TimerSessionStats } from "@/components/TimerPage/stats";
import type { SolveEntry } from "@/components/TimerPage/definitions";
import {
  PanelEyebrow,
  StatExtremeHighlight,
  StatGroup,
  StatReadoutRow,
} from "@/components/TimerPage/render";
import { TimerStatsChart } from "@/components/TimerPage/TimerStatsChart";
import { formatSigma, formatStatsValue } from "@/components/TimerPage/utils";
import { cn } from "@/lib/utils";
import styles from "./TimerPage.module.scss";

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

  const windowGroups = [
    { title: "Mean of 3", pair: mo3 },
    { title: "Average of 5", pair: ao5 },
    { title: "Average of 12", pair: ao12 },
    { title: "Average of 50", pair: ao50 },
    { title: "Average of 100", pair: ao100 },
  ];

  return (
    <section>
      <PanelEyebrow icon={ChartColumnBig} title="Statistics" className="mb-3" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className={cn(styles.panel, styles.panelSheen, "flex min-w-0 flex-col p-4")}>
          <TimerStatsChart solveEntries={solveEntries} />
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div className={styles.statCard}>
            <PanelEyebrow icon={Star} title="Best / worst" />
            <div className="mt-2 flex flex-wrap gap-3">
              <StatExtremeHighlight label="Best" value={bestLabel} tone="best" />
              <StatExtremeHighlight label="Worst" value={worstLabel} tone="worst" />
            </div>
          </div>

          <StatGroup icon={Timer} title="Session">
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

          {windowGroups.map(({ title, pair }) => (
            <StatGroup key={title} icon={BoxIcon} title={title}>
              <StatReadoutRow
                label="Current"
                value={formatStatsValue(pair.current.value)}
                sigma={formatSigma(pair.current.sigma)}
              />
              <StatReadoutRow
                label="Best"
                value={formatStatsValue(pair.best.value)}
                sigma={formatSigma(pair.best.sigma)}
                highlight
              />
            </StatGroup>
          ))}
        </div>
      </div>
    </section>
  );
}

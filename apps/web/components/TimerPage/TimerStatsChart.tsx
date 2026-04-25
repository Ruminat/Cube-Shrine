"use client";

import { useEffect, useMemo, useRef } from "react";
import uPlot from "uplot";
import type { SolveEntry } from "@/components/TimerPage/definitions";
import { effectiveSeconds } from "@/components/TimerPage/utils";

type TimerStatsChartProps = {
  solveEntries: SolveEntry[];
};

type ChartBuildResult = {
  data: uPlot.AlignedData;
  xLabel: string;
  yLabel: string;
  legend: string;
};

type HistogramBin = {
  start: number;
  end: number;
  count: number;
};

function buildGraphData(solveEntries: SolveEntry[]): ChartBuildResult | null {
  if (!solveEntries.length) return null;
  const xs: number[] = [];
  const ys: (number | null)[] = [];
  solveEntries.forEach((entry, index) => {
    xs.push(index + 1);
    const effective = effectiveSeconds(entry);
    ys.push(Number.isFinite(effective) ? effective : null);
  });
  return {
    data: [xs, ys],
    xLabel: "Solve #",
    yLabel: "Seconds",
    legend: "Solve Times",
  };
}

function buildHistogramBins(solveEntries: SolveEntry[]): HistogramBin[] {
  const finite = solveEntries
    .map(effectiveSeconds)
    .filter((value): value is number => Number.isFinite(value))
    .sort((a, b) => a - b);
  if (!finite.length) return [];

  const min = finite[0];
  const max = finite[finite.length - 1];
  if (min === undefined || max === undefined) return [];

  const binsCount = Math.min(16, Math.max(6, Math.round(Math.sqrt(finite.length))));
  const range = Math.max(0.01, max - min);
  const binWidth = range / binsCount;
  const bins = Array.from({ length: binsCount }, (_, index) => ({
    start: min + index * binWidth,
    end: min + (index + 1) * binWidth,
    count: 0,
  }));

  for (const value of finite) {
    const rawIndex = Math.floor((value - min) / binWidth);
    const clampedIndex = Math.min(binsCount - 1, Math.max(0, rawIndex));
    const current = bins[clampedIndex];
    if (current) current.count += 1;
  }

  return bins;
}

export function TimerStatsChart({ solveEntries }: TimerStatsChartProps) {
  const graphHostRef = useRef<HTMLDivElement | null>(null);
  const graphPlotRef = useRef<uPlot | null>(null);
  const graph = useMemo(() => buildGraphData(solveEntries), [solveEntries]);
  const histogramBins = useMemo(() => buildHistogramBins(solveEntries), [solveEntries]);

  useEffect(() => {
    const host = graphHostRef.current;
    if (!host || graph === null) {
      graphPlotRef.current?.destroy();
      graphPlotRef.current = null;
      return;
    }

    const render = () => {
      const width = Math.max(220, host.clientWidth);
      const height = 280;

      const options: uPlot.Options = {
        width,
        height,
        legend: { show: false },
        scales: {
          x: { time: false },
          y: { auto: true },
        },
        axes: [
          { label: graph.xLabel, stroke: "#64748b", grid: { stroke: "rgba(100,116,139,0.2)" } },
          { label: graph.yLabel, stroke: "#64748b", grid: { stroke: "rgba(100,116,139,0.2)" } },
        ],
        series: [
          {},
          {
            label: graph.legend,
            stroke: "#7c3aed",
            width: 2,
            points: { show: false },
          },
        ],
      };

      graphPlotRef.current?.destroy();
      graphPlotRef.current = new uPlot(options, graph.data, host);
    };

    render();

    const resizeObserver = new ResizeObserver(() => render());
    resizeObserver.observe(host);
    return () => {
      resizeObserver.disconnect();
      graphPlotRef.current?.destroy();
      graphPlotRef.current = null;
    };
  }, [graph]);

  const hasGraphData = graph !== null;
  const hasHistogramData = histogramBins.length > 0;
  const maxCount = histogramBins.reduce((acc, bin) => Math.max(acc, bin.count), 0);
  const yTicks = maxCount > 0 ? [maxCount, Math.round(maxCount * 0.66), Math.round(maxCount * 0.33), 0] : [0];

  return (
    <div className="min-h-[220px] min-w-0 space-y-4 overflow-hidden rounded-lg border border-border/70 bg-muted/15 p-4">
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Graph</p>
        {hasGraphData ? (
          <div ref={graphHostRef} className="min-w-0 overflow-hidden" />
        ) : (
          <div className="flex min-h-[230px] items-center justify-center rounded-md border border-dashed border-border/70">
            <p className="text-sm text-muted-foreground">Add solves to render statistics</p>
          </div>
        )}
      </div>

      {hasHistogramData ? (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Histogram</p>
          <div className="rounded-md border border-border/70 bg-background/80 p-3">
            <div className="grid min-h-[180px] grid-cols-[auto_1fr] gap-2">
              <div className="flex flex-col justify-between pb-4 text-xs text-muted-foreground">
                {yTicks.map((tick, index) => (
                  <span key={`${tick}-${index}`} className="tabular-nums">
                    {tick}
                  </span>
                ))}
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex flex-col justify-between pb-4">
                  {yTicks.map((_, index) => (
                    <div key={index} className="border-t border-border/50" />
                  ))}
                </div>
                <div className="relative z-10 grid h-[160px] grid-cols-[repeat(var(--hist-bins),minmax(0,1fr))] items-end gap-0.5 pb-4" style={{ ["--hist-bins" as string]: `${histogramBins.length}` }}>
                  {histogramBins.map((bin, index) => {
                    const barHeightPx = maxCount > 0 ? Math.round((bin.count / maxCount) * 130) : 0;
                    const showLabel = index % Math.max(1, Math.floor(histogramBins.length / 5)) === 0;
                    return (
                      <div key={`${bin.start}-${bin.end}`} className="flex min-w-0 flex-col items-center">
                        <div
                          className="w-full rounded-t-sm border border-violet-700/90 bg-violet-500/70"
                          style={{ height: `${bin.count === 0 ? 0 : Math.max(3, barHeightPx)}px` }}
                          title={`${bin.start.toFixed(2)}s - ${bin.end.toFixed(2)}s: ${bin.count}`}
                        />
                        <span className="mt-1 text-[10px] tabular-nums text-muted-foreground">
                          {showLabel ? `${bin.start.toFixed(0)}s` : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-border/70 p-3 text-sm text-muted-foreground">
          Histogram appears after at least one non-DNF solve.
        </div>
      )}
    </div>
  );
}

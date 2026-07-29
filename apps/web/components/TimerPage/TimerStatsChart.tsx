"use client";

import { useEffect, useMemo, useRef } from "react";
import uPlot from "uplot";
import { ChartColumnBig, TrendingUp } from "lucide-react";
import type { SolveEntry } from "@/components/TimerPage/definitions";
import { PanelEyebrow } from "@/components/TimerPage/render";
import { effectiveSeconds } from "@/components/TimerPage/utils";
import styles from "./TimerPage.module.scss";

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

/**
 * Y-axis ticks on a 1/2/5 x 10^n step so the histogram gridlines land on round counts
 * (0/10/20/30) instead of fractions of the tallest bin. Returns descending values; the
 * first entry doubles as the axis maximum the bars are scaled against.
 */
function buildCountTicks(maxCount: number): number[] {
  if (maxCount <= 0) return [0];
  const rawStep = maxCount / 3;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 2, 5, 10].map((m) => m * magnitude).find((candidate) => candidate >= rawStep) ?? magnitude * 10;
  const top = Math.ceil(maxCount / step) * step;
  const ticks: number[] = [];
  for (let value = top; value >= 0; value -= step) ticks.push(value);
  return ticks;
}

/** Reads a themed token off the chart host so uPlot (canvas) matches the CSS palette. */
function readToken(host: HTMLElement, name: string, fallback: string): string {
  const value = getComputedStyle(host).getPropertyValue(name).trim();
  return value === "" ? fallback : value;
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
      const axisStroke = readToken(host, "--tm-chart-axis", "#94a3b8");
      const gridStroke = readToken(host, "--tm-chart-grid", "rgba(148,163,184,0.16)");
      const lineStroke = readToken(host, "--tm-chart-line", "#a78bfa");
      const grid = { stroke: gridStroke, width: 1, dash: [4, 4] };

      const options: uPlot.Options = {
        width: Math.max(220, host.clientWidth),
        // Host height comes from flex, not from uPlot's own DOM, so reading it back here
        // cannot feed the ResizeObserver below into a loop.
        height: Math.max(200, host.clientHeight),
        legend: { show: false },
        cursor: { y: false },
        scales: {
          x: { time: false },
          y: { auto: true },
        },
        axes: [
          { label: graph.xLabel, stroke: axisStroke, ticks: { stroke: gridStroke }, grid },
          // Wider tick spacing keeps the seconds axis on round steps rather than halves.
          { label: graph.yLabel, stroke: axisStroke, ticks: { stroke: gridStroke }, grid, space: 96 },
        ],
        series: [
          {},
          {
            label: graph.legend,
            stroke: lineStroke,
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

    // Canvas colours are baked in at draw time — repaint when the theme class flips.
    const themeObserver = new MutationObserver(() => render());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      graphPlotRef.current?.destroy();
      graphPlotRef.current = null;
    };
  }, [graph]);

  const hasGraphData = graph !== null;
  const hasHistogramData = histogramBins.length > 0;
  const maxCount = histogramBins.reduce((acc, bin) => Math.max(acc, bin.count), 0);
  const yTicks = buildCountTicks(maxCount);
  const countAxisMax = yTicks[0] ?? 0;
  const labelEvery = histogramBins.length > 10 ? 2 : 1;

  return (
    <div className="flex h-full min-w-0 flex-col gap-5">
      <div className={`${styles.chartBlock} flex-1`}>
        <PanelEyebrow icon={TrendingUp} title="Solve time over solves" />
        {hasGraphData ? (
          <div ref={graphHostRef} className={`${styles.chartCanvas} mt-3`} />
        ) : (
          <div className={`${styles.chartEmpty} mt-3`}>Add solves to render statistics</div>
        )}
      </div>

      <div className={styles.dividerPlain} />

      <div className={`${styles.chartBlock} flex-1`}>
        <PanelEyebrow icon={ChartColumnBig} title="Solve time distribution" />
        {hasHistogramData ? (
          <div className={`${styles.histogram} mt-3`}>
            <div className={styles.histogramTicks}>
              {yTicks.map((tick, index) => (
                <span key={`${tick}-${index}`}>{tick}</span>
              ))}
            </div>
            <div className={styles.histogramPlot}>
              <div className={styles.histogramGrid}>
                {yTicks.map((_, index) => (
                  <div key={index} className={styles.histogramGridLine} />
                ))}
              </div>
              <div className={styles.histogramBars}>
                {histogramBins.map((bin, index) => (
                  <div key={`${bin.start}-${bin.end}`} className={styles.histogramColumn}>
                    <div
                      className={styles.histogramBar}
                      style={{ height: countAxisMax > 0 ? `${(bin.count / countAxisMax) * 100}%` : "0%" }}
                      title={`${bin.start.toFixed(2)}s - ${bin.end.toFixed(2)}s: ${bin.count}`}
                    />
                    <span className={styles.histogramLabel}>
                      {index % labelEvery === 0 ? `${bin.start.toFixed(0)}s` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={`${styles.chartEmpty} mt-3`}>
            Histogram appears after at least one non-DNF solve.
          </div>
        )}
      </div>
    </div>
  );
}

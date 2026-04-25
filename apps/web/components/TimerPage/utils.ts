import type { SolveEntry } from "@/components/TimerPage/definitions";

export function roundSolveSeconds(rawSeconds: number): number {
  const rounded = Math.round(rawSeconds * 100) / 100;
  return Number.isInteger(rounded) ? Math.trunc(rounded) : rounded;
}

export function isDnf(entry: SolveEntry): boolean {
  return entry.penalty === "DNF";
}

export function isPlusTwo(entry: SolveEntry): boolean {
  return entry.penalty === "+2";
}

export function withPenalty(entry: SolveEntry, penalty?: "+2" | "DNF"): SolveEntry {
  if (penalty === undefined) {
    return { time: entry.time, scramble: entry.scramble };
  }
  return { ...entry, penalty };
}

export function effectiveSeconds(entry: SolveEntry): number {
  if (entry.penalty === "DNF") return Number.POSITIVE_INFINITY;
  return entry.time + (entry.penalty === "+2" ? 2 : 0);
}

export function formatNumber(value: number): string {
  return value.toFixed(2);
}

export function formatStatsValue(value: number): string {
  if (!Number.isFinite(value)) return "DNF";
  return formatNumber(value);
}

export function formatSigma(value: number): string {
  if (!Number.isFinite(value)) return "∞";
  return formatNumber(value);
}

export function formatSolveEntry(entry: SolveEntry): string {
  if (isDnf(entry)) return "DNF";
  const display = formatNumber(effectiveSeconds(entry));
  return isPlusTwo(entry) ? `${display} +2` : display;
}

export function formatSolveTime(ms: number): string {
  const s = ms / 1000;
  if (s <= 0) return "00:00";
  if (s < 60) return s.toFixed(2);
  const m = Math.floor(s / 60);
  const rest = (s % 60).toFixed(2).padStart(5, "0");
  return `${m}:${rest}`;
}

/** `MM:SS.cc` from stored solve seconds (raw time, before +2). */
export function formatSolveDurationMmSsCc(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00.00";
  const hundredths = Math.round(seconds * 100);
  const totalSeconds = Math.floor(hundredths / 100);
  const centis = hundredths % 100;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(centis).padStart(2, "0")}`;
}

/** One line per solve: `MM:SS.cc [+2|DNF] scramble`. */
export function formatSolveLineForExport(entry: SolveEntry): string {
  const timePart = formatSolveDurationMmSsCc(entry.time);
  const withPenalty =
    entry.penalty === "+2" ? `${timePart} [+2]` : entry.penalty === "DNF" ? `${timePart} [DNF]` : timePart;
  return `${withPenalty} ${entry.scramble}`;
}

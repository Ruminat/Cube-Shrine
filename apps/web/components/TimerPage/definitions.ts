export type TimerPhase = "idle" | "holdReady" | "running";

export type SolveEntry = {
  /** Exact measured solve duration in seconds before penalties. */
  time: number;
  scramble: string;
  penalty?: "+2" | "DNF";
};

export const TIMER_CUBE_SIZE = 260;
export const PRE_SCRAMBLE_NOTATION = "x2";
export const MAX_STORED_SOLVES = 2000;

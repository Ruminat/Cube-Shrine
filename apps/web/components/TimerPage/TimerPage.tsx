"use client";

import { useCallback } from "react";
import { TimerHoldOverlay } from "@/components/TimerPage/TimerHoldOverlay";
import { TimerIdleChrome } from "@/components/TimerPage/TimerIdleChrome";
import { TimerLatestSolveBanner } from "@/components/TimerPage/TimerLatestSolveBanner";
import { TimerRunningOverlay } from "@/components/TimerPage/TimerRunningOverlay";
import { TimerScrambleCard } from "@/components/TimerPage/TimerScrambleCard";
import { TimerSessionAside } from "@/components/TimerPage/TimerSessionAside";
import { TimerSolveDetailsDialog } from "@/components/TimerPage/TimerSolveDetailsDialog";
import { TimerStatisticsSection } from "@/components/TimerPage/TimerStatisticsSection";
import { useTimerPageController } from "@/components/TimerPage/useTimerPageController";

export function TimerPage() {
  const {
    solveEntries,
    scramble,
    phase,
    elapsedMs,
    hydrated,
    selectedSolveIndex,
    setSelectedSolveIndex,
    blockStartClickUntilRef,
    beginRun,
    skipScramble,
    removeSolve,
    clearSession,
    sessionStats,
    latestIsDnf,
    latestIsPlusTwo,
    latestDisplay,
    selectedSolveEntry,
    setSelectedPenalty,
    selectedRank,
    preparationRotations,
  } = useTimerPageController();

  const showChrome = phase === "idle";

  const onDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open) setSelectedSolveIndex(null);
    },
    [setSelectedSolveIndex]
  );

  const onTogglePlusTwo = useCallback(() => {
    if (selectedSolveIndex === null || selectedSolveEntry === null) return;
    if (selectedSolveEntry.penalty === "DNF") return;
    setSelectedPenalty(selectedSolveIndex, selectedSolveEntry.penalty === "+2" ? undefined : "+2");
  }, [selectedSolveEntry, selectedSolveIndex, setSelectedPenalty]);

  const onToggleDnf = useCallback(() => {
    if (selectedSolveIndex === null || selectedSolveEntry === null) return;
    setSelectedPenalty(selectedSolveIndex, selectedSolveEntry.penalty === "DNF" ? undefined : "DNF");
  }, [selectedSolveEntry, selectedSolveIndex, setSelectedPenalty]);

  const onDeleteSolve = useCallback(() => {
    if (selectedSolveIndex === null) return;
    removeSolve(selectedSolveIndex);
  }, [removeSolve, selectedSolveIndex]);

  return (
    <div className="min-h-screen bg-background">
      {showChrome ? (
        <TimerIdleChrome>
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <section>
                <TimerLatestSolveBanner
                  latestDisplay={latestDisplay}
                  latestIsDnf={latestIsDnf}
                  latestIsPlusTwo={latestIsPlusTwo}
                />
                <TimerScrambleCard
                  scramble={scramble}
                  preparationRotations={preparationRotations}
                  hydrated={hydrated}
                  blockStartClickUntilRef={blockStartClickUntilRef}
                  onStartTap={beginRun}
                  onSkipScramble={skipScramble}
                />
              </section>
              <TimerSessionAside
                solveEntries={solveEntries}
                stats={sessionStats}
                onClearSession={clearSession}
                onSelectSolve={setSelectedSolveIndex}
              />
            </div>
            <TimerStatisticsSection
              solveEntries={solveEntries}
              solveEntriesLength={solveEntries.length}
              completedCount={sessionStats.completed.length}
              stats={sessionStats}
            />
          </div>
        </TimerIdleChrome>
      ) : null}

      <TimerSolveDetailsDialog
        open={selectedSolveIndex !== null}
        onOpenChange={onDialogOpenChange}
        selectedSolveIndex={selectedSolveIndex}
        selectedSolveEntry={selectedSolveEntry}
        selectedRank={selectedRank}
        onTogglePlusTwo={onTogglePlusTwo}
        onToggleDnf={onToggleDnf}
        onDelete={onDeleteSolve}
      />

      {phase === "holdReady" ? <TimerHoldOverlay /> : null}
      {phase === "running" ? <TimerRunningOverlay elapsedMs={elapsedMs} /> : null}
    </div>
  );
}

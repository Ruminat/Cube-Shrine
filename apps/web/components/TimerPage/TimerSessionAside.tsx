"use client";

import { useCallback, useState } from "react";
import { ChartColumnBig, Download, Trash2 } from "lucide-react";
import { AlertDialog, Button, DropdownMenu, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import type { SolveEntry } from "@/components/TimerPage/definitions";
import type { TimerSessionStats } from "@/components/TimerPage/stats";
import { PanelEyebrow } from "@/components/TimerPage/render";
import {
  TimerSessionExportDialog,
  type TimerSessionExportMode,
} from "@/components/TimerPage/TimerSessionExportDialog";
import { effectiveSeconds, formatSolveEntry } from "@/components/TimerPage/utils";
import { cn } from "@/lib/utils";
import styles from "./TimerPage.module.scss";

export type TimerSessionAsideProps = {
  solveEntries: SolveEntry[];
  stats: TimerSessionStats;
  /** False until the IndexedDB read settles; gates `disabled` so hydration matches the HTML. */
  hydrated: boolean;
  onClearSession: () => void;
  onSelectSolve: (index: number) => void;
};

export function TimerSessionAside({
  solveEntries,
  stats,
  hydrated,
  onClearSession,
  onSelectSolve,
}: TimerSessionAsideProps) {
  const { bestEffective, worstEffective, worstHasDnf, canColorExtremes } = stats;
  const hasSolves = solveEntries.length > 0;
  const exportDisabled = hydrated ? !hasSolves : undefined;
  const displayedSolves = solveEntries
    .map((entry, index) => ({ entry, index }))
    .slice()
    .reverse();

  const [exportOpen, setExportOpen] = useState(false);
  const [exportMode, setExportMode] = useState<TimerSessionExportMode | null>(null);

  const openExport = useCallback((mode: TimerSessionExportMode) => {
    setExportMode(mode);
    setExportOpen(true);
  }, []);

  const onExportOpenChange = useCallback((open: boolean) => {
    setExportOpen(open);
    if (!open) setExportMode(null);
  }, []);

  return (
    <>
      <aside
        className={cn(
          styles.panel,
          styles.panelSheen,
          styles.asideFill,
          "flex flex-col p-4"
        )}
      >
        <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
          <PanelEyebrow icon={ChartColumnBig} title="Session" />
          <Flex align="center" gap="2">
            <DropdownMenu.Root>
              <Tooltip content={hasSolves ? "Save session data as..." : "No solves to export yet"}>
                <DropdownMenu.Trigger disabled={exportDisabled}>
                  <IconButton
                    type="button"
                    size="2"
                    variant="outline"
                    color="gray"
                    aria-label="Save session data as…"
                    disabled={exportDisabled}
                  >
                    <Download className="size-4" />
                  </IconButton>
                </DropdownMenu.Trigger>
              </Tooltip>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item onSelect={() => openExport("text")}>Text</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => openExport("json")}>JSON</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <Button type="button" color="red" variant="outline" size="2">
                  <Trash2 className="size-4" />
                  Clear the session
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content maxWidth="420px">
                <AlertDialog.Title>Clear session solves?</AlertDialog.Title>
                <AlertDialog.Description size="2">
                  This removes all stored solves for this browser.
                </AlertDialog.Description>
                <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                    <Button variant="soft" color="gray">
                      Cancel
                    </Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                    <Button autoFocus color="red" onClick={onClearSession}>
                      Clear
                    </Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </Flex>
        </div>

        {hasSolves ? (
          <div className={cn(styles.solveScroller, "min-h-0 flex-1")}>
            <div className="grid grid-cols-4 gap-2">
              {displayedSolves.map(({ entry, index }) => {
                const value = effectiveSeconds(entry);
                const isBest =
                  canColorExtremes &&
                  Number.isFinite(value) &&
                  bestEffective !== null &&
                  value === bestEffective;
                const isWorst =
                  canColorExtremes &&
                  ((worstHasDnf && !Number.isFinite(value)) ||
                    (Number.isFinite(value) && worstEffective !== null && value === worstEffective));
                const label = formatSolveEntry(entry);
                return (
                  <Tooltip
                    key={`${index}-${entry.scramble}-${entry.time}`}
                    content={`Solve ${index + 1}: ${label}`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectSolve(index)}
                      className={cn(
                        styles.solveChip,
                        isBest && styles.solveChipBest,
                        isWorst && styles.solveChipWorst
                      )}
                    >
                      {label}
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No solves yet — press space to start your first one.
          </p>
        )}
      </aside>

      <TimerSessionExportDialog
        open={exportOpen}
        onOpenChange={onExportOpenChange}
        mode={exportMode}
        solveEntries={solveEntries}
      />
    </>
  );
}

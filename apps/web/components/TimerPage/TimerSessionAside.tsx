"use client";

import { useCallback, useState } from "react";
import { Download } from "lucide-react";
import { AlertDialog, Button, DropdownMenu, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import type { SolveEntry } from "@/components/TimerPage/definitions";
import type { TimerSessionStats } from "@/components/TimerPage/stats";
import {
  TimerSessionExportDialog,
  type TimerSessionExportMode,
} from "@/components/TimerPage/TimerSessionExportDialog";
import { effectiveSeconds, formatSolveEntry } from "@/components/TimerPage/utils";
import { cn } from "@/lib/utils";

export type TimerSessionAsideProps = {
  solveEntries: SolveEntry[];
  stats: TimerSessionStats;
  onClearSession: () => void;
  onSelectSolve: (index: number) => void;
};

export function TimerSessionAside({
  solveEntries,
  stats,
  onClearSession,
  onSelectSolve,
}: TimerSessionAsideProps) {
  const { bestEffective, worstEffective, worstHasDnf, canColorExtremes } = stats;
  const hasSolves = solveEntries.length > 0;
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
      <aside className="flex max-h-[calc(100vh-8rem)] flex-col overflow-y-auto rounded-lg border border-border bg-card p-4 shadow-sm lg:sticky lg:top-20">
        <div className="mb-3 flex shrink-0 items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-foreground">Session</h2>
          <Flex align="center" gap="2">
            <DropdownMenu.Root>
              <Tooltip content={hasSolves ? "Save session data as..." : "No solves to export yet"}>
                <DropdownMenu.Trigger disabled={!hasSolves}>
                  <IconButton
                    type="button"
                    size="2"
                    variant="outline"
                    color="gray"
                    aria-label="Save session data as…"
                    disabled={!hasSolves}
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

        <div className="grid shrink-0 grid-cols-4 gap-2 rounded border border-border/60 p-2">
          {displayedSolves.map(({ entry, index }) => {
            const value = effectiveSeconds(entry);
            const isBest =
              canColorExtremes && Number.isFinite(value) && bestEffective !== null && value === bestEffective;
            const isWorst =
              canColorExtremes &&
              ((worstHasDnf && !Number.isFinite(value)) ||
                (Number.isFinite(value) && worstEffective !== null && value === worstEffective));
            const label = formatSolveEntry(entry);
            return (
              <Tooltip key={`${index}-${entry.scramble}-${entry.time}`} content={`Solve ${index + 1}: ${label}`}>
                <button
                  type="button"
                  onClick={() => onSelectSolve(index)}
                  className={cn(
                    "rounded border border-border/60 bg-background px-2 py-1 text-sm font-medium transition-colors hover:bg-muted",
                    isBest && "text-green-600 dark:text-green-400",
                    isWorst && "text-red-600 dark:text-red-400",
                  )}
                >
                  {label}
                </button>
              </Tooltip>
            );
          })}
        </div>
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

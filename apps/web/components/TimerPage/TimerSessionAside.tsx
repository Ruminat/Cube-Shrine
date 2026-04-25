"use client";

import { AlertDialog, Button, Flex, ScrollArea, Tooltip } from "@radix-ui/themes";
import type { SolveEntry } from "@/components/TimerPage/definitions";
import type { TimerSessionStats } from "@/components/TimerPage/stats";
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

  return (
    <aside className="flex flex-col overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm lg:sticky lg:top-20">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Session</h2>
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <Button type="button" color="red" variant="soft" size="2">
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
      </div>

      <div className="h-[300px] max-h-[300px] shrink-0 overflow-hidden rounded border border-border/60 p-2">
        <ScrollArea type="always" scrollbars="vertical" style={{ height: "100%" }}>
          <div className="grid grid-cols-4 gap-2 pr-2">
            {solveEntries.map((entry, index) => {
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
                      isWorst && "text-red-600 dark:text-red-400"
                    )}
                  >
                    {label}
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}

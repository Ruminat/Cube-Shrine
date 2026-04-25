"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { parseNotation } from "@shreklabs/cube-shrine/core";
import { MiniCube } from "@shreklabs/cube-shrine/react";
import { AlertDialog, Button, Dialog, Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";
import { PRE_SCRAMBLE_NOTATION } from "@/components/TimerPage/definitions";
import type { SolveEntry } from "@/components/TimerPage/definitions";
import { formatSolveEntry } from "@/components/TimerPage/utils";
import { cn } from "@/lib/utils";

export type TimerSolveDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSolveIndex: number | null;
  selectedSolveEntry: SolveEntry | null;
  selectedRank: number | null;
  onTogglePlusTwo: () => void;
  onToggleDnf: () => void;
  onDelete: () => void;
};

export function TimerSolveDetailsDialog({
  open,
  onOpenChange,
  selectedSolveIndex,
  selectedSolveEntry,
  selectedRank,
  onTogglePlusTwo,
  onToggleDnf,
  onDelete,
}: TimerSolveDetailsDialogProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyScramble = useCallback(async () => {
    if (!selectedSolveEntry || !navigator?.clipboard?.writeText) return;
    await navigator.clipboard.writeText(selectedSolveEntry.scramble);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1200);
  }, [selectedSolveEntry]);

  const scrambleRotations = useMemo(() => {
    if (!selectedSolveEntry) return [];
    return [...parseNotation(PRE_SCRAMBLE_NOTATION), ...parseNotation(selectedSolveEntry.scramble)];
  }, [selectedSolveEntry]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="520px">
        <Flex align="start" justify="between" gap="3">
          <Dialog.Title>Solve Details</Dialog.Title>
          {selectedSolveEntry ? (
            <Flex gap="2">
              <Button type="button" size="1" variant={selectedSolveEntry.penalty === "+2" ? "solid" : "soft"} onClick={onTogglePlusTwo}>
                +2
              </Button>
              <Button type="button" size="1" variant={selectedSolveEntry.penalty === "DNF" ? "solid" : "soft"} onClick={onToggleDnf}>
                DNF
              </Button>
            </Flex>
          ) : null}
        </Flex>
        {selectedSolveEntry !== null ? (
          <Flex direction="column" gap="4">
            <Text>Result: {formatSolveEntry(selectedSolveEntry)}</Text>
            <Text>Solve number: {selectedSolveIndex !== null ? selectedSolveIndex + 1 : "-"}</Text>
            <Text>Rank in finite solves: {selectedRank ?? "-"}</Text>

            <Flex direction="column" gap="2">
              <Flex align="center" justify="between" gap="2">
                <Text className="break-words text-muted-foreground">Scramble</Text>
                <Tooltip content={isCopied ? "Copied!" : "Copy scramble"}>
                  <IconButton type="button" size="1" variant="ghost" onClick={handleCopyScramble}>
                    <Copy className={cn("size-4", isCopied && "text-green-600 dark:text-green-500")} />
                  </IconButton>
                </Tooltip>
              </Flex>
              <Text className="break-words">{selectedSolveEntry.scramble}</Text>
            </Flex>

            <Flex justify="center" className="rounded-md border border-border/60 bg-muted/10 p-3">
              <MiniCube size={170} preparationRotations={scrambleRotations} />
            </Flex>

            <Flex justify="between" align="center" mt="2">
              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <Button type="button" color="red" variant="soft">
                    Delete
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content maxWidth="420px">
                  <AlertDialog.Title>Delete solve?</AlertDialog.Title>
                  <AlertDialog.Description size="2">
                    This action removes this solve from your session history.
                  </AlertDialog.Description>
                  <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                      <Button color="red" onClick={onDelete}>
                        Delete
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>

              <Dialog.Close>
                <Button type="button">Ok</Button>
              </Dialog.Close>
            </Flex>
          </Flex>
        ) : null}
      </Dialog.Content>
    </Dialog.Root>
  );
}

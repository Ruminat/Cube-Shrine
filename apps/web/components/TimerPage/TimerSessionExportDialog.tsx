"use client";

import { useCallback, useMemo, useRef } from "react";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import type { SolveEntry } from "@/components/TimerPage/definitions";
import { formatSolveLineForExport } from "@/components/TimerPage/utils";

export type TimerSessionExportMode = "text" | "json";

export type TimerSessionExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: TimerSessionExportMode | null;
  solveEntries: SolveEntry[];
};

export function TimerSessionExportDialog({
  open,
  onOpenChange,
  mode,
  solveEntries,
}: TimerSessionExportDialogProps) {
  const copyCloseRef = useRef<HTMLButtonElement>(null);

  const body = useMemo(() => {
    if (mode === "text") {
      return solveEntries.map(formatSolveLineForExport).join("\n");
    }
    if (mode === "json") {
      return JSON.stringify(solveEntries, null, 2);
    }
    return "";
  }, [mode, solveEntries]);

  const title = mode === "text" ? "Export session (text)" : mode === "json" ? "Export session (JSON)" : "Export session";

  const handleCopyAndClose = useCallback(async () => {
    if (!navigator?.clipboard?.writeText) return;
    await navigator.clipboard.writeText(body);
    onOpenChange(false);
  }, [body, onOpenChange]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        size="4"
        maxWidth="min(920px, calc(100vw - 2rem))"
        style={{ maxHeight: "min(90vh, 900px)" }}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          copyCloseRef.current?.focus();
        }}
      >
        <Dialog.Title>{title}</Dialog.Title>
        <Text size="2" color="gray" mb="3">
          {mode === "json"
            ? "Same structure as stored in IndexedDB for this browser (normalized array)."
            : "One line per solve: MM:SS.cc, optional [+2] or [DNF], then the scramble."}
        </Text>

        <pre
          className="mb-4 max-h-[min(60vh,560px)] overflow-auto rounded-md border border-border/60 bg-muted/20 p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
          style={{
            fontFamily:
              '"JetBrains Mono", "Fira Code", "Cascadia Code", "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
          tabIndex={0}
        >
          {body.length ? body : "(no solves)"}
        </pre>

        <Flex gap="3" justify="end">
          <Dialog.Close>
            <Button type="button" variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
          <Button ref={copyCloseRef} type="button" onClick={() => void handleCopyAndClose()}>
            Copy & Close
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

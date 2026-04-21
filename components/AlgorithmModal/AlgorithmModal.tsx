"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { Tooltip } from "@radix-ui/themes";
import { Box, Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { AlgorithmNotation } from "@/components/AlgorithmNotation/AlgorithmNotation";
import { CubeRenderer } from "@/components/CubeRenderer/CubeRenderer";
import { Button as UiButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { invertNotationSequence, parseReversedNotation } from "@/lib/notation/parser";
import type { Algorithm } from "@/types/algorithm";

const MODAL_CUBE_SIZE = 240;

const iconButtonClass = "size-8 shrink-0";

interface AlgorithmModalProps {
  algorithm: Algorithm | null;
  isReversed: boolean;
  onClose: () => void;
  onToggleReverse: () => void;
}

export function AlgorithmModal({ algorithm, isReversed, onClose, onToggleReverse }: AlgorithmModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const baseNotation = algorithm?.notation ?? "";
  const displayNotation = useMemo(
    () => (isReversed ? invertNotationSequence(baseNotation) : baseNotation),
    [baseNotation, isReversed]
  );
  const notationRotations = useMemo(() => parseReversedNotation(displayNotation), [displayNotation]);
  const handleCopyNotation = useCallback(async () => {
    if (!navigator?.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(displayNotation);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1400);
  }, [displayNotation]);

  if (!algorithm) return null;

  return (
    <Dialog.Root open onOpenChange={(isOpen) => (!isOpen ? onClose() : undefined)}>
      <Dialog.Content maxWidth="980px" style={{ maxHeight: "90vh", overflow: "auto" }}>
        <Flex direction="column" gap="4">
          <Box>
            <Dialog.Title>{algorithm.name}</Dialog.Title>
            <Dialog.Description>
              <Text as="span" size="2" color="gray">
                {algorithm.description}
              </Text>
            </Dialog.Description>
          </Box>

          <Flex align="center" justify="center" gap="2" wrap="wrap">
            <AlgorithmNotation notation={displayNotation} />
            <Flex align="center" gap="1">
              <Tooltip content={isReversed ? "Show forward algorithm" : "Show reversed algorithm"}>
                <UiButton
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(iconButtonClass, isReversed && "bg-accent")}
                  aria-label={isReversed ? "Show forward algorithm" : "Show reversed algorithm"}
                  aria-pressed={isReversed}
                  onClick={onToggleReverse}
                >
                  <RotateCcw className="size-4" />
                </UiButton>
              </Tooltip>
              <Tooltip content={isCopied ? "Copied!" : "Copy notation"}>
                <UiButton
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={iconButtonClass}
                  aria-label={`Copy ${algorithm.name} notation`}
                  onClick={handleCopyNotation}
                >
                  <Copy className={cn("size-4", isCopied && "text-green-600 dark:text-green-500")} />
                </UiButton>
              </Tooltip>
            </Flex>
          </Flex>

          <Flex justify="center" align="center">
            <CubeRenderer size={MODAL_CUBE_SIZE} preparationRotations={notationRotations} />
          </Flex>

          <Flex justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

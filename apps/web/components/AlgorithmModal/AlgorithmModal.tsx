"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { Tooltip } from "@radix-ui/themes";
import { Box, Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { AlgorithmNotation } from "@/components/AlgorithmNotation/AlgorithmNotation";
import { CubeRenderer } from "@/components/CubeRenderer/CubeRenderer";
import { OllTopView } from "@/components/OllTopView/OllTopView";
import { PllTopView } from "@/components/PllTopView/PllTopView";
import { Button as UiButton } from "@/components/ui/button";
import { useOllTopFlatViewEnabled, usePllTopFlatViewEnabled } from "@/lib/client-storage/top-flat-view";
import { cn } from "@/lib/utils";
import {
  getCanonicalOllTopPatternFromNotation,
  getPllTopViewFromNotation,
  invertNotationSequence,
  parseNotation,
  parseReversedNotation,
  pllSheetAlignYSteps
} from "@shreklabs/cube-shrine/core";
import type { Algorithm } from "@/types/algorithm";

const MODAL_CUBE_SIZE = 240;
const MODAL_TOP_FLAT_PX = 168;

const iconButtonClass = "size-8 shrink-0";

interface AlgorithmModalProps {
  algorithm: Algorithm | null;
  isReversed: boolean;
  onClose: () => void;
  onToggleReverse: () => void;
}

export function AlgorithmModal({ algorithm, isReversed, onClose, onToggleReverse }: AlgorithmModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const ollTopFlat = useOllTopFlatViewEnabled();
  const pllTopFlat = usePllTopFlatViewEnabled();
  const baseNotation = algorithm?.notation ?? "";
  const displayNotation = useMemo(
    () => (isReversed ? invertNotationSequence(baseNotation) : baseNotation),
    [baseNotation, isReversed]
  );
  const pllForwardMoves =
    algorithm?.category === "PLL" && algorithm?.pllTopFlatApplyMoves === "forward";
  const notationRotations = useMemo(
    () =>
      pllForwardMoves
        ? [...parseNotation(displayNotation), ...pllSheetAlignYSteps]
        : parseReversedNotation(displayNotation),
    [displayNotation, pllForwardMoves]
  );
  const ollTopPattern = useMemo(() => {
    if (!algorithm || algorithm.category !== "OLL" || !ollTopFlat) {
      return null;
    }
    return getCanonicalOllTopPatternFromNotation(displayNotation);
  }, [algorithm, displayNotation, ollTopFlat]);
  const pllTopModel = useMemo(() => {
    if (!algorithm || algorithm.category !== "PLL" || !pllTopFlat) {
      return null;
    }
    return getPllTopViewFromNotation(algorithm.id, displayNotation, {
      applyMoves: pllForwardMoves ? "forward" : undefined
    });
  }, [algorithm, displayNotation, pllForwardMoves, pllTopFlat]);
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

          {ollTopPattern ? (
            <Flex justify="center" align="center">
              <OllTopView pattern={ollTopPattern} label={algorithm.name} size={MODAL_TOP_FLAT_PX} />
            </Flex>
          ) : null}
          {pllTopModel ? (
            <Flex justify="center" align="center">
              <PllTopView model={pllTopModel} label={algorithm.name} size={MODAL_TOP_FLAT_PX} />
            </Flex>
          ) : null}

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

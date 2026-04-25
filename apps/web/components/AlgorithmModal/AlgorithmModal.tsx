"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { Box, Button, Dialog, Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";
import { AlgorithmNotation } from "@/components/AlgorithmNotation/AlgorithmNotation";
import { CubeRenderer } from "@/components/CubeRenderer/CubeRenderer";
import { OllTopView } from "@/components/OllTopView/OllTopView";
import { PllTopView } from "@/components/PllTopView/PllTopView";
import { useOllTopFlatViewEnabled, usePllTopFlatViewEnabled } from "@/lib/client-storage/top-flat-view";
import { cn } from "@/lib/utils";
import { invertNotationSequence, normalizeAlgorithm, parseReversedNotation } from "@shreklabs/cube-shrine/core";
import { getPllTopViewFromNotation } from "@/lib/pll-top-view-from-source";
import { getCanonicalOllTopPatternFromNotation } from "@/lib/oll-canonical-top-pattern";
import type { Algorithm } from "@/types/algorithm";

const MODAL_CUBE_SIZE = 240;
const MODAL_TOP_FLAT_PX = 168;

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
  const baseNotation = useMemo(() => {
    if (!algorithm) {
      return "";
    }
    return normalizeAlgorithm(algorithm.notation) ?? algorithm.notation;
  }, [algorithm]);
  const displayNotation = useMemo(() => {
    if (!isReversed) {
      return baseNotation;
    }
    const reversedNotation = invertNotationSequence(baseNotation);
    return normalizeAlgorithm(reversedNotation) ?? reversedNotation;
  }, [baseNotation, isReversed]);
  const ollCanon = useMemo(() => {
    if (!algorithm || algorithm.category !== "OLL") {
      return null;
    }
    return getCanonicalOllTopPatternFromNotation(displayNotation);
  }, [algorithm, displayNotation]);
  const pllTopModel = useMemo(() => {
    if (!algorithm || algorithm.category !== "PLL") {
      return null;
    }
    return getPllTopViewFromNotation(algorithm.id, displayNotation);
  }, [algorithm, displayNotation]);

  const notationRotations = useMemo(() => {
    const rev = parseReversedNotation(displayNotation);
    if (algorithm?.category === "PLL" && pllTopModel && pllTopModel.pllCanonicalYQuarterTurns > 0) {
      const yTail = Array.from({ length: pllTopModel.pllCanonicalYQuarterTurns }, () => ({
        face: "y" as const,
        angle: 90 as const,
      }));
      return [...rev, ...yTail];
    }
    return rev;
  }, [algorithm?.category, displayNotation, pllTopModel]);
  const ollTopPattern = useMemo(() => {
    if (!algorithm || algorithm.category !== "OLL" || !ollTopFlat || !ollCanon) {
      return null;
    }
    return ollCanon.pattern;
  }, [algorithm, ollTopFlat, ollCanon]);
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
      <Dialog.Content maxWidth='980px' style={{ maxHeight: "90vh", overflow: "auto" }}>
        <Flex direction='column' gap='4'>
          <Box>
            <Dialog.Title>{algorithm.name}</Dialog.Title>
            <Dialog.Description>
              <Text as='span' size='2' color='gray'>
                {algorithm.description}
              </Text>
            </Dialog.Description>
          </Box>

          <Flex align='center' justify='center' gap='4' wrap='wrap'>
            <AlgorithmNotation notation={displayNotation} />
            <Flex align='center' gap='4'>
              <Tooltip content={isReversed ? "Show forward algorithm" : "Show reversed algorithm"}>
                <IconButton
                  type='button'
                  variant='ghost'
                  size='2'
                  aria-label={isReversed ? "Show forward algorithm" : "Show reversed algorithm"}
                  aria-pressed={isReversed}
                  onClick={onToggleReverse}
                >
                  <RotateCcw className='size-4' />
                </IconButton>
              </Tooltip>
              <Tooltip content={isCopied ? "Copied!" : "Copy notation"}>
                <IconButton
                  type='button'
                  variant='ghost'
                  size='2'
                  aria-label={`Copy ${algorithm.name} notation`}
                  onClick={handleCopyNotation}
                >
                  <Copy className={cn("size-4", isCopied && "text-green-600 dark:text-green-500")} />
                </IconButton>
              </Tooltip>
            </Flex>
          </Flex>

          {ollTopPattern ? (
            <Flex justify='center' align='center'>
              <OllTopView pattern={ollTopPattern} label={algorithm.name} size={MODAL_TOP_FLAT_PX} />
            </Flex>
          ) : null}
          {pllTopModel && pllTopFlat ? (
            <Flex justify='center' align='center'>
              <PllTopView model={pllTopModel} label={algorithm.name} size={MODAL_TOP_FLAT_PX} />
            </Flex>
          ) : null}

          <Flex justify='center' align='center'>
            <CubeRenderer size={MODAL_CUBE_SIZE} preparationRotations={notationRotations} />
          </Flex>

          <Flex justify='end'>
            <Dialog.Close>
              <Button variant='soft' color='gray' autoFocus>
                Close
              </Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

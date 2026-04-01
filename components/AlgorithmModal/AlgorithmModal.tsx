"use client";

import { useCallback, useMemo, useState } from "react";
import { CheckIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";
import { Box, Button, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import { AlgorithmNotation } from "@/components/AlgorithmNotation/AlgorithmNotation";
import { CubeRenderer } from "@/components/CubeRenderer/CubeRenderer";
import { parseReversedNotation } from "@/lib/notation/parser";
import type { Algorithm } from "@/types/algorithm";

const MODAL_CUBE_SIZE = 240;

interface AlgorithmModalProps {
  algorithm: Algorithm | null;
  onClose: () => void;
}

export function AlgorithmModal({ algorithm, onClose }: AlgorithmModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const notation = algorithm?.notation ?? "";
  const notationRotations = useMemo(() => parseReversedNotation(notation), [notation]);
  const handleCopyNotation = useCallback(async () => {
    if (!navigator?.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(notation);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1400);
  }, [notation]);

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

          <Flex align="center" justify="center" gap="2">
            <AlgorithmNotation notation={algorithm.notation} />
            <IconButton
              onClick={handleCopyNotation}
              type="button"
              aria-label={`Copy ${algorithm.name} notation`}
              size="1"
              variant="soft"
              highContrast
            >
              {isCopied ? <CheckIcon /> : <ClipboardCopyIcon />}
            </IconButton>
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

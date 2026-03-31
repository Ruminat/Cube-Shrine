"use client";

import { Box, Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { CubeRenderer } from "@/components/CubeRenderer/CubeRenderer";
import { parseNotation } from "@/lib/notation/parser";
import type { Algorithm } from "@/types/algorithm";

interface AlgorithmModalProps {
  algorithm: Algorithm | null;
  onClose: () => void;
}

export function AlgorithmModal({ algorithm, onClose }: AlgorithmModalProps) {
  if (!algorithm) return null;

  const notationRotations = parseNotation(algorithm.notation);

  return (
    <Dialog.Root open onOpenChange={(isOpen) => (!isOpen ? onClose() : undefined)}>
      <Dialog.Content maxWidth="980px" style={{ maxHeight: "90vh", overflow: "auto" }}>
        <Flex direction="column" gap="4">
          <Box>
            <Dialog.Title>{algorithm.name}</Dialog.Title>
            <Dialog.Description>
              <Text as="span" size="2" color="gray">
                {algorithm.notation}
              </Text>
            </Dialog.Description>
          </Box>

          <Flex justify="center" align="center">
            <CubeRenderer size={500} preparationRotations={notationRotations} />
          </Flex>

          <Text as="p" size="2">
            {algorithm.description}
          </Text>

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

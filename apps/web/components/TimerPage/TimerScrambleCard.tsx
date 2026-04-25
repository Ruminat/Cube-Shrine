"use client";

import type { RefObject } from "react";
import type { RotationStep } from "@shreklabs/cube-shrine/core";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { AlgorithmNotation } from "@/components/AlgorithmNotation/AlgorithmNotation";
import { CubeRenderer } from "@/components/CubeRenderer/CubeRenderer";
import { TIMER_CUBE_SIZE } from "@/components/TimerPage/definitions";

export type TimerScrambleCardProps = {
  scramble: string | null;
  preparationRotations: RotationStep[];
  hydrated: boolean;
  blockStartClickUntilRef: RefObject<number>;
  onStartTap: () => void;
  onSkipScramble: () => void;
};

export function TimerScrambleCard({
  scramble,
  preparationRotations,
  hydrated,
  blockStartClickUntilRef,
  onStartTap,
  onSkipScramble,
}: TimerScrambleCardProps) {
  return (
    <Flex direction="column" align="center" gap="6" className="mx-auto max-w-3xl">
      <Box className="w-full rounded-lg border border-border bg-card p-6 shadow-sm">
        {scramble ? (
          <AlgorithmNotation
            centered
            notation={scramble}
            className="mb-4 text-xl leading-relaxed tracking-wide"
          />
        ) : null}
        <Flex justify="center" align="center" className="min-h-[280px]">
          {scramble ? (
            <CubeRenderer size={TIMER_CUBE_SIZE} preparationRotations={preparationRotations} />
          ) : (
            <Text size="2" color="gray">
              Preparing scramble...
            </Text>
          )}
        </Flex>
      </Box>
      <div className="md:hidden">
        <Flex gap="2">
          <Button
            type="button"
            size="3"
            onClick={() => {
              if (Date.now() < blockStartClickUntilRef.current) return;
              onStartTap();
            }}
            disabled={hydrated ? !scramble : undefined}
          >
            Start
          </Button>
          <Button type="button" size="3" variant="soft" onClick={onSkipScramble} disabled={hydrated ? !scramble : undefined}>
            Skip scramble
          </Button>
        </Flex>
      </div>
      <div className="hidden md:flex">
        <Button type="button" variant="soft" size="2" onClick={onSkipScramble} disabled={hydrated ? !scramble : undefined}>
          Skip scramble
        </Button>
      </div>
    </Flex>
  );
}

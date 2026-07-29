"use client";

import { useCallback, useState } from "react";
import type { RefObject } from "react";
import type { RotationStep } from "@shreklabs/cube-shrine/core";
import { Box as BoxIcon, ChevronsRight, Copy } from "lucide-react";
import { Button, Flex, Text, Tooltip } from "@radix-ui/themes";
import { AlgorithmNotation } from "@/components/AlgorithmNotation/AlgorithmNotation";
import { CubeRenderer } from "@/components/CubeRenderer/CubeRenderer";
import { TIMER_CUBE_SIZE } from "@/components/TimerPage/definitions";
import { cn } from "@/lib/utils";
import styles from "./TimerPage.module.scss";

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
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyScramble = useCallback(async () => {
    if (!scramble || !navigator?.clipboard?.writeText) return;
    await navigator.clipboard.writeText(scramble);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1200);
  }, [scramble]);

  return (
    <Flex direction="column" gap="5">
      <div className={styles.scrambleBar}>
        <span className={styles.scrambleIcon} aria-hidden>
          <BoxIcon className="size-[18px]" />
        </span>

        {scramble ? (
          <AlgorithmNotation centered notation={scramble} className={cn(styles.scrambleText)} />
        ) : (
          <Text size="2" color="gray" className={cn(styles.scrambleText)}>
            Preparing scramble...
          </Text>
        )}

        <Tooltip content={isCopied ? "Copied!" : "Copy scramble"}>
          <button
            type="button"
            onClick={handleCopyScramble}
            disabled={!scramble}
            aria-label="Copy scramble"
            className={cn(styles.scrambleCopy, isCopied && styles.scrambleCopied)}
          >
            <Copy className="size-[18px]" />
          </button>
        </Tooltip>
      </div>

      <div className={styles.cubeStage}>
        {scramble ? (
          <CubeRenderer size={TIMER_CUBE_SIZE} preparationRotations={preparationRotations} />
        ) : null}
      </div>

      <Flex justify="center" gap="3">
        <div className="md:hidden">
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
        </div>
        <Button
          type="button"
          size="3"
          variant="soft"
          onClick={onSkipScramble}
          disabled={hydrated ? !scramble : undefined}
        >
          <ChevronsRight className="size-4" />
          Skip scramble
        </Button>
      </Flex>
    </Flex>
  );
}

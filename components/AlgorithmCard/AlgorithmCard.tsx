import { memo, useCallback, useMemo, useState } from "react";
import { Card, Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";
import {
  CheckIcon,
  ClipboardCopyIcon,
  DoubleArrowLeftIcon,
  OpenInNewWindowIcon
} from "@radix-ui/react-icons";
import { MiniCube } from "@/components/MiniCube/MiniCube";
import { OllTopView } from "@/components/OllTopView/OllTopView";
import { getCanonicalOllTopPatternFromNotation } from "@/lib/oll/getOllTopPatternFromNotation";
import { invertNotationSequence, parseReversedNotation } from "@/lib/notation/parser";
import type { Algorithm } from "@/types/algorithm";
import styles from "./AlgorithmCard.module.scss";

const CARD_CUBE_SIZE = 75;

interface AlgorithmCardProps {
  algorithm: Algorithm;
  isReversed: boolean;
  onClick: (algorithm: Algorithm) => void;
  onToggleReverse: () => void;
  useOllSpecialTopView?: boolean;
}

function AlgorithmCardComponent({
  algorithm,
  isReversed,
  onClick,
  onToggleReverse,
  useOllSpecialTopView = false
}: AlgorithmCardProps) {
  const displayNotation = useMemo(
    () => (isReversed ? invertNotationSequence(algorithm.notation) : algorithm.notation),
    [algorithm.notation, isReversed]
  );
  const notationRotations = useMemo(() => parseReversedNotation(displayNotation), [displayNotation]);
  const ollTopPattern = useMemo(() => {
    if (algorithm.category !== "OLL" || !useOllSpecialTopView) {
      return null;
    }
    return getCanonicalOllTopPatternFromNotation(displayNotation);
  }, [algorithm.category, displayNotation, useOllSpecialTopView]);
  const [isCopied, setIsCopied] = useState(false);

  const handleOpenDialog = useCallback(() => onClick(algorithm), [algorithm, onClick]);
  const handleCopyNotation = useCallback(async () => {
    if (!navigator?.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(displayNotation);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1400);
  }, [displayNotation]);

  return (
    <Card className={styles.card} size="1">
      <div className={styles.cubeWrapper}>
        {ollTopPattern ? (
          <OllTopView pattern={ollTopPattern} label={algorithm.name} size={CARD_CUBE_SIZE} />
        ) : (
          <MiniCube deferUntilVisible size={CARD_CUBE_SIZE} preparationRotations={notationRotations} />
        )}
      </div>

      <Flex className={styles.content} direction="column" gap="2">
        <Flex className={styles.header} align="center" justify="between" gap="2">
          <h3 className={styles.title}>{algorithm.name}</h3>
          <Flex align="center" gap="1" className={styles.toolbar}>
            <Tooltip content={isReversed ? "Show forward algorithm" : "Show reversed algorithm"}>
              <IconButton
                className={styles.reverseButton}
                onClick={onToggleReverse}
                type="button"
                aria-label={isReversed ? "Show forward algorithm" : "Show reversed algorithm"}
                aria-pressed={isReversed}
                size="1"
                variant={isReversed ? "solid" : "soft"}
                highContrast
              >
                <DoubleArrowLeftIcon />
              </IconButton>
            </Tooltip>
            <Tooltip content={isCopied ? "Copied!" : "Copy notation"}>
              <IconButton
                className={styles.copyButton}
                onClick={handleCopyNotation}
                type="button"
                aria-label={`Copy ${algorithm.name} notation`}
                size="1"
                variant="soft"
                highContrast
              >
                {isCopied ? <CheckIcon /> : <ClipboardCopyIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip content="View details">
              <IconButton
                className={styles.openButton}
                onClick={handleOpenDialog}
                type="button"
                aria-label={`Open ${algorithm.name} details`}
                size="1"
                variant="soft"
                highContrast
              >
                <OpenInNewWindowIcon />
              </IconButton>
            </Tooltip>
          </Flex>
        </Flex>

        <Flex className={styles.notationRow} align="center" gap="2">
          <Text className={styles.notation} as="p">
            {displayNotation}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}

export const AlgorithmCard = memo(AlgorithmCardComponent);

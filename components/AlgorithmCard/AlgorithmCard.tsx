import { memo, useCallback, useMemo, useState } from "react";
import { Badge, Button, Card, Flex, IconButton, Text } from "@radix-ui/themes";
import { CheckIcon, ClipboardCopyIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { MiniCube } from "@/components/MiniCube/MiniCube";
import { parseNotation } from "@/lib/notation/parser";
import type { Algorithm } from "@/types/algorithm";
import styles from "./AlgorithmCard.module.scss";

const CARD_CUBE_SIZE = 75;

interface AlgorithmCardProps {
  algorithm: Algorithm;
  onClick: (algorithm: Algorithm) => void;
}

function AlgorithmCardComponent({ algorithm, onClick }: AlgorithmCardProps) {
  const notationRotations = useMemo(() => parseNotation(algorithm.notation), [algorithm.notation]);
  const [isCopied, setIsCopied] = useState(false);

  const handleOpenDialog = useCallback(() => onClick(algorithm), [algorithm, onClick]);
  const handleCopyNotation = useCallback(async () => {
    if (!navigator?.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(algorithm.notation);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1400);
  }, [algorithm.notation]);

  return (
    <Card className={styles.card} size="1">
      <div className={styles.cubeWrapper}>
        <MiniCube size={CARD_CUBE_SIZE} preparationRotations={notationRotations} interactive={false} />
      </div>

      <Flex className={styles.content} direction="column" gap="2">
        <Flex className={styles.header} align="center" justify="between" gap="2">
          <Flex align="center" gap="2">
            <h3 className={styles.title}>{algorithm.name}</h3>
            <Badge variant="soft">{algorithm.category}</Badge>
          </Flex>
          <Button
            className={styles.openButton}
            onClick={handleOpenDialog}
            type="button"
            aria-label={`Open ${algorithm.name} details`}
            size="1"
            variant="soft"
          >
            <OpenInNewWindowIcon />
            View
          </Button>
        </Flex>

        <Flex className={styles.notationRow} align="center" justify="between" gap="2">
          <Text className={styles.notation} as="p">
            {algorithm.notation}
          </Text>
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
        </Flex>
      </Flex>
    </Card>
  );
}

export const AlgorithmCard = memo(AlgorithmCardComponent);

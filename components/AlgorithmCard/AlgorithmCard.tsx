import { memo, useCallback, useMemo } from "react";
import { MiniCube } from "@/components/MiniCube/MiniCube";
import { AlgorithmNotation } from "@/components/AlgorithmNotation/AlgorithmNotation";
import { Badge } from "@/components/UI/Badge/Badge";
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
  const handleClick = useCallback(() => onClick(algorithm), [algorithm, onClick]);

  return (
    <article className={styles.card} onClick={handleClick}>
      <h3 className={styles.title}>{algorithm.name}</h3>
      <AlgorithmNotation notation={algorithm.notation} />
      <div className={styles.cubeWrapper}>
        <MiniCube size={CARD_CUBE_SIZE} preparationRotations={notationRotations} interactive={false} />
      </div>
      <div className={styles.category}>
        <Badge>{algorithm.category}</Badge>
      </div>
    </article>
  );
}

export const AlgorithmCard = memo(AlgorithmCardComponent);

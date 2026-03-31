import { MiniCube } from "@/components/MiniCube/MiniCube";
import { AlgorithmNotation } from "@/components/AlgorithmNotation/AlgorithmNotation";
import { Badge } from "@/components/UI/Badge/Badge";
import { parseNotation } from "@/lib/notation/parser";
import type { Algorithm } from "@/types/algorithm";
import styles from "./AlgorithmCard.module.scss";

interface AlgorithmCardProps {
  algorithm: Algorithm;
  onClick: (algorithm: Algorithm) => void;
}

export function AlgorithmCard({ algorithm, onClick }: AlgorithmCardProps) {
  const notationRotations = parseNotation(algorithm.notation);

  return (
    <article className={styles.card} onClick={() => onClick(algorithm)}>
      <h3 className={styles.title}>{algorithm.name}</h3>
      <AlgorithmNotation notation={algorithm.notation} />
      <div className={styles.cubeWrapper}>
        <MiniCube preparationRotations={notationRotations} />
      </div>
      <div className={styles.category}>
        <Badge>{algorithm.category}</Badge>
      </div>
    </article>
  );
}

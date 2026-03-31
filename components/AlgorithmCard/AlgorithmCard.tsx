import { MiniCube } from "@/components/MiniCube/MiniCube";
import { Badge } from "@/components/UI/Badge/Badge";
import type { Algorithm } from "@/types/algorithm";
import styles from "./AlgorithmCard.module.scss";

interface AlgorithmCardProps {
  algorithm: Algorithm;
  onClick: (algorithm: Algorithm) => void;
}

export function AlgorithmCard({ algorithm, onClick }: AlgorithmCardProps) {
  return (
    <article className={styles.card} onClick={() => onClick(algorithm)}>
      <h3 className={styles.title}>{algorithm.name}</h3>
      <p className={styles.notation}>{algorithm.notation}</p>
      <div className={styles.cubeWrapper}>
        <MiniCube preparationRotations={algorithm.preparationRotations} />
      </div>
      <Badge>{algorithm.category}</Badge>
    </article>
  );
}

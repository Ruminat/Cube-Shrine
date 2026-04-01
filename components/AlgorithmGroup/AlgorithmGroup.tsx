"use client";

import { Heading } from "@radix-ui/themes";
import { AlgorithmCard } from "@/components/AlgorithmCard/AlgorithmCard";
import type { Algorithm, AlgorithmCategory } from "@/types/algorithm";
import styles from "./AlgorithmGroup.module.scss";

export interface AlgorithmGroupProps {
  category: AlgorithmCategory;
  algorithms: Algorithm[];
  onOpenAlgorithm: (algorithm: Algorithm) => void;
  isAlgorithmReversed: (algorithmId: string) => boolean;
  onToggleAlgorithmReverse: (algorithmId: string) => void;
}

export function AlgorithmGroup({
  category,
  algorithms: groupAlgorithms,
  onOpenAlgorithm,
  isAlgorithmReversed,
  onToggleAlgorithmReverse
}: AlgorithmGroupProps) {
  const headingId = `alg-group-${category}`;

  return (
    <section className={styles.group} aria-labelledby={headingId}>
      <Heading as="h2" size="4" className={styles.groupTitle} id={headingId}>
        {category}
      </Heading>
      <div className={styles.grid}>
        {groupAlgorithms.map((algorithm) => (
          <AlgorithmCard
            key={algorithm.id}
            algorithm={algorithm}
            isReversed={isAlgorithmReversed(algorithm.id)}
            onClick={onOpenAlgorithm}
            onToggleReverse={() => onToggleAlgorithmReverse(algorithm.id)}
          />
        ))}
      </div>
    </section>
  );
}

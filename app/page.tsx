"use client";

import { useCallback, useState } from "react";
import { AlgorithmGroup } from "@/components/AlgorithmGroup/AlgorithmGroup";
import { AlgorithmModal } from "@/components/AlgorithmModal/AlgorithmModal";
import { TopNav } from "@/components/TopNav/TopNav";
import { Container } from "@/components/UI/Container/Container";
import { algorithms, getAlgorithmGroupsByCategory } from "@/data/algorithms";
import type { Algorithm } from "@/types/algorithm";
import styles from "./page.module.scss";

export function HomePage() {
  const [selected, setSelected] = useState<Algorithm | null>(null);
  const [reversedById, setReversedById] = useState<Record<string, boolean>>({});

  const handleCloseModal = useCallback(() => {
    setSelected(null);
  }, []);

  const isAlgorithmReversed = useCallback(
    (algorithmId: string) => Boolean(reversedById[algorithmId]),
    [reversedById]
  );

  const handleToggleAlgorithmReverse = useCallback((algorithmId: string) => {
    setReversedById((prev) => ({ ...prev, [algorithmId]: !prev[algorithmId] }));
  }, []);

  const handleToggleSelectedReverse = useCallback(() => {
    if (!selected) return;
    handleToggleAlgorithmReverse(selected.id);
  }, [handleToggleAlgorithmReverse, selected]);

  return (
    <>
      <TopNav />
      <Container>
        <div className={styles.groups}>
          {getAlgorithmGroupsByCategory(algorithms).map(({ category, algorithms: groupAlgorithms }) => (
            <AlgorithmGroup
              key={category}
              category={category}
              algorithms={groupAlgorithms}
              onOpenAlgorithm={setSelected}
              isAlgorithmReversed={isAlgorithmReversed}
              onToggleAlgorithmReverse={handleToggleAlgorithmReverse}
            />
          ))}
        </div>
      </Container>
      <AlgorithmModal
        algorithm={selected}
        isReversed={selected ? isAlgorithmReversed(selected.id) : false}
        onClose={handleCloseModal}
        onToggleReverse={handleToggleSelectedReverse}
      />
    </>
  );
}

export default HomePage;

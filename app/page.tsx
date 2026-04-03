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
  const [ollSpecialTopView, setOllSpecialTopView] = useState(true);
  const [pllSpecialTopView, setPllSpecialTopView] = useState(true);

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
          {getAlgorithmGroupsByCategory(algorithms).map((group) => (
            <AlgorithmGroup
              key={group.category}
              group={group}
              onOpenAlgorithm={setSelected}
              isAlgorithmReversed={isAlgorithmReversed}
              onToggleAlgorithmReverse={handleToggleAlgorithmReverse}
              ollSpecialTopView={group.category === "OLL" ? ollSpecialTopView : undefined}
              onOllSpecialTopViewChange={
                group.category === "OLL" ? setOllSpecialTopView : undefined
              }
              pllSpecialTopView={group.category === "PLL" ? pllSpecialTopView : undefined}
              onPllSpecialTopViewChange={
                group.category === "PLL" ? setPllSpecialTopView : undefined
              }
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

"use client";

import { useCallback, useState } from "react";
import { AlgorithmCard } from "@/components/AlgorithmCard/AlgorithmCard";
import { AlgorithmModal } from "@/components/AlgorithmModal/AlgorithmModal";
import { TopNav } from "@/components/TopNav/TopNav";
import { Container } from "@/components/UI/Container/Container";
import { algorithms } from "@/data/algorithms";
import type { Algorithm } from "@/types/algorithm";
import styles from "./page.module.scss";

export function HomePage() {
  const [selected, setSelected] = useState<Algorithm | null>(null);
  const handleCloseModal = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <>
      <TopNav />
      <Container>
        <section className={styles.grid}>
          {algorithms.map((algorithm) => (
            <AlgorithmCard key={algorithm.id} algorithm={algorithm} onClick={setSelected} />
          ))}
        </section>
      </Container>
      <AlgorithmModal algorithm={selected} onClose={handleCloseModal} />
    </>
  );
}

export default HomePage;

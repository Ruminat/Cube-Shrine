"use client";

import { useState } from "react";
import { AlgorithmCard } from "@/components/AlgorithmCard/AlgorithmCard";
import { AlgorithmModal } from "@/components/AlgorithmModal/AlgorithmModal";
import { SettingsPanel } from "@/components/SettingsPanel/SettingsPanel";
import { Container } from "@/components/UI/Container/Container";
import { algorithms } from "@/data/algorithms";
import type { Algorithm } from "@/types/algorithm";
import styles from "./page.module.scss";

export function HomePage() {
  const [selected, setSelected] = useState<Algorithm | null>(null);

  return (
    <>
      <SettingsPanel />
      <Container>
        <h1 className={styles.title}>Rubik&apos;s Cube Algorithms</h1>
        <section className={styles.grid}>
          {algorithms.map((algorithm) => (
            <AlgorithmCard key={algorithm.id} algorithm={algorithm} onClick={setSelected} />
          ))}
        </section>
      </Container>
      <AlgorithmModal algorithm={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export default HomePage;

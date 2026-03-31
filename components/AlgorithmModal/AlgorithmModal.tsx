"use client";

import { CubeRenderer } from "@/components/CubeRenderer/CubeRenderer";
import { Button } from "@/components/UI/Button/Button";
import type { Algorithm } from "@/types/algorithm";
import styles from "./AlgorithmModal.module.scss";

interface AlgorithmModalProps {
  algorithm: Algorithm | null;
  onClose: () => void;
}

export function AlgorithmModal({ algorithm, onClose }: AlgorithmModalProps) {
  if (!algorithm) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <header className={styles.header}>
          <h2>{algorithm.name}</h2>
          <Button onClick={onClose}>Close</Button>
        </header>
        <p className={styles.notation}>{algorithm.notation}</p>
        <CubeRenderer size={500} preparationRotations={algorithm.preparationRotations} />
        <p className={styles.description}>{algorithm.description}</p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CubeRenderer } from "@/components/CubeRenderer/CubeRenderer";
import { Button } from "@/components/UI/Button/Button";
import { parseNotation } from "@/lib/notation/parser";
import type { Algorithm } from "@/types/algorithm";
import styles from "./AlgorithmModal.module.scss";

interface AlgorithmModalProps {
  algorithm: Algorithm | null;
  onClose: () => void;
}

export function AlgorithmModal({ algorithm, onClose }: AlgorithmModalProps) {
  if (!algorithm) return null;
  const notationRotations = parseNotation(algorithm.notation);
  const [isCubeReady, setIsCubeReady] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    setIsCubeReady(false);

    let timeoutId: number | undefined;
    const frameId = window.requestAnimationFrame(() => {
      timeoutId = window.setTimeout(() => {
        setIsCubeReady(true);
      }, 0);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [algorithm.id]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <header className={styles.header}>
          <h2>{algorithm.name}</h2>
          <Button onClick={onClose}>Close</Button>
        </header>
        <p className={styles.notation}>{algorithm.notation}</p>
        <div className={styles.cubeSlot}>
          {isCubeReady ? (
            <CubeRenderer size={500} preparationRotations={notationRotations} />
          ) : (
            <div className={styles.cubeSkeleton} aria-hidden="true" />
          )}
        </div>
        <p className={styles.description}>{algorithm.description}</p>
      </div>
    </div>
  );
}

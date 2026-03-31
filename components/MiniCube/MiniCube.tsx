"use client";

import { useMemo } from "react";
import type { RotationStep } from "@/types/cube";
import { useCubeRenderer } from "@/hooks/useCubeRenderer";
import styles from "./MiniCube.module.scss";

interface MiniCubeProps {
  preparationRotations: RotationStep[];
  size?: number;
}

export function MiniCube({ preparationRotations, size }: MiniCubeProps) {
  const resolvedSize = useMemo(() => size ?? 150, [size]);

  const { mountRef } = useCubeRenderer({
    size: resolvedSize,
    preparationRotations
  });

  return <div className={styles.root} ref={mountRef} style={{ width: resolvedSize, height: resolvedSize }} />;
}

"use client";

import { useEffect, useState } from "react";
import type { RotationStep } from "@/types/cube";
import { useCubeRenderer } from "@/components/Cube/useCubeRenderer";
import styles from "./MiniCube.module.scss";

interface MiniCubeProps {
  preparationRotations: RotationStep[];
  size?: number;
  interactive?: boolean;
}

const FALLBACK_CUBE_SIZE = 75;

const getCubeSizeFromCSS = () => {
  const cssValue = getComputedStyle(document.documentElement).getPropertyValue("--cube-size");
  const parsedSize = Number.parseFloat(cssValue);
  return Number.isFinite(parsedSize) ? parsedSize : FALLBACK_CUBE_SIZE;
};

export function MiniCube({ preparationRotations, size, interactive = true }: MiniCubeProps) {
  const [cssCubeSize, setCssCubeSize] = useState(FALLBACK_CUBE_SIZE);

  useEffect(() => {
    if (size) return;

    const updateSize = () => setCssCubeSize(getCubeSizeFromCSS());
    updateSize();

    const observer = new MutationObserver(updateSize);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class", "data-theme"],
    });

    return () => observer.disconnect();
  }, [size]);

  const resolvedSize = size ?? cssCubeSize;

  const { mountRef } = useCubeRenderer({
    size: resolvedSize,
    preparationRotations,
    interactive,
  });

  return (
    <div
      className={styles.root}
      ref={mountRef}
      style={{ width: resolvedSize, height: resolvedSize, cursor: interactive ? "grab" : "default" }}
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import type { RotationStep } from "@/types/cube";
import { CUBE_FULL_QUALITY_MIN_SIZE_PX } from "@/components/Cube/definitions";
import { useCubeRenderer } from "@/components/Cube/useCubeRenderer";
import { useInViewport } from "@/hooks/useInViewport";
import styles from "./MiniCube.module.scss";

interface MiniCubeProps {
  preparationRotations: RotationStep[];
  size?: number;
  /** When true, the canvas mounts only while the cube slot is in (or near) the viewport. */
  deferUntilVisible?: boolean;
}

const FALLBACK_CUBE_SIZE = 100;

const getCubeSizeFromCSS = () => {
  const cssValue = getComputedStyle(document.documentElement).getPropertyValue("--cube-size");
  const parsedSize = Number.parseFloat(cssValue);
  return Number.isFinite(parsedSize) ? parsedSize : FALLBACK_CUBE_SIZE;
};

function MiniCubeScene({
  preparationRotations,
  resolvedSize
}: {
  preparationRotations: RotationStep[];
  resolvedSize: number;
}) {
  const { mountRef } = useCubeRenderer({
    size: resolvedSize,
    preparationRotations
  });

  const previewSlot = resolvedSize < CUBE_FULL_QUALITY_MIN_SIZE_PX;

  return (
    <div
      className={styles.root}
      ref={mountRef}
      style={{
        width: resolvedSize,
        height: resolvedSize,
        pointerEvents: previewSlot ? "none" : undefined
      }}
    />
  );
}

function MiniCubeDeferredViewport({
  preparationRotations,
  resolvedSize
}: {
  preparationRotations: RotationStep[];
  resolvedSize: number;
}) {
  const { ref: viewportRef, isIntersecting } = useInViewport<HTMLDivElement>();

  const slotStyle = {
    width: resolvedSize,
    height: resolvedSize,
    minWidth: resolvedSize,
    minHeight: resolvedSize
  };

  return (
    <div ref={viewportRef} className={styles.viewportSlot} style={slotStyle}>
      {isIntersecting ? (
        <MiniCubeScene preparationRotations={preparationRotations} resolvedSize={resolvedSize} />
      ) : null}
    </div>
  );
}

export function MiniCube({ preparationRotations, size, deferUntilVisible = false }: MiniCubeProps) {
  const [cssCubeSize, setCssCubeSize] = useState(FALLBACK_CUBE_SIZE);

  useEffect(() => {
    if (size) return;

    const updateSize = () => setCssCubeSize(getCubeSizeFromCSS());
    updateSize();

    const observer = new MutationObserver(updateSize);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class", "data-theme"]
    });

    return () => observer.disconnect();
  }, [size]);

  const resolvedSize = size ?? cssCubeSize;

  if (deferUntilVisible) {
    return (
      <MiniCubeDeferredViewport preparationRotations={preparationRotations} resolvedSize={resolvedSize} />
    );
  }

  return <MiniCubeScene preparationRotations={preparationRotations} resolvedSize={resolvedSize} />;
}

"use client";

import { useEffect, useState } from "react";
import type { RotationStep } from "@/types/cube";
import { useCubeRenderer } from "@/components/Cube/useCubeRenderer";
import { useInViewport } from "@/hooks/useInViewport";
import styles from "./MiniCube.module.scss";

interface MiniCubeProps {
  preparationRotations: RotationStep[];
  size?: number;
  interactive?: boolean;
  /** When true, the canvas mounts only while the cube slot is in (or near) the viewport. */
  deferUntilVisible?: boolean;
}

const FALLBACK_CUBE_SIZE = 75;

const getCubeSizeFromCSS = () => {
  const cssValue = getComputedStyle(document.documentElement).getPropertyValue("--cube-size");
  const parsedSize = Number.parseFloat(cssValue);
  return Number.isFinite(parsedSize) ? parsedSize : FALLBACK_CUBE_SIZE;
};

function MiniCubeScene({
  preparationRotations,
  resolvedSize,
  interactive
}: {
  preparationRotations: RotationStep[];
  resolvedSize: number;
  interactive: boolean;
}) {
  const { mountRef } = useCubeRenderer({
    size: resolvedSize,
    preparationRotations,
    interactive
  });

  return (
    <div
      className={styles.root}
      ref={mountRef}
      style={{
        width: resolvedSize,
        height: resolvedSize,
        cursor: interactive ? "grab" : "default",
        pointerEvents: interactive ? undefined : "none"
      }}
    />
  );
}

function MiniCubeDeferredViewport({
  preparationRotations,
  resolvedSize,
  interactive
}: {
  preparationRotations: RotationStep[];
  resolvedSize: number;
  interactive: boolean;
}) {
  const { ref: viewportRef, isIntersecting } = useInViewport<HTMLDivElement>();

  const slotStyle = {
    width: resolvedSize,
    height: resolvedSize,
    minWidth: resolvedSize,
    minHeight: resolvedSize,
    cursor: interactive ? ("grab" as const) : ("default" as const)
  };

  return (
    <div ref={viewportRef} className={styles.viewportSlot} style={slotStyle}>
      {isIntersecting ? (
        <MiniCubeScene
          preparationRotations={preparationRotations}
          resolvedSize={resolvedSize}
          interactive={interactive}
        />
      ) : null}
    </div>
  );
}

export function MiniCube({
  preparationRotations,
  size,
  interactive = true,
  deferUntilVisible = false
}: MiniCubeProps) {
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
      <MiniCubeDeferredViewport
        preparationRotations={preparationRotations}
        resolvedSize={resolvedSize}
        interactive={interactive}
      />
    );
  }

  return (
    <MiniCubeScene
      preparationRotations={preparationRotations}
      resolvedSize={resolvedSize}
      interactive={interactive}
    />
  );
}

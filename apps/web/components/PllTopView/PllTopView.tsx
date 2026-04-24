"use client";

import type { PllTopViewModel } from "@shreklabs/cube-shrine/core";
import {
  CUBE_PREVIEW_DPR_CAP,
  drawPllTopPatternOnCanvas,
  getPaletteFromCSS
} from "@shreklabs/cube-shrine/render";
import { useCubePalette } from "@shreklabs/cube-shrine/react";
import { useLayoutEffect, useRef } from "react";
import styles from "./PllTopView.module.scss";

export interface PllTopViewProps {
  model: PllTopViewModel;
  label: string;
  size: number;
}

export function PllTopView({ model, label, size }: PllTopViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { paletteVersion } = useCubePalette();

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const deviceDpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const dpr = Math.min(deviceDpr, CUBE_PREVIEW_DPR_CAP);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const palette = getPaletteFromCSS();
    drawPllTopPatternOnCanvas(context, size, model, palette);
  }, [model, paletteVersion, size]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      width={size}
      height={size}
      role="img"
      aria-label={`PLL top view for ${label}`}
    />
  );
}

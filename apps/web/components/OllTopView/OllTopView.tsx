"use client";

import type { OllTopPattern } from "@shreklabs/cube-shrine/core";
import {
  CUBE_PREVIEW_DPR_CAP,
  drawOllTopPatternOnCanvas,
  getPaletteFromCSS
} from "@shreklabs/cube-shrine/render";
import { useCubePalette } from "@shreklabs/cube-shrine/react";
import { useLayoutEffect, useRef } from "react";
import styles from "./OllTopView.module.scss";

export interface OllTopViewProps {
  pattern: OllTopPattern;
  /** Short label for assistive tech (algorithm name). */
  label: string;
  /** CSS pixel size (matches `MiniCube` thumbnail). */
  size: number;
}

export function OllTopView({ pattern, label, size }: OllTopViewProps) {
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
    drawOllTopPatternOnCanvas(context, size, pattern, palette);
  }, [pattern, paletteVersion, size]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      width={size}
      height={size}
      role="img"
      aria-label={`OLL top view for ${label}`}
    />
  );
}

import { clamp, shadeColor, tintColor } from "@/components/Cube/utils";

export type FlatPoint = { x: number; y: number };

/** Filled quad (trapezoid) with subtle gradient; optional thin outline. */
export function fillGradientQuad(
  context: CanvasRenderingContext2D,
  corners: FlatPoint[],
  hex: string,
  options?: { stroke?: boolean; lineWidth?: number; strokeStyle?: string }
) {
  const cx = corners.reduce((a, p) => a + p.x, 0) / corners.length;
  const cy = corners.reduce((a, p) => a + p.y, 0) / corners.length;
  const g = context.createLinearGradient(cx - 3, cy - 3, cx + 5, cy + 5);
  g.addColorStop(0, tintColor(hex, 0.12));
  g.addColorStop(1, shadeColor(hex, 0.1));
  context.beginPath();
  context.moveTo(corners[0].x, corners[0].y);
  for (let i = 1; i < corners.length; i += 1) {
    context.lineTo(corners[i].x, corners[i].y);
  }
  context.closePath();
  context.fillStyle = g;
  context.fill();
  if (options?.stroke && options.lineWidth && options.strokeStyle) {
    context.lineWidth = options.lineWidth;
    context.strokeStyle = options.strokeStyle;
    context.stroke();
  }
}

/**
 * Band-based layout: 3×3 face with margin bands for thin side indicators (lines / trapezoids).
 */
export function getTopFlatGridLayout(canvasCssSize: number) {
  const s = canvasCssSize;
  const margin = s * 0.05;
  const band = Math.max(2.5, s * 0.082);
  const gap = s * 0.05;
  const inner = s - 2 * margin - 2 * band;
  const cell = (inner - 2 * gap) / 3;
  const faceX = margin + band;
  const faceY = margin + band;
  const lineWidthThin = clamp(s * 0.007, 0.28, 0.52);

  const barAlong = cell * 0.72;
  const barThick = Math.max(2.2, band * 0.58);
  const barInset = (cell - barAlong) / 2;
  const trapSkew = Math.min(barThick * 0.5, barAlong * 0.07);

  const topBarY = margin + (band - barThick) / 2;
  const botBarY = s - margin - band + (band - barThick) / 2;
  const leftBarX = margin + (band - barThick) / 2;
  const rightBarX = s - margin - band + (band - barThick) / 2;

  const colBarLeft = (col: number) => faceX + col * (cell + gap) + barInset;
  const rowBarTop = (row: number) => faceY + row * (cell + gap) + barInset;

  return {
    s,
    margin,
    gap,
    cell,
    faceX,
    faceY,
    lineWidthThin,
    barAlong,
    barThick,
    barInset,
    trapSkew,
    topBarY,
    botBarY,
    leftBarX,
    rightBarX,
    colBarLeft,
    rowBarTop
  };
}

export function faceCellOrigin(
  faceX: number,
  faceY: number,
  cell: number,
  gap: number,
  row: number,
  col: number
) {
  return {
    x: faceX + col * (cell + gap),
    y: faceY + row * (cell + gap)
  };
}

import { clamp, shadeColor, tintColor } from "@/components/Cube/utils";

/** Same stroke as top-flat cubie edges (`drawFlatCell` / `drawPaletteCell`). */
export const TOP_FLAT_CUBIE_STROKE = "rgba(31, 41, 55, 0.85)";

/** Per-quad outline for strip trapezoids (same weight/color as face cubies). */
export function topFlatQuadStrokeOptions(lineWidth: number) {
  return { stroke: true as const, lineWidth, strokeStyle: TOP_FLAT_CUBIE_STROKE };
}

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
    context.lineJoin = "miter";
    context.lineCap = "butt";
    context.lineWidth = options.lineWidth;
    context.strokeStyle = options.strokeStyle;
    context.stroke();
  }
}

/**
 * Top-flat OLL/PLL layout: 3×3 face (no inter-cell gap) with outer strip “cubies”.
 * Each outer piece spans `cell` along the face edge and `cell/4` perpendicular, flush with the face.
 */
export function getTopFlatGridLayout(canvasCssSize: number) {
  const s = canvasCssSize;
  const margin = clamp(s * 0.02, 1, s * 0.08);
  const gap = 0;

  const cell = (s - 2 * margin) / 3.5;
  const barThick = cell * 0.25;
  const barAlong = cell;
  const barInset = 0;

  const faceX = margin + barThick;
  const faceY = margin + barThick;
  const lineWidthThin = clamp(s * 0.007, 0.28, 0.52);

  const trapSkew = Math.min(barThick * 0.5, barAlong * 0.07);

  const topBarY = margin;
  const botBarY = faceY + 3 * cell;
  const leftBarX = margin;
  const rightBarX = faceX + 3 * cell;

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

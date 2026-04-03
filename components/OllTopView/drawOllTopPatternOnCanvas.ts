import type { PaletteKey } from "@/components/Cube/definitions";
import { clamp, shadeColor, tintColor } from "@/components/Cube/utils";
import type { OllTopPattern } from "@/lib/oll/extractOllTopPattern";

const STROKE = "rgba(31, 41, 55, 0.85)";

function drawFlatCell(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  yellow: boolean,
  yellowHex: string,
  whiteHex: string,
  lineWidth: number
) {
  const color = yellow ? yellowHex : whiteHex;

  if (yellow) {
    const gradient = context.createLinearGradient(x, y, x + w, y + h);
    gradient.addColorStop(0, tintColor(color, 0.14));
    gradient.addColorStop(1, shadeColor(color, 0.12));
    context.fillStyle = gradient;
  } else {
    const gradient = context.createLinearGradient(x, y, x + w * 0.85, y + h * 0.85);
    gradient.addColorStop(0, tintColor(color, 0.06));
    gradient.addColorStop(1, shadeColor(color, 0.08));
    context.fillStyle = gradient;
  }

  context.beginPath();
  context.rect(x, y, w, h);
  context.fill();
  context.lineJoin = "miter";
  context.lineCap = "butt";
  context.lineWidth = lineWidth;
  context.strokeStyle = STROKE;
  context.stroke();
}

function drawFlatBar(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  yellowHex: string,
  lineWidth: number
) {
  const gradient = context.createLinearGradient(x, y, x + w, y + h);
  gradient.addColorStop(0, tintColor(yellowHex, 0.12));
  gradient.addColorStop(1, shadeColor(yellowHex, 0.1));
  context.fillStyle = gradient;
  context.beginPath();
  context.rect(x, y, w, h);
  context.fill();
  context.lineWidth = lineWidth;
  context.strokeStyle = STROKE;
  context.stroke();
}

export function drawOllTopPatternOnCanvas(
  context: CanvasRenderingContext2D,
  canvasCssSize: number,
  pattern: OllTopPattern,
  palette: Record<PaletteKey, string>
) {
  const s = canvasCssSize;
  const margin = s * 0.05;
  const band = Math.max(2.5, s * 0.082);
  const gap = s * 0.05;
  const inner = s - 2 * margin - 2 * band;
  const cell = (inner - 2 * gap) / 3;
  const lineWidth = clamp(s * 0.014, 0.55, 1.05);

  const faceX = margin + band;
  const faceY = margin + band;

  context.clearRect(0, 0, s, s);

  const yellowHex = palette.yellow;
  const whiteHex = palette.white;

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const index = row * 3 + col;
      const cx = faceX + col * (cell + gap);
      const cy = faceY + row * (cell + gap);
      drawFlatCell(context, cx, cy, cell, cell, pattern.face[index], yellowHex, whiteHex, lineWidth);
    }
  }

  const { corners: c, edgeMids: e } = pattern;
  const barAlong = cell * 0.72;
  const barThick = Math.max(2, band * 0.62);
  const inset = (cell - barAlong) / 2;
  const colOffset = (col: number) => faceX + col * (cell + gap) + inset;

  const topBarY = margin + (band - barThick) / 2;
  const botBarY = s - margin - band + (band - barThick) / 2;
  const leftBarX = margin + (band - barThick) / 2;
  const rightBarX = s - margin - band + (band - barThick) / 2;
  const rowOffset = (row: number) => faceY + row * (cell + gap) + inset;

  if (c.topLeft.top) {
    drawFlatBar(context, colOffset(0), topBarY, barAlong, barThick, yellowHex, lineWidth);
  }
  if (c.topRight.top) {
    drawFlatBar(
      context,
      colOffset(2),
      topBarY,
      barAlong,
      barThick,
      yellowHex,
      lineWidth
    );
  }
  if (e.topCenter) {
    drawFlatBar(context, colOffset(1), topBarY, barAlong, barThick, yellowHex, lineWidth);
  }
  if (c.bottomLeft.bottom) {
    drawFlatBar(context, colOffset(0), botBarY, barAlong, barThick, yellowHex, lineWidth);
  }
  if (c.bottomRight.bottom) {
    drawFlatBar(
      context,
      colOffset(2),
      botBarY,
      barAlong,
      barThick,
      yellowHex,
      lineWidth
    );
  }
  if (e.bottomCenter) {
    drawFlatBar(context, colOffset(1), botBarY, barAlong, barThick, yellowHex, lineWidth);
  }

  if (c.topLeft.left) {
    drawFlatBar(
      context,
      leftBarX,
      rowOffset(0),
      barThick,
      barAlong,
      yellowHex,
      lineWidth
    );
  }
  if (c.bottomLeft.left) {
    drawFlatBar(
      context,
      leftBarX,
      rowOffset(2),
      barThick,
      barAlong,
      yellowHex,
      lineWidth
    );
  }
  if (e.leftMiddle) {
    drawFlatBar(context, leftBarX, rowOffset(1), barThick, barAlong, yellowHex, lineWidth);
  }
  if (c.topRight.right) {
    drawFlatBar(
      context,
      rightBarX,
      rowOffset(0),
      barThick,
      barAlong,
      yellowHex,
      lineWidth
    );
  }
  if (c.bottomRight.right) {
    drawFlatBar(
      context,
      rightBarX,
      rowOffset(2),
      barThick,
      barAlong,
      yellowHex,
      lineWidth
    );
  }
  if (e.rightMiddle) {
    drawFlatBar(context, rightBarX, rowOffset(1), barThick, barAlong, yellowHex, lineWidth);
  }
}

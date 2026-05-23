import type { PaletteKey } from "../../core/cubieModel";
import { shadeColor, tintColor } from "../../core/color";
import {
  faceCellOrigin,
  fillGradientQuad,
  getTopFlatGridLayout,
  topFlatQuadStrokeOptions,
  TOP_FLAT_CUBIE_STROKE,
  type FlatPoint
} from "../topFlatGridLayout";
import type { PllGridCell, PllTopArrow, PllTopViewModel } from "../../core/pll/pllTopTypes";

const ARROW_COLOR = "#7c7c7d";
const ARROW_SHAFT_WIDTH_CSS_PX = 2;

function drawPaletteCell(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  paletteKey: PaletteKey,
  palette: Record<PaletteKey, string>,
  lineWidth: number
) {
  const color = palette[paletteKey] ?? palette.white;
  const gradient = context.createLinearGradient(x, y, x + w * 0.9, y + h * 0.9);
  gradient.addColorStop(0, tintColor(color, 0.1));
  gradient.addColorStop(1, shadeColor(color, 0.1));
  context.fillStyle = gradient;
  context.beginPath();
  context.rect(x, y, w, h);
  context.fill();
  context.lineJoin = "miter";
  context.lineCap = "butt";
  context.lineWidth = lineWidth;
  context.strokeStyle = TOP_FLAT_CUBIE_STROKE;
  context.stroke();
}

function cellCenter(
  faceX: number,
  faceY: number,
  cell: number,
  gap: number,
  grid: PllGridCell
): { x: number; y: number } {
  return {
    x: faceX + grid.col * (cell + gap) + cell / 2,
    y: faceY + grid.row * (cell + gap) + cell / 2
  };
}

function drawArrowHead(
  context: CanvasRenderingContext2D,
  tipX: number,
  tipY: number,
  dirInX: number,
  dirInY: number,
  headLen: number
) {
  const wing = headLen * 0.52;
  const backX = tipX + dirInX * headLen;
  const backY = tipY + dirInY * headLen;
  const px = -dirInY * wing;
  const py = dirInX * wing;
  context.beginPath();
  context.moveTo(tipX, tipY);
  context.lineTo(backX + px, backY + py);
  context.lineTo(backX - px, backY - py);
  context.closePath();
  context.fillStyle = ARROW_COLOR;
  context.fill();
}

function arrowHeadLength(cell: number, segmentLen: number): number {
  return Math.min(Math.max(4, cell * 0.14) + 1, segmentLen / 2 - 0.5);
}

/** Double arrow whose tips sit exactly on the two cubie centers; shaft joins the head bases. */
function drawDoubleArrow(
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cell: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const headLen = arrowHeadLength(cell, len);

  const tip1x = x1;
  const tip1y = y1;
  const tip2x = x2;
  const tip2y = y2;

  const sx = tip1x + ux * headLen;
  const sy = tip1y + uy * headLen;
  const ex = tip2x - ux * headLen;
  const ey = tip2y - uy * headLen;

  context.save();
  context.strokeStyle = ARROW_COLOR;
  context.lineWidth = ARROW_SHAFT_WIDTH_CSS_PX;
  context.lineCap = "butt";
  context.lineJoin = "miter";
  context.beginPath();
  context.moveTo(sx, sy);
  context.lineTo(ex, ey);
  context.stroke();

  drawArrowHead(context, tip1x, tip1y, ux, uy, headLen);
  drawArrowHead(context, tip2x, tip2y, -ux, -uy, headLen);
  context.restore();
}

/** Single arrow from first center to second; head at `(x2, y2)`. */
function drawSingleArrow(
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cell: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const headLen = arrowHeadLength(cell, len);

  const sx = x1 + ux * headLen;
  const sy = y1 + uy * headLen;
  const ex = x2 - ux * headLen;
  const ey = y2 - uy * headLen;

  context.save();
  context.strokeStyle = ARROW_COLOR;
  context.lineWidth = ARROW_SHAFT_WIDTH_CSS_PX;
  context.lineCap = "butt";
  context.lineJoin = "miter";
  context.beginPath();
  context.moveTo(sx, sy);
  context.lineTo(ex, ey);
  context.stroke();

  drawArrowHead(context, x2, y2, -ux, -uy, headLen);
  context.restore();
}

function drawPllArrowSegment(
  context: CanvasRenderingContext2D,
  arrow: PllTopArrow,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cell: number
) {
  if (arrow.doubleHeaded === false) {
    drawSingleArrow(context, x1, y1, x2, y2, cell);
  } else {
    drawDoubleArrow(context, x1, y1, x2, y2, cell);
  }
}

function pllTopTrap(
  colBarLeft: (col: number) => number,
  topBarY: number,
  barAlong: number,
  barThick: number,
  trapSkew: number,
  col: number
): FlatPoint[] {
  const x0 = colBarLeft(col);
  const y0 = topBarY;
  return [
    { x: x0 + trapSkew, y: y0 },
    { x: x0 + barAlong - trapSkew, y: y0 },
    { x: x0 + barAlong, y: y0 + barThick },
    { x: x0, y: y0 + barThick }
  ];
}

function pllBottomTrap(
  colBarLeft: (col: number) => number,
  botBarY: number,
  barAlong: number,
  barThick: number,
  trapSkew: number,
  col: number
): FlatPoint[] {
  const x0 = colBarLeft(col);
  const y0 = botBarY;
  return [
    { x: x0, y: y0 },
    { x: x0 + barAlong, y: y0 },
    { x: x0 + barAlong - trapSkew, y: y0 + barThick },
    { x: x0 + trapSkew, y: y0 + barThick }
  ];
}

function pllLeftTrap(
  rowBarTop: (row: number) => number,
  leftBarX: number,
  barAlong: number,
  barThick: number,
  trapSkew: number,
  row: number
): FlatPoint[] {
  const x0 = leftBarX;
  const y0 = rowBarTop(row);
  return [
    { x: x0, y: y0 + trapSkew },
    { x: x0 + barThick, y: y0 },
    { x: x0 + barThick, y: y0 + barAlong },
    { x: x0, y: y0 + barAlong - trapSkew }
  ];
}

function pllRightTrap(
  rowBarTop: (row: number) => number,
  rightBarX: number,
  barAlong: number,
  barThick: number,
  trapSkew: number,
  row: number
): FlatPoint[] {
  const x0 = rightBarX;
  const y0 = rowBarTop(row);
  return [
    { x: x0, y: y0 },
    { x: x0 + barThick, y: y0 + trapSkew },
    { x: x0 + barThick, y: y0 + barAlong - trapSkew },
    { x: x0, y: y0 + barAlong }
  ];
}

export function drawPllTopPatternOnCanvas(
  context: CanvasRenderingContext2D,
  canvasCssSize: number,
  model: PllTopViewModel,
  palette: Record<PaletteKey, string>
) {
  const layout = getTopFlatGridLayout(canvasCssSize);
  const quadStroke = topFlatQuadStrokeOptions(layout.lineWidthThin);
  const {
    s,
    gap,
    cell,
    faceX,
    faceY,
    lineWidthThin,
    barAlong,
    barThick,
    trapSkew,
    topBarY,
    botBarY,
    leftBarX,
    rightBarX,
    colBarLeft,
    rowBarTop
  } = layout;

  context.clearRect(0, 0, s, s);

  for (let col = 0; col < 3; col += 1) {
    const stripKey = model.topStrip[col] ?? "white";
    const hex = palette[stripKey] ?? palette.white;
    fillGradientQuad(context, pllTopTrap(colBarLeft, topBarY, barAlong, barThick, trapSkew, col), hex, quadStroke);
  }

  for (let col = 0; col < 3; col += 1) {
    const stripKey = model.bottomStrip[col] ?? "white";
    const hex = palette[stripKey] ?? palette.white;
    fillGradientQuad(context, pllBottomTrap(colBarLeft, botBarY, barAlong, barThick, trapSkew, col), hex, quadStroke);
  }

  for (let row = 0; row < 3; row += 1) {
    const stripKey = model.leftStrip[row] ?? "white";
    const hex = palette[stripKey] ?? palette.white;
    fillGradientQuad(context, pllLeftTrap(rowBarTop, leftBarX, barAlong, barThick, trapSkew, row), hex, quadStroke);
  }

  for (let row = 0; row < 3; row += 1) {
    const stripKey = model.rightStrip[row] ?? "white";
    const hex = palette[stripKey] ?? palette.white;
    fillGradientQuad(context, pllRightTrap(rowBarTop, rightBarX, barAlong, barThick, trapSkew, row), hex, quadStroke);
  }

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const index = row * 3 + col;
      const { x: cx, y: cy } = faceCellOrigin(faceX, faceY, cell, gap, row, col);
      drawPaletteCell(
        context,
        cx,
        cy,
        cell,
        cell,
        model.face9[index] ?? "white",
        palette,
        lineWidthThin
      );
    }
  }

  for (const arrow of model.arrows) {
    const p1 = cellCenter(faceX, faceY, cell, gap, arrow.from);
    const p2 = cellCenter(faceX, faceY, cell, gap, arrow.to);
    drawPllArrowSegment(context, arrow, p1.x, p1.y, p2.x, p2.y, cell);
  }
}

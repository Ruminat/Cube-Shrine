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
import type { OllTopPattern } from "../../core/oll/extractOllTopPattern";

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
  context.strokeStyle = TOP_FLAT_CUBIE_STROKE;
  context.stroke();
}

function outerTopTrap(
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

function outerBottomTrap(
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

function outerLeftTrap(
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

function outerRightTrap(
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

export function drawOllTopPatternOnCanvas(
  context: CanvasRenderingContext2D,
  canvasCssSize: number,
  pattern: OllTopPattern,
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

  const yellowHex = palette.yellow;
  const whiteHex = palette.white;

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const index = row * 3 + col;
      const { x: cx, y: cy } = faceCellOrigin(faceX, faceY, cell, gap, row, col);
      drawFlatCell(context, cx, cy, cell, cell, pattern.face[index], yellowHex, whiteHex, lineWidthThin);
    }
  }

  const { corners: c, edgeMids: e } = pattern;

  if (c.topLeft.top) {
    fillGradientQuad(
      context,
      outerTopTrap(colBarLeft, topBarY, barAlong, barThick, trapSkew, 0),
      yellowHex,
      quadStroke
    );
  }
  if (c.topRight.top) {
    fillGradientQuad(
      context,
      outerTopTrap(colBarLeft, topBarY, barAlong, barThick, trapSkew, 2),
      yellowHex,
      quadStroke
    );
  }
  if (e.topCenter) {
    fillGradientQuad(
      context,
      outerTopTrap(colBarLeft, topBarY, barAlong, barThick, trapSkew, 1),
      yellowHex,
      quadStroke
    );
  }
  if (c.bottomLeft.bottom) {
    fillGradientQuad(
      context,
      outerBottomTrap(colBarLeft, botBarY, barAlong, barThick, trapSkew, 0),
      yellowHex,
      quadStroke
    );
  }
  if (c.bottomRight.bottom) {
    fillGradientQuad(
      context,
      outerBottomTrap(colBarLeft, botBarY, barAlong, barThick, trapSkew, 2),
      yellowHex,
      quadStroke
    );
  }
  if (e.bottomCenter) {
    fillGradientQuad(
      context,
      outerBottomTrap(colBarLeft, botBarY, barAlong, barThick, trapSkew, 1),
      yellowHex,
      quadStroke
    );
  }

  if (c.topLeft.left) {
    fillGradientQuad(
      context,
      outerLeftTrap(rowBarTop, leftBarX, barAlong, barThick, trapSkew, 0),
      yellowHex,
      quadStroke
    );
  }
  if (c.bottomLeft.left) {
    fillGradientQuad(
      context,
      outerLeftTrap(rowBarTop, leftBarX, barAlong, barThick, trapSkew, 2),
      yellowHex,
      quadStroke
    );
  }
  if (e.leftMiddle) {
    fillGradientQuad(
      context,
      outerLeftTrap(rowBarTop, leftBarX, barAlong, barThick, trapSkew, 1),
      yellowHex,
      quadStroke
    );
  }
  if (c.topRight.right) {
    fillGradientQuad(
      context,
      outerRightTrap(rowBarTop, rightBarX, barAlong, barThick, trapSkew, 0),
      yellowHex,
      quadStroke
    );
  }
  if (c.bottomRight.right) {
    fillGradientQuad(
      context,
      outerRightTrap(rowBarTop, rightBarX, barAlong, barThick, trapSkew, 2),
      yellowHex,
      quadStroke
    );
  }
  if (e.rightMiddle) {
    fillGradientQuad(
      context,
      outerRightTrap(rowBarTop, rightBarX, barAlong, barThick, trapSkew, 1),
      yellowHex,
      quadStroke
    );
  }
}

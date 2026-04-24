import { describe, expect, it, vi } from "vitest";
import { getCanonicalOllTopPatternFromNotation } from "../core/oll/getOllTopPatternFromNotation";
import type { OllTopPattern } from "../core/oll/extractOllTopPattern";
import { drawOllTopPatternOnCanvas } from "./draw/drawOllTopPatternOnCanvas";

const TEST_PALETTE = {
  white: "#f5f5f5",
  yellow: "#fbbf24",
  red: "#ef4444",
  orange: "#f97316",
  green: "#22c55e",
  blue: "#3b82f6"
} as const;

/** Counts outer strip quads drawn by `drawOllTopPatternOnCanvas` — keep in sync with that function’s conditionals. */
function countOuterStripQuads(pattern: OllTopPattern): number {
  const { corners: c, edgeMids: e } = pattern;
  let n = 0;
  if (c.topLeft.top) n += 1;
  if (c.topRight.top) n += 1;
  if (e.topCenter) n += 1;
  if (c.bottomLeft.bottom) n += 1;
  if (c.bottomRight.bottom) n += 1;
  if (e.bottomCenter) n += 1;
  if (c.topLeft.left) n += 1;
  if (c.bottomLeft.left) n += 1;
  if (e.leftMiddle) n += 1;
  if (c.topRight.right) n += 1;
  if (c.bottomRight.right) n += 1;
  if (e.rightMiddle) n += 1;
  return n;
}

function createCounting2dContext(canvasCssSize: number): {
  ctx: CanvasRenderingContext2D;
  fillCount: () => number;
  clearRectCalls: [number, number, number, number][];
} {
  let fills = 0;
  const clearRectCalls: [number, number, number, number][] = [];

  const ctx = {
    canvas: { width: canvasCssSize, height: canvasCssSize },
    clearRect: vi.fn((x: number, y: number, w: number, h: number) => {
      clearRectCalls.push([x, y, w, h]);
    }),
    createLinearGradient: () => ({
      addColorStop: vi.fn()
    }),
    fillStyle: "" as string | CanvasGradient,
    strokeStyle: "",
    lineWidth: 1,
    lineJoin: "miter",
    lineCap: "butt",
    beginPath: vi.fn(),
    rect: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(() => {
      fills += 1;
    }),
    stroke: vi.fn()
  };

  return {
    ctx: ctx as unknown as CanvasRenderingContext2D,
    fillCount: () => fills,
    clearRectCalls
  };
}

function emptyFacePattern(): OllTopPattern {
  const dead = {
    topLeft: { top: false, left: false },
    topRight: { top: false, right: false },
    bottomLeft: { bottom: false, left: false },
    bottomRight: { bottom: false, right: false }
  };
  const deadEdge = {
    topCenter: false,
    bottomCenter: false,
    leftMiddle: false,
    rightMiddle: false
  };
  return {
    face: [false, false, false, false, false, false, false, false, false],
    corners: dead,
    edgeMids: deadEdge
  };
}

describe("drawOllTopPatternOnCanvas", () => {
  it("clears the full canvas once before drawing", () => {
    const size = 88;
    const { ctx, clearRectCalls } = createCounting2dContext(size);
    drawOllTopPatternOnCanvas(ctx, size, emptyFacePattern(), TEST_PALETTE);
    expect(clearRectCalls).toEqual([[0, 0, size, size]]);
  });

  it("performs nine face-cell fills plus one fill per active outer strip quad", () => {
    const size = 96;
    const pattern: OllTopPattern = {
      face: [true, false, true, false, true, false, true, false, true],
      corners: {
        topLeft: { top: true, left: false },
        topRight: { top: false, right: true },
        bottomLeft: { bottom: true, left: true },
        bottomRight: { bottom: false, right: false }
      },
      edgeMids: {
        topCenter: false,
        bottomCenter: true,
        leftMiddle: false,
        rightMiddle: true
      }
    };
    const outer = countOuterStripQuads(pattern);
    expect(outer).toBe(6);

    const { ctx, fillCount } = createCounting2dContext(size);
    drawOllTopPatternOnCanvas(ctx, size, pattern, TEST_PALETTE);
    expect(fillCount()).toBe(9 + outer);
  });

  it("draws only the nine face fills when all outer indicators are off", () => {
    const size = 64;
    const { ctx, fillCount } = createCounting2dContext(size);
    const p = emptyFacePattern();
    p.face = p.face.map(() => true);
    drawOllTopPatternOnCanvas(ctx, size, p, TEST_PALETTE);
    expect(fillCount()).toBe(9);
  });

  it("covers all twelve outer slots when every outer flag is true", () => {
    const size = 72;
    const pattern: OllTopPattern = {
      face: [false, false, false, false, true, false, false, false, false],
      corners: {
        topLeft: { top: true, left: true },
        topRight: { top: true, right: true },
        bottomLeft: { bottom: true, left: true },
        bottomRight: { bottom: true, right: true }
      },
      edgeMids: {
        topCenter: true,
        bottomCenter: true,
        leftMiddle: true,
        rightMiddle: true
      }
    };
    expect(countOuterStripQuads(pattern)).toBe(12);

    const { ctx, fillCount } = createCounting2dContext(size);
    drawOllTopPatternOnCanvas(ctx, size, pattern, TEST_PALETTE);
    expect(fillCount()).toBe(21);
  });

  it("does not throw for minimal canvas CSS size used in layout clamps", () => {
    const size = 8;
    const { ctx } = createCounting2dContext(size);
    expect(() => drawOllTopPatternOnCanvas(ctx, size, emptyFacePattern(), TEST_PALETTE)).not.toThrow();
  });

  it("matches fill budget for a canonical Shoelaces model from notation", () => {
    const { pattern } = getCanonicalOllTopPatternFromNotation("(R U R' U') (R' F R F')");
    const outer = countOuterStripQuads(pattern);
    const size = 80;
    const { ctx, fillCount } = createCounting2dContext(size);
    drawOllTopPatternOnCanvas(ctx, size, pattern, TEST_PALETTE);
    expect(fillCount()).toBe(9 + outer);
  });
});

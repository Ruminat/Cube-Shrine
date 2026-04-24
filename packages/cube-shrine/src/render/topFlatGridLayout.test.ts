import { describe, expect, it, vi } from "vitest";
import { faceCellOrigin, fillGradientQuad, getTopFlatGridLayout } from "./topFlatGridLayout";

describe("getTopFlatGridLayout", () => {
  it("packs horizontal bands so margins plus strips plus face width equals canvas width", () => {
    const s = 200;
    const { margin, barThick, cell } = getTopFlatGridLayout(s);
    expect(2 * margin + 2 * barThick + 3 * cell).toBe(s);
  });

  it("uses zero gap between face cells (PLL/OLL nets align flush)", () => {
    expect(getTopFlatGridLayout(120).gap).toBe(0);
  });

  it("keeps face grid inside canvas for small CSS sizes (margins shrink below 1px when s is tiny)", () => {
    const { s, margin, faceX, faceY, cell } = getTopFlatGridLayout(8);
    expect(faceX + 3 * cell).toBeLessThanOrEqual(s + 1e-9);
    expect(faceY + 3 * cell).toBeLessThanOrEqual(s + 1e-9);
    expect(margin).toBeGreaterThan(0);
    expect(cell).toBeGreaterThan(0);
  });

  it("places row 0 col 0 at the back-left U slot origin (top-left of diagram)", () => {
    const { faceX, faceY, cell, gap } = getTopFlatGridLayout(100);
    expect(faceCellOrigin(faceX, faceY, cell, gap, 0, 0)).toEqual({ x: faceX, y: faceY });
  });

  it("advances faceCellOrigin by one cell per row and column", () => {
    const { faceX, faceY, cell, gap } = getTopFlatGridLayout(140);
    const o00 = faceCellOrigin(faceX, faceY, cell, gap, 0, 0);
    const o01 = faceCellOrigin(faceX, faceY, cell, gap, 0, 1);
    const o10 = faceCellOrigin(faceX, faceY, cell, gap, 1, 0);
    expect(o01.x - o00.x).toBe(cell + gap);
    expect(o10.y - o00.y).toBe(cell + gap);
  });
});

describe("fillGradientQuad", () => {
  it("fills the path and strokes when stroke options are provided", () => {
    const fill = vi.fn();
    const stroke = vi.fn();
    const beginPath = vi.fn();
    const moveTo = vi.fn();
    const lineTo = vi.fn();
    const closePath = vi.fn();
    const ctx = {
      createLinearGradient: () => ({ addColorStop: vi.fn() }),
      beginPath,
      moveTo,
      lineTo,
      closePath,
      fillStyle: "",
      fill,
      lineJoin: "",
      lineCap: "",
      lineWidth: 0,
      strokeStyle: "",
      stroke
    } as unknown as CanvasRenderingContext2D;

    fillGradientQuad(ctx, [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 8 }, { x: 0, y: 8 }], "#ffcc00", {
      stroke: true,
      lineWidth: 1,
      strokeStyle: "#000"
    });

    expect(beginPath).toHaveBeenCalled();
    expect(moveTo).toHaveBeenCalled();
    expect(lineTo).toHaveBeenCalledTimes(3);
    expect(closePath).toHaveBeenCalled();
    expect(fill).toHaveBeenCalledTimes(1);
    expect(stroke).toHaveBeenCalledTimes(1);
  });

  it("skips stroke when stroke flag is false", () => {
    const stroke = vi.fn();
    const ctx = {
      createLinearGradient: () => ({ addColorStop: vi.fn() }),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      fillStyle: "",
      fill: vi.fn(),
      stroke
    } as unknown as CanvasRenderingContext2D;

    fillGradientQuad(ctx, [{ x: 1, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 4 }, { x: 1, y: 4 }], "#ffffff", {
      stroke: false,
      lineWidth: 2,
      strokeStyle: "#111"
    });

    expect(stroke).not.toHaveBeenCalled();
  });
});

import type { Cubie, NormalKey, PaletteKey, Vector3 } from "../core/cubieModel";
import { normalToVector } from "../core/geometry";
import { clamp, normalizeVector, shadeColor, tintColor } from "../core/color";

const LIGHT_DIRECTION = normalizeVector({ x: 0.45, y: 1, z: 0.7 });

export const projectCubePoint = (point: Vector3, tile: number, size: number) => ({
  x: size * 0.5 + (point.x - point.z) * tile,
  y: size * 0.55 + (point.x + point.z) * tile * 0.5 - point.y * tile
});

const tangentVectors: Record<NormalKey, [Vector3, Vector3]> = {
  "x+": [{ x: 0, y: -1, z: 0 }, { x: 0, y: 0, z: -1 }],
  "x-": [{ x: 0, y: -1, z: 0 }, { x: 0, y: 0, z: 1 }],
  "y+": [{ x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: -1 }],
  "y-": [{ x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }],
  "z+": [{ x: 1, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }],
  "z-": [{ x: -1, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }]
};

export const computeStickerCorners2D = (
  cubie: Cubie,
  normal: NormalKey,
  tile: number,
  size: number,
  uHalf: number,
  vHalf: number
): { x: number; y: number }[] => {
  const normalVector = normalToVector(normal);
  const center = {
    x: cubie.x + normalVector.x * 0.5,
    y: cubie.y + normalVector.y * 0.5,
    z: cubie.z + normalVector.z * 0.5
  };
  const [u, v] = tangentVectors[normal];
  const corners3 = [
    { x: center.x - u.x * uHalf - v.x * vHalf, y: center.y - u.y * uHalf - v.y * vHalf, z: center.z - u.z * uHalf - v.z * vHalf },
    { x: center.x + u.x * uHalf - v.x * vHalf, y: center.y + u.y * uHalf - v.y * vHalf, z: center.z + u.z * uHalf - v.z * vHalf },
    { x: center.x + u.x * uHalf + v.x * vHalf, y: center.y + u.y * uHalf + v.y * vHalf, z: center.z + u.z * uHalf + v.z * vHalf },
    { x: center.x - u.x * uHalf + v.x * vHalf, y: center.y - u.y * uHalf + v.y * vHalf, z: center.z - u.z * uHalf + v.z * vHalf }
  ];
  return corners3.map((corner) => projectCubePoint(corner, tile, size));
};

export type DrawStickerFaceOptions = {
  context: CanvasRenderingContext2D;
  cubie: Cubie;
  normal: NormalKey;
  color: string;
  tile: number;
  size: number;
  compactFill: boolean;
  /** Default 0.48 — smaller values add visible gap between stickers (same as main cube). */
  stickerHalf?: number;
  uHalf?: number;
  vHalf?: number;
  /** When set, overrides `clamp(tile * 0.045, …)` stroke width. */
  outlineLineWidth?: number;
};

export const drawStickerFace = ({
  context,
  cubie,
  normal,
  color,
  tile,
  size,
  compactFill,
  stickerHalf = 0.48,
  uHalf,
  vHalf,
  outlineLineWidth
}: DrawStickerFaceOptions) => {
  const normalVector = normalToVector(normal);
  const uh = uHalf ?? stickerHalf;
  const vh = vHalf ?? stickerHalf;
  const projected = computeStickerCorners2D(cubie, normal, tile, size, uh, vh);
  const lightStrength = Math.max(
    0,
    normalVector.x * LIGHT_DIRECTION.x +
      normalVector.y * LIGHT_DIRECTION.y +
      normalVector.z * LIGHT_DIRECTION.z
  );
  const shadeAmount = 0.2 - lightStrength * 0.08;
  const topGlowAmount = 0.12 + lightStrength * 0.18;

  context.beginPath();
  context.moveTo(projected[0].x, projected[0].y);
  context.lineTo(projected[1].x, projected[1].y);
  context.lineTo(projected[2].x, projected[2].y);
  context.lineTo(projected[3].x, projected[3].y);
  context.closePath();

  if (compactFill) {
    context.fillStyle = shadeColor(tintColor(color, topGlowAmount * 0.55), shadeAmount * 0.65);
  } else {
    const gradient = context.createLinearGradient(
      projected[0].x,
      projected[0].y,
      projected[2].x,
      projected[2].y
    );
    gradient.addColorStop(0, tintColor(color, topGlowAmount));
    gradient.addColorStop(1, shadeColor(color, shadeAmount));
    context.fillStyle = gradient;
  }

  context.fill();
  context.lineJoin = "round";
  context.lineCap = "round";
  context.lineWidth = outlineLineWidth ?? clamp(tile * 0.045, 1.2, 2.8);
  context.strokeStyle = "rgba(31, 41, 55, 0.85)";
  context.stroke();
};

type DrawCubeOptions = {
  compactFill?: boolean;
};

export const drawCube = (
  context: CanvasRenderingContext2D,
  cubies: Cubie[],
  size: number,
  palette: Record<PaletteKey, string>,
  options?: DrawCubeOptions
) => {
  const compactFill = options?.compactFill ?? false;
  context.clearRect(0, 0, size, size);
  const tile = size / 7.2;
  const visibleFaces: NormalKey[] = ["y+", "x+", "z+"];

  const surfaces = cubies
    .flatMap((cubie) =>
      visibleFaces
        .filter((normal) => cubie.stickers[normal])
        .map((normal) => ({
          cubie,
          normal,
          colorKey: cubie.stickers[normal] as PaletteKey,
          depth: cubie.x + cubie.z - cubie.y
        }))
    )
    .sort((a, b) => a.depth - b.depth);

  surfaces.forEach((surface) => {
    drawStickerFace({
      context,
      cubie: surface.cubie,
      normal: surface.normal,
      color: palette[surface.colorKey],
      tile,
      size,
      compactFill
    });
  });
};

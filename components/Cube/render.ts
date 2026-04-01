import type { Cubie, NormalKey, PaletteKey, Vector3 } from "./definitions";
import { normalToVector } from "./geometry";
import { clamp, normalizeVector, shadeColor, tintColor } from "./utils";

const LIGHT_DIRECTION = normalizeVector({ x: 0.45, y: 1, z: 0.7 });

const projectPoint = (point: Vector3, tile: number, size: number) => ({
  x: size * 0.5 + (point.x - point.z) * tile,
  y: size * 0.55 + (point.x + point.z) * tile * 0.5 - point.y * tile
});

const drawStickerFace = ({
  context,
  cubie,
  normal,
  color,
  tile,
  size
}: {
  context: CanvasRenderingContext2D;
  cubie: Cubie;
  normal: NormalKey;
  color: string;
  tile: number;
  size: number;
}) => {
  const normalVector = normalToVector(normal);
  const center = {
    x: cubie.x + normalVector.x * 0.5,
    y: cubie.y + normalVector.y * 0.5,
    z: cubie.z + normalVector.z * 0.5
  };

  const tangentVectors: Record<NormalKey, [Vector3, Vector3]> = {
    "x+": [{ x: 0, y: -1, z: 0 }, { x: 0, y: 0, z: -1 }],
    "x-": [{ x: 0, y: -1, z: 0 }, { x: 0, y: 0, z: 1 }],
    "y+": [{ x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: -1 }],
    "y-": [{ x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }],
    "z+": [{ x: 1, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }],
    "z-": [{ x: -1, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }]
  };
  const [u, v] = tangentVectors[normal];
  const half = 0.45;
  const corners = [
    { x: center.x - u.x * half - v.x * half, y: center.y - u.y * half - v.y * half, z: center.z - u.z * half - v.z * half },
    { x: center.x + u.x * half - v.x * half, y: center.y + u.y * half - v.y * half, z: center.z + u.z * half - v.z * half },
    { x: center.x + u.x * half + v.x * half, y: center.y + u.y * half + v.y * half, z: center.z + u.z * half + v.z * half },
    { x: center.x - u.x * half + v.x * half, y: center.y - u.y * half + v.y * half, z: center.z - u.z * half + v.z * half }
  ];
  const projected = corners.map((corner) => projectPoint(corner, tile, size));
  const lightStrength = Math.max(
    0,
    normalVector.x * LIGHT_DIRECTION.x +
      normalVector.y * LIGHT_DIRECTION.y +
      normalVector.z * LIGHT_DIRECTION.z
  );
  const shadeAmount = 0.2 - lightStrength * 0.08;
  const topGlowAmount = 0.12 + lightStrength * 0.18;

  const gradient = context.createLinearGradient(
    projected[0].x,
    projected[0].y,
    projected[2].x,
    projected[2].y
  );
  gradient.addColorStop(0, tintColor(color, topGlowAmount));
  gradient.addColorStop(1, shadeColor(color, shadeAmount));

  context.beginPath();
  context.moveTo(projected[0].x, projected[0].y);
  context.lineTo(projected[1].x, projected[1].y);
  context.lineTo(projected[2].x, projected[2].y);
  context.lineTo(projected[3].x, projected[3].y);
  context.closePath();
  context.fillStyle = gradient;
  context.fill();
  context.lineJoin = "round";
  context.lineCap = "round";
  context.lineWidth = clamp(tile * 0.045, 1.2, 2.8);
  context.strokeStyle = "rgba(31, 41, 55, 0.85)";
  context.stroke();
};

export const drawCube = (
  context: CanvasRenderingContext2D,
  cubies: Cubie[],
  size: number,
  palette: Record<PaletteKey, string>
) => {
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
      size
    });
  });
};

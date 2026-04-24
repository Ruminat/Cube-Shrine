import type { NormalKey, Vector3 } from "./cubieModel";

export const normalToVector = (normal: NormalKey): Vector3 => {
  if (normal === "x+") return { x: 1, y: 0, z: 0 };
  if (normal === "x-") return { x: -1, y: 0, z: 0 };
  if (normal === "y+") return { x: 0, y: 1, z: 0 };
  if (normal === "y-") return { x: 0, y: -1, z: 0 };
  if (normal === "z+") return { x: 0, y: 0, z: 1 };
  return { x: 0, y: 0, z: -1 };
};

export const vectorToNormal = (vector: Vector3): NormalKey => {
  if (vector.x === 1) return "x+";
  if (vector.x === -1) return "x-";
  if (vector.y === 1) return "y+";
  if (vector.y === -1) return "y-";
  if (vector.z === 1) return "z+";
  return "z-";
};

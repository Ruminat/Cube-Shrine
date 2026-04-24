import type { Vector3 } from "./cubieModel";

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const value = hex.replace("#", "").trim();
  if (value.length !== 6) return null;

  const numeric = Number.parseInt(value, 16);
  if (Number.isNaN(numeric)) return null;

  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255
  };
};

export const tintColor = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const channel = (value: number) =>
    Math.round(clamp(value + (255 - value) * amount, 0, 255));

  return `rgb(${channel(rgb.r)}, ${channel(rgb.g)}, ${channel(rgb.b)})`;
};

export const shadeColor = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const channel = (value: number) => Math.round(clamp(value * (1 - amount), 0, 255));

  return `rgb(${channel(rgb.r)}, ${channel(rgb.g)}, ${channel(rgb.b)})`;
};

export const normalizeVector = (vector: Vector3): Vector3 => {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
};

import type { PaletteKey, Vector3 } from "./definitions";

/** Used when `--cube-color-*` CSS variables are missing or not parseable as #RRGGBB (canvas tint/shade). */
const DEFAULT_CUBE_PALETTE_HEX: Record<PaletteKey, string> = {
  white: "#ffffff",
  yellow: "#fcd34d",
  red: "#ef4444",
  orange: "#f97316",
  green: "#22c55e",
  blue: "#3b82f6",
};

export const roundCoord = (value: number): number => Math.round(value);

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const normalizeVector = (vector: Vector3): Vector3 => {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
};

export const getPaletteFromCSS = (): Record<PaletteKey, string> => {
  const style = getComputedStyle(document.documentElement);
  const keys: PaletteKey[] = ["white", "yellow", "red", "orange", "green", "blue"];
  const result = {} as Record<PaletteKey, string>;
  for (const key of keys) {
    const raw = style.getPropertyValue(`--cube-color-${key}`).trim();
    result[key] = hexToRgb(raw) ? raw : DEFAULT_CUBE_PALETTE_HEX[key];
  }
  return result;
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
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

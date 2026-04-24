import { hexToRgb } from "../core/color";
import type { PaletteKey } from "../core/cubieModel";

/** Used when `--cube-color-*` CSS variables are missing or not parseable as #RRGGBB (canvas tint/shade). */
const DEFAULT_CUBE_PALETTE_HEX: Record<PaletteKey, string> = {
  white: "#ffffff",
  yellow: "#fcd34d",
  red: "#ef4444",
  orange: "#f97316",
  green: "#22c55e",
  blue: "#3b82f6"
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

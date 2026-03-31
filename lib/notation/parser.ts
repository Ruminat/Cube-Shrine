import type { RotationStep } from "@/types/cube";

const toAngle = (token: string): RotationStep["angle"] => {
  if (token.endsWith("2")) return 180;
  if (token.endsWith("'")) return -90;
  return 90;
};

export const parseNotation = (notation: string): RotationStep[] =>
  notation
    .split(" ")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((token) => {
      const face = token[0] as RotationStep["face"];
      return { face, angle: toAngle(token) };
    });

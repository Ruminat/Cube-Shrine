import type { RotationStep } from "@/types/cube";

const toAngle = (token: string): RotationStep["angle"] => {
  if (token.endsWith("2")) return 180;
  if (token.endsWith("'")) return -90;
  return 90;
};

const invertAngle = (angle: RotationStep["angle"]): RotationStep["angle"] => {
  if (angle === 180) return 180;
  return (angle * -1) as RotationStep["angle"];
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

export const parseReversedNotation = (notation: string): RotationStep[] =>
  parseNotation(notation)
    .slice()
    .reverse()
    .map((step) => ({ ...step, angle: invertAngle(step.angle) }));

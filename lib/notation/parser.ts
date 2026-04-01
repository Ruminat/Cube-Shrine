import type { RotationStep } from "@/types/cube";

const toAngle = (token: string): RotationStep["angle"] => {
  if (token.includes("2")) return 180;
  if (token.endsWith("'")) return -90;
  return 90;
};

const normalizeMoveToken = (raw: string): string =>
  raw.replace(/^\(+/, "").replace(/\)+$/g, "");

const invertAngle = (angle: RotationStep["angle"]): RotationStep["angle"] => {
  if (angle === 180) return 180;
  return (angle * -1) as RotationStep["angle"];
};

const formatRotationStep = (step: RotationStep): string => {
  const { face, angle } = step;
  if (angle === 180 || angle === -180) {
    return `${face}2`;
  }
  if (angle === -90) {
    return `${face}'`;
  }
  return `${face}`;
};

/** Inverse move sequence (undo order, invert each turn), formatted like the source notation. */
export const invertNotationSequence = (notation: string): string =>
  parseNotation(notation)
    .slice()
    .reverse()
    .map((step) => ({ ...step, angle: invertAngle(step.angle) }))
    .map(formatRotationStep)
    .join(" ");

export const parseNotation = (notation: string): RotationStep[] =>
  notation
    .split(" ")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((raw) => {
      const token = normalizeMoveToken(raw);
      const face = token[0] as RotationStep["face"];
      return { face, angle: toAngle(token) };
    });

export const parseReversedNotation = (notation: string): RotationStep[] =>
  parseNotation(notation)
    .slice()
    .reverse()
    .map((step) => ({ ...step, angle: invertAngle(step.angle) }));

import type { RotationStep } from "../cubeTypes";

const toAngle = (token: string): RotationStep["angle"] => {
  if (token.includes("2")) return 180;
  if (token.endsWith("'")) return -90;
  return 90;
};

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

/** Top-level tokens: parenthesized chunks or single moves (spaces separate tokens; spaces inside `(...)` stay inside the chunk). */
const tokenizeNotation = (notation: string): string[] => {
  const tokens: string[] = [];
  let index = 0;
  const source = notation.trim();

  while (index < source.length) {
    while (index < source.length && source[index] === " ") {
      index += 1;
    }
    if (index >= source.length) break;

    if (source[index] === "(") {
      let depth = 0;
      const start = index;
      while (index < source.length) {
        const char = source[index];
        if (char === "(") depth += 1;
        else if (char === ")") {
          depth -= 1;
          if (depth === 0) {
            index += 1;
            break;
          }
        }
        index += 1;
      }
      tokens.push(source.slice(start, index));
      continue;
    }

    const start = index;
    while (index < source.length && source[index] !== " " && source[index] !== "(") {
      index += 1;
    }
    tokens.push(source.slice(start, index));
  }

  return tokens;
};

const parseAtomicMove = (raw: string): RotationStep => {
  const token = raw.trim();
  const face = token[0] as RotationStep["face"];
  return { face, angle: toAngle(token) };
};

export const parseNotation = (notation: string): RotationStep[] =>
  tokenizeNotation(notation).flatMap((token) => {
    if (token.startsWith("(") && token.endsWith(")")) {
      return parseNotation(token.slice(1, -1));
    }
    return [parseAtomicMove(token)];
  });

/** Inverse move sequence (undo order, invert each turn), preserving top-level bracket groups. */
export const invertNotationSequence = (notation: string): string => {
  const inverted = tokenizeNotation(notation)
    .slice()
    .reverse()
    .map((token) => {
      if (token.startsWith("(") && token.endsWith(")")) {
        const inner = token.slice(1, -1);
        return `(${invertNotationSequence(inner)})`;
      }
      const step = parseAtomicMove(token);
      return formatRotationStep({ ...step, angle: invertAngle(step.angle) });
    });
  return inverted.join(" ");
};

export const parseReversedNotation = (notation: string): RotationStep[] =>
  parseNotation(notation)
    .slice()
    .reverse()
    .map((step) => ({ ...step, angle: invertAngle(step.angle) }));

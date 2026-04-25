/** Faces allowed in generated scrambles (single-layer quarter/half turns only). */
export const SCRAMBLE_FACES = ["U", "D", "L", "R", "F", "B"] as const;
export type ScrambleFace = (typeof SCRAMBLE_FACES)[number];

const AXIS_PAIRS: readonly (readonly ScrambleFace[])[] = [
  ["U", "D"],
  ["L", "R"],
  ["F", "B"],
];

function axisIndex(face: ScrambleFace): number {
  const i = AXIS_PAIRS.findIndex((pair) => pair.includes(face));
  if (i === -1) {
    throw new Error(`Invalid scramble face: ${face}`);
  }
  return i;
}

function randomSuffix(): "" | "'" | "2" {
  const r = Math.random() * 3;
  if (r < 1) return "";
  if (r < 2) return "'";
  return "2";
}

/**
 * Random-state style scramble: only `U`/`D`/`L`/`R`/`F`/`B` with `'`/`2`,
 * never the same face twice in a row (avoids immediate cancellations),
 * never two moves on the same axis back-to-back (e.g. `R` then `L`, `U` then `D`).
 */
export function generateScramble(moveCount = 22): string {
  const tokens: string[] = [];
  let last: ScrambleFace | null = null;

  for (let i = 0; i < moveCount; i += 1) {
    const candidates = SCRAMBLE_FACES.filter((face) => {
      if (last === null) return true;
      if (face === last) return false;
      return axisIndex(face) !== axisIndex(last);
    });
    const face = candidates[Math.floor(Math.random() * candidates.length)]!;
    tokens.push(`${face}${randomSuffix()}`);
    last = face;
  }

  return tokens.join(" ");
}

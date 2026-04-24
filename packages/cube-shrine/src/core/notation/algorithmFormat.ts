import { formatRotationStep, parseAtomicMove, tokenizeNotation } from "./parser";

/** WCA-style atomic token (face + optional `'` / `2` / `2'`). */
const ATOMIC_MOVE_RE = /^([UDLRFBMSudlrfbxyz])(?:2'?|')?$/;

const validateParentheses = (source: string): string | undefined => {
  let depth = 0;
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === "(") depth += 1;
    else if (ch === ")") {
      depth -= 1;
      if (depth < 0) {
        return "Unexpected \")\" in algorithm";
      }
    }
  }
  if (depth > 0) {
    return "Unclosed \"(\" in algorithm";
  }
  return undefined;
};

const isValidAtomicToken = (token: string): boolean => ATOMIC_MOVE_RE.test(token.trim());

const validateTrimmed = (trimmed: string): string | undefined => {
  if (trimmed.length === 0) {
    return undefined;
  }

  const parenErr = validateParentheses(trimmed);
  if (parenErr) {
    return parenErr;
  }

  const tokens = tokenizeNotation(trimmed);
  for (const token of tokens) {
    const t = token.trim();
    if (t.length === 0) {
      return "Empty move token";
    }
    if (t.startsWith("(")) {
      if (!t.endsWith(")")) {
        return "Unclosed parenthesis group";
      }
      const inner = t.slice(1, -1).trim();
      if (inner.length === 0) {
        return "Empty parenthesis group ()";
      }
      const innerErr = validateTrimmed(inner);
      if (innerErr) {
        return innerErr;
      }
    } else if (!isValidAtomicToken(t)) {
      return `Invalid move: ${JSON.stringify(t)}`;
    }
  }

  return undefined;
};

/**
 * Returns `undefined` if `raw` is valid WCA-style notation for this engine (including bracket groups).
 * Otherwise returns a short human-readable error message.
 */
export function validateAlgorithm(raw: string): string | undefined {
  return validateTrimmed(raw.trim());
}

const normalizeTrimmed = (trimmed: string): string => {
  if (trimmed.length === 0) {
    return "";
  }
  const tokens = tokenizeNotation(trimmed);
  return tokens
    .map((token) => {
      const t = token.trim();
      if (t.startsWith("(") && t.endsWith(")")) {
        const inner = t.slice(1, -1).trim();
        return `(${normalizeTrimmed(inner)})`;
      }
      return formatRotationStep(parseAtomicMove(t));
    })
    .join(" ");
};

/**
 * If the algorithm is valid, returns a canonical string: trimmed, single spaces between top-level
 * tokens, no redundant `'` on double turns (`U2'` → `U2`). Returns `undefined` when invalid.
 */
export function normalizeAlgorithm(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (validateTrimmed(trimmed)) {
    return undefined;
  }
  return normalizeTrimmed(trimmed);
}

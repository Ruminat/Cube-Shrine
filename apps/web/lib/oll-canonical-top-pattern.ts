/**
 * Re-export from library source so `apps/web` typecheck matches `getCanonicalOllTopPatternFromNotation`
 * before `packages/cube-shrine/dist` is rebuilt (published types can lag during development).
 */
export {
  getCanonicalOllTopPatternFromNotation,
  type CanonicalOllTopPatternFromNotation
} from "../../../packages/cube-shrine/src/core/oll/getOllTopPatternFromNotation";

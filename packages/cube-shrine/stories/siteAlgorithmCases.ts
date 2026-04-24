import { ollAlgorithms } from "@/data/oll.algs";
import { pllAlgorithms } from "@/data/pll.algs";

/** OLL cases from `apps/web/data/oll.algs.ts`: Cross and Dot shape groups only. */
export const storyOllCases = ollAlgorithms.filter(
  (a) => a.subgroupId === "oll-cross" || a.subgroupId === "oll-dot"
);

const pllStoryIds = ["ua-perm", "ub-perm", "h-perm", "ja-perm", "jb-perm", "t-perm"] as const;

const pllById = new Map(pllAlgorithms.map((a) => [a.id, a]));

/** PLL cases from `apps/web/data/pll.algs.ts`: Ua, Ub, H, Ja, Jb, T (site memorization forms). */
export const storyPllCases = pllStoryIds.map((id) => {
  const alg = pllById.get(id);
  if (!alg) {
    throw new Error(`storyPllCases: missing PLL id "${id}" in apps/web/data/pll.algs.ts`);
  }
  return alg;
});

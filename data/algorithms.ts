import type { Algorithm, AlgorithmCategory } from "@/types/algorithm";
import { pllAlgorithms, pllSubgroupLabels, pllSubgroupOrder } from "@/data/pll.algs";

/** Display order for grouped sections on the home page. */
export const ALGORITHM_CATEGORY_ORDER: AlgorithmCategory[] = ["F2L", "OLL", "PLL"];

export interface AlgorithmSubgroupSection {
  id: string;
  title: string;
  algorithms: Algorithm[];
}

export type AlgorithmCategoryGroup =
  | { category: AlgorithmCategory; variant: "flat"; algorithms: Algorithm[] }
  | { category: AlgorithmCategory; variant: "subgroups"; subgroups: AlgorithmSubgroupSection[] };

function buildPllSubgroups(algorithms: Algorithm[]): AlgorithmSubgroupSection[] {
  const bucket = new Map<string, Algorithm[]>(pllSubgroupOrder.map((id) => [id, []]));
  for (const algorithm of algorithms) {
    const id = algorithm.subgroupId;
    if (!id) continue;
    bucket.get(id)?.push(algorithm);
  }
  return pllSubgroupOrder
    .map((id) => ({
      id,
      title: pllSubgroupLabels[id],
      algorithms: bucket.get(id) ?? []
    }))
    .filter((section) => section.algorithms.length > 0);
}

export function getAlgorithmGroupsByCategory(source: Algorithm[]): AlgorithmCategoryGroup[] {
  const byCategory = new Map<AlgorithmCategory, Algorithm[]>(
    ALGORITHM_CATEGORY_ORDER.map((category) => [category, []])
  );
  for (const algorithm of source) {
    byCategory.get(algorithm.category)?.push(algorithm);
  }

  const groups: AlgorithmCategoryGroup[] = [];
  for (const category of ALGORITHM_CATEGORY_ORDER) {
    const list = byCategory.get(category) ?? [];
    if (list.length === 0) continue;

    if (category === "PLL" && list.every((a) => a.subgroupId)) {
      groups.push({ category, variant: "subgroups", subgroups: buildPllSubgroups(list) });
    } else {
      groups.push({ category, variant: "flat", algorithms: list });
    }
  }
  return groups;
}

export const algorithms: Algorithm[] = pllAlgorithms;

import { persistentAtom } from "@nanostores/persistent";
import * as v from "valibot";

export const algorithmGalleryCategoryFilterSchema = v.picklist(["All", "OLL", "PLL", "F2L"]);

export const algorithmGalleryFilterSchema = v.object({
  category: algorithmGalleryCategoryFilterSchema,
  subgroupId: v.nullable(v.string()),
  searchQuery: v.string(),
});

export type AlgorithmGalleryCategoryFilter = v.InferOutput<typeof algorithmGalleryCategoryFilterSchema>;
export type AlgorithmGalleryFilter = v.InferOutput<typeof algorithmGalleryFilterSchema>;

export const algorithmGalleryFilterDefault: AlgorithmGalleryFilter = {
  category: "All",
  subgroupId: null,
  searchQuery: "",
};

const parseAlgorithmGalleryFilter = v.safeParser(algorithmGalleryFilterSchema);

function parseStoredFilter(raw: string): AlgorithmGalleryFilter {
  try {
    const result = parseAlgorithmGalleryFilter(JSON.parse(raw));
    return result.success ? result.output : algorithmGalleryFilterDefault;
  } catch {
    return algorithmGalleryFilterDefault;
  }
}

/**
 * Algorithms page filters (category, subgroup, search), synced via `localStorage`.
 */
export const algorithmGalleryFilter$ = persistentAtom<AlgorithmGalleryFilter>(
  "cube-shrine:algorithm-gallery-filter",
  algorithmGalleryFilterDefault,
  {
    encode: JSON.stringify,
    decode: parseStoredFilter,
  }
);

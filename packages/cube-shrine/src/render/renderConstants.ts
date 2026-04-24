/** Sizes below this use a lower DPR cap, compact fills, and no pointer hit-target (list thumbnails). */
export const CUBE_FULL_QUALITY_MIN_SIZE_PX = 120;

/** Device DPR is clamped to this for small on-card previews (below `CUBE_FULL_QUALITY_MIN_SIZE_PX`). */
export const CUBE_PREVIEW_DPR_CAP = 2;

/** Device DPR is clamped to this for larger cubes (e.g. modal). */
export const CUBE_DETAIL_DPR_CAP = 2;

import type { CatalogChapterTier } from "../../../data/catalog.types";

export function curriculumBadgeClass(curriculum: string): string {
  const map: Record<string, string> = {
    Foundation: "catalog-badge--foundation",
    DSE: "catalog-badge--dse",
    IB: "catalog-badge--ib",
    "A-Level": "catalog-badge--a-level",
    AP: "catalog-badge--ap",
    IGCSE: "catalog-badge--igcse",
    "Common Core": "catalog-badge--common-core",
  };
  return map[curriculum] ?? "catalog-badge--default";
}

/** Shown on cards when tier is non-foundation; foundation chapters have no extra badge. */
export function tierBadgeLabel(tier?: CatalogChapterTier): string | null {
  if (tier === "non-foundation") return "Extension";
  return null;
}

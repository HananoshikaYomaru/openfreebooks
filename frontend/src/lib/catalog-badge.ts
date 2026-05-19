export function curriculumBadgeClass(curriculum: string): string {
  const map: Record<string, string> = {
    DSE: "catalog-badge--dse",
    IB: "catalog-badge--ib",
    "A-Level": "catalog-badge--a-level",
    AP: "catalog-badge--ap",
    IGCSE: "catalog-badge--igcse",
  };
  return map[curriculum] ?? "catalog-badge--default";
}

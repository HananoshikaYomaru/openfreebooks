import type { CatalogChapter, CatalogChapterTier } from "../../../data/catalog.types";

export type CurriculumCoverageRole = "core" | "extension" | "related";

export type CurriculumCoverage = Partial<Record<string, CurriculumCoverageRole>>;

/** Columns on the Compare chapter matrix (includes frameworks beyond filter chips). */
export const COMPARE_MATRIX_COLUMNS = [
  "Foundation",
  "DSE",
  "IGCSE",
  "A-Level",
  "AP",
  "IB",
  "Common Core",
  "Singapore",
  "UK GCSE",
  "Gaokao",
] as const;

export type CompareMatrixColumn = (typeof COMPARE_MATRIX_COLUMNS)[number];

export function coverageRole(
  chapter: CatalogChapter,
  framework: string
): CurriculumCoverageRole | null {
  const coverage = chapter.curriculumCoverage;
  if (coverage && framework in coverage) {
    return coverage[framework] ?? null;
  }
  if (chapter.curriculums?.includes(framework)) {
    return "core";
  }
  return null;
}

/** Framework labels used for catalog filter chips (any mapped role counts). */
export function chapterFilterCurriculums(chapter: CatalogChapter | undefined): string[] {
  if (!chapter) return [];
  const coverage = chapter.curriculumCoverage;
  if (coverage && typeof coverage === "object" && !Array.isArray(coverage)) {
    return Object.keys(coverage);
  }
  if (Array.isArray(chapter.curriculums)) {
    return chapter.curriculums;
  }
  return [];
}

/** DSE compulsory vs M2-style extension when tier is set. */
export function defaultDseRole(tier?: CatalogChapterTier): CurriculumCoverageRole {
  return tier === "non-foundation" ? "extension" : "core";
}

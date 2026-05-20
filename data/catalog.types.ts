export type CatalogChapterTier = "foundation" | "non-foundation";

/** Compare matrix + filter relevance per framework label. */
export type CurriculumCoverageRole = "core" | "extension" | "related";

export type CurriculumCoverage = Partial<Record<string, CurriculumCoverageRole>>;

export type CatalogChapter = {
  slug: string;
  title: string;
  description: string;
  status: "live" | "planned";
  /** @deprecated Prefer curriculumCoverage; kept for older JSON during migration. */
  curriculums?: string[];
  /** Per-framework role for Compare matrix and catalog filters (keys = framework labels). */
  curriculumCoverage?: CurriculumCoverage;
  /** DSE compulsory tier; omit = foundation. */
  tier?: CatalogChapterTier;
};

export type CatalogStrand = {
  id: string;
  title: string;
  chapters: CatalogChapter[];
};

export type CatalogGraphEdge = {
  from: string;
  to: string;
  label?: string;
};

export type CatalogGraph = {
  edges: CatalogGraphEdge[];
};

export type CatalogSubject = {
  id: string;
  name: string;
  /** Root-relative URL, e.g. /catalog/banners/math.webp */
  banner?: string;
  strands: CatalogStrand[];
  graph?: CatalogGraph;
};

export type CatalogData = {
  title: string;
  subtitle: string;
  curriculums: string[];
  subjects: CatalogSubject[];
};

export type CatalogViewMode = "linear" | "tree" | "compare";

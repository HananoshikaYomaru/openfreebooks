export type CatalogChapterTier = "foundation" | "non-foundation";

export type CatalogChapter = {
  slug: string;
  title: string;
  description: string;
  status: "live" | "planned";
  curriculums: string[];
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
  strands: CatalogStrand[];
  graph?: CatalogGraph;
};

export type CatalogData = {
  title: string;
  subtitle: string;
  curriculums: string[];
  subjects: CatalogSubject[];
};

export type CatalogViewMode = "linear" | "tree";

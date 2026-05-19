export type CatalogChapter = {
  slug: string;
  title: string;
  status: "live" | "planned";
  curriculums: string[];
};

export type CatalogStrand = {
  id: string;
  title: string;
  chapters: CatalogChapter[];
};

export type CatalogSubject = {
  id: string;
  name: string;
  strands: CatalogStrand[];
};

export type CatalogData = {
  title: string;
  subtitle: string;
  curriculums: string[];
  subjects: CatalogSubject[];
};

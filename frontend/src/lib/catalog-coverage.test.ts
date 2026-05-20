import { describe, expect, test } from "bun:test";
import { chapterFilterCurriculums, coverageRole } from "./catalog-coverage";
import type { CatalogChapter } from "../../../data/catalog.types";

describe("catalog-coverage", () => {
  test("reads role from curriculumCoverage", () => {
    const chapter: CatalogChapter = {
      slug: "quadratic-equations",
      title: "Quadratic equations",
      description: "",
      status: "live",
      curriculumCoverage: {
        DSE: "core",
        IGCSE: "core",
        IB: "extension",
      },
    };
    expect(coverageRole(chapter, "DSE")).toBe("core");
    expect(coverageRole(chapter, "IB")).toBe("extension");
    expect(coverageRole(chapter, "AP")).toBeNull();
    expect(chapterFilterCurriculums(chapter)).toEqual(["DSE", "IGCSE", "IB"]);
  });
});

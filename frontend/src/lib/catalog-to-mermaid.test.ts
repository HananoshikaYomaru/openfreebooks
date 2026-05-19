import { describe, expect, test } from "bun:test";
import type { CatalogChapter, CatalogSubject } from "../../../data/catalog.types";
import { subjectToMermaid } from "./catalog-to-mermaid";

function chapter(
  slug: string,
  overrides: Partial<CatalogChapter> = {}
): CatalogChapter {
  return {
    slug,
    title: slug,
    description: "desc",
    status: "planned",
    curriculums: ["DSE"],
    ...overrides,
  };
}

const subject: CatalogSubject = {
  id: "math",
  name: "Mathematics",
  strands: [
    {
      id: "strand-a",
      title: "Strand A",
      chapters: [
        chapter("a", { status: "live", title: "A" }),
        chapter("b", { status: "planned", title: "B" }),
      ],
    },
    {
      id: "strand-b",
      title: "Strand B",
      chapters: [chapter("c", { status: "live", title: "C" })],
    },
  ],
  graph: {
    edges: [
      { from: "a", to: "c" },
      { from: "a", to: "c" },
      { from: "b", to: "c", label: "after" },
    ],
  },
};

describe("subjectToMermaid", () => {
  test("returns null when no chapter is visible", () => {
    expect(subjectToMermaid(subject, () => false, "math")).toBeNull();
  });

  test("builds diagram with deduped edges and live chapter links only", () => {
    const diagram = subjectToMermaid(subject, () => true, "math");
    expect(diagram).not.toBeNull();
    const source = diagram!.source;
    expect(diagram!.rootNodeId).toBe("chapter_a");

    expect(source).toContain("flowchart TB");
    expect(source.match(/chapter_a --> chapter_c/g)?.length).toBe(1);
    expect(source).toContain('chapter_b -->|after| chapter_c');
    expect(source).toContain('click chapter_a href "/math/a/"');
    expect(source).toContain('click chapter_c href "/math/c/"');
    expect(source).not.toContain('click chapter_b');
    expect(source).toContain("catalog-mermaid-node__title");
    expect(source).toContain("catalog-mermaid-node__description");
    expect(source).toContain("catalog-mermaid-node__meta");
    expect(source).toContain("catalog-badge--dse");
  });
});
